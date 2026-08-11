/**
 * Browser-side image helpers: everything a listing photo needs before it leaves the
 * device — crop, downscale and compress — so an oversized camera photo is never rejected.
 */

const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.45];
const MAX_SHRINK_ROUNDS = 4;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the image."));
    image.src = src;
  });
}

export async function fileFromDataUrl(dataUrl: string, name: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

/** Any source extension becomes .jpg — the canvas always writes JPEG. */
export function jpegFileName(name: string) {
  const base = name.replace(/\.[^.]+$/, "") || "photo";
  return `${base}.jpg`;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function shrinkCanvas(source: HTMLCanvasElement, factor: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * factor));
  canvas.height = Math.max(1, Math.round(source.height * factor));
  const context = canvas.getContext("2d");
  if (!context) return source;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Walks the quality ladder, then the size ladder, until the JPEG fits within maxBytes. */
export async function canvasToJpegFile(canvas: HTMLCanvasElement, name: string, maxBytes: number) {
  let current = canvas;

  for (let round = 0; round < MAX_SHRINK_ROUNDS; round += 1) {
    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(current, quality);
      if (!blob) continue;
      if (blob.size <= maxBytes) return new File([blob], name, { type: "image/jpeg" });
    }
    current = shrinkCanvas(current, 0.75);
  }

  const blob = await canvasToBlob(current, 0.4);
  if (!blob) throw new Error("Could not process the image.");
  return new File([blob], name, { type: "image/jpeg" });
}

/** Downscale + compress without any cropping — used for gallery photos. */
export async function compressImageFile(
  file: File,
  { maxWidth = 1600, maxBytes }: { maxWidth?: number; maxBytes: number }
) {
  const image = await loadImage(await readFileAsDataUrl(file));
  const scale = Math.min(1, maxWidth / image.naturalWidth);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not process the image.");
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvasToJpegFile(canvas, jpegFileName(file.name), maxBytes);
}
