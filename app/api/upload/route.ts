import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { randomUUID } from "crypto";
import os from "os";

export const runtime = "nodejs";

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

async function saveLocally(fileName: string, buffer: Buffer) {
  const uploadsDir = isVercelBuild()
    ? join(os.tmpdir(), "uploads")
    : join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  const extension = extname(fileName) || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  await writeFile(join(uploadsDir, filename), buffer);

  if (isVercelBuild()) {
    throw new Error("Local uploads are not supported on Vercel. Configure Cloudinary or another remote file storage provider.");
  }

  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
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
        url = await saveLocally(file.name, buffer);
      }
    } else {
      if (isVercelBuild()) {
        throw new Error("File uploads are disabled in Vercel because Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
      }
      url = await saveLocally(file.name, buffer);
    }

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
