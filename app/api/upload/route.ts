import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getAuthUser } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import os from "os";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Only image types the optimizer and Cloudinary pipeline actually handle. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif"
};

function isVercelBuild() {
  return process.env.VERCEL === "1";
}

function hasValidCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !["your-cloud", "demo"].includes(cloudName) &&
      !apiKey.includes("1234567890") &&
      !apiSecret.includes("your-secret")
  );
}

async function saveLocally(extension: string, buffer: Buffer) {
  const uploadsDir = isVercelBuild()
    ? join(os.tmpdir(), "uploads")
    : join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  // The extension comes from the validated MIME type, never the client-supplied
  // filename — otherwise an "x.html" upload lands in public/ and gets served back.
  const filename = `${randomUUID()}${extension}`;
  await writeFile(join(uploadsDir, filename), buffer);

  if (isVercelBuild()) {
    throw new Error("Local uploads are not supported on Vercel. Configure Cloudinary or another remote file storage provider.");
  }

  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    // Uploading burns storage quota and publishes a public URL, so it is not
    // something an anonymous visitor should be able to do.
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or AVIF image." },
        { status: 415 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image is too large. Maximum size is 10MB." }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let url: string;

    if (hasValidCloudinaryConfig()) {
      try {
        url = await new Promise<string>((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            {
              folder: "tourism-platform",
              resource_type: "image"
            },
            (error, result) => {
              if (error || !result?.secure_url) {
                reject(error || new Error("Upload failed"));
                return;
              }
              resolve(result.secure_url);
            }
          );

          upload.end(buffer);
        });
      } catch (error) {
        if (isVercelBuild()) {
          throw new Error("Cloudinary upload failed on Vercel. Please verify your Cloudinary credentials in Vercel environment variables.");
        }
        url = await saveLocally(extension, buffer);
      }
    } else {
      if (isVercelBuild()) {
        throw new Error("File uploads are disabled in Vercel because Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
      }
      url = await saveLocally(extension, buffer);
    }

    return NextResponse.json({ url });
  } catch (error) {
    // The messages thrown above are deliberate operator-facing setup guidance, so
    // they stay in the response; everything else is logged rather than echoed.
    console.error("Upload failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
