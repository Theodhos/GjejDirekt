"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { canvasToJpegFile, jpegFileName, loadImage, readFileAsDataUrl } from "@/lib/image-tools";

const COPY = {
  al: {
    title: "Prit foton",
    hint: "Tërhiq kornizën për ta zhvendosur dhe cepat për të zgjedhur pjesën që do të ruash.",
    reset: "Gjithë fotoja",
    cancel: "Anulo",
    save: "Ruaj foton",
    working: "Duke përpunuar...",
    failed: "Fotoja nuk u përpunua dot. Provoni një foto tjetër."
  },
  en: {
    title: "Crop the photo",
    hint: "Drag the frame to move it and the corners to choose the part you want to keep.",
    reset: "Whole photo",
    cancel: "Cancel",
    save: "Save photo",
    working: "Processing...",
    failed: "The photo could not be processed. Try another one."
  }
} as const;

/** Display box for the photo inside the dialog. */
const MAX_BOX_HEIGHT = 400;
/** Smallest crop frame, in on-screen pixels. */
const MIN_CROP = 48;

type Rect = { x: number; y: number; width: number; height: number };
type DragType = "move" | "nw" | "ne" | "sw" | "se";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type Props = {
  file: File;
  maxWidth?: number;
  maxBytes: number;
  onCancel: () => void;
  onSave: (file: File) => void;
};

/**
 * In-app cropper: the whole photo stays visible and the owner drags a crop frame over it.
 * The result is exported and compressed under the upload limit before it ever leaves the browser.
 */
export default function ImageCropper({ file, maxWidth = 1600, maxBytes, onCancel, onSave }: Props) {
  const { language } = useLanguage();
  const c = COPY[language];

  const boxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(MAX_BOX_HEIGHT);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const drag = useRef<{ type: DragType; startX: number; startY: number; rect: Rect } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError("");
    readFileAsDataUrl(file)
      .then(loadImage)
      .then((loaded) => {
        if (!cancelled) setImage(loaded);
      })
      .catch(() => {
        if (!cancelled) setError(c.failed);
      });
    return () => {
      cancelled = true;
    };
  }, [file, c.failed]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => setBoxWidth(box.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Phones get a shorter photo box so the hint and the buttons stay on screen.
  useLayoutEffect(() => {
    const measure = () => setBoxHeight(Math.max(180, Math.min(MAX_BOX_HEIGHT, window.innerHeight * 0.45)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // How many screen pixels one source pixel takes — never upscaled, so the preview stays sharp.
  const fit = image && boxWidth ? Math.min(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight, 1) : 0;
  const displayWidth = image ? image.naturalWidth * fit : 0;
  const displayHeight = image ? image.naturalHeight * fit : 0;

  // The frame starts on the whole photo; cropping is then a matter of pulling it in.
  useEffect(() => {
    if (!displayWidth || !displayHeight) return;
    setRect({ x: 0, y: 0, width: displayWidth, height: displayHeight });
  }, [displayWidth, displayHeight]);

  const startDrag = (type: DragType) => (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    overlayRef.current?.setPointerCapture(event.pointerId);
    drag.current = { type, startX: event.clientX, startY: event.clientY, rect };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    const start = current.rect;

    if (current.type === "move") {
      setRect({
        ...start,
        x: clamp(start.x + dx, 0, displayWidth - start.width),
        y: clamp(start.y + dy, 0, displayHeight - start.height)
      });
      return;
    }

    const right = start.x + start.width;
    const bottom = start.y + start.height;
    const next = { ...start };

    if (current.type === "nw" || current.type === "sw") {
      next.x = clamp(start.x + dx, 0, right - MIN_CROP);
      next.width = right - next.x;
    } else {
      next.width = clamp(start.width + dx, MIN_CROP, displayWidth - start.x);
    }

    if (current.type === "nw" || current.type === "ne") {
      next.y = clamp(start.y + dy, 0, bottom - MIN_CROP);
      next.height = bottom - next.y;
    } else {
      next.height = clamp(start.height + dy, MIN_CROP, displayHeight - start.y);
    }

    setRect(next);
  };

  const endDrag = () => {
    drag.current = null;
  };

  const reset = () => setRect({ x: 0, y: 0, width: displayWidth, height: displayHeight });

  async function save() {
    if (!image || !fit || saving || rect.width < 1 || rect.height < 1) return;
    setSaving(true);
    setError("");
    try {
      // Frame expressed in source-image pixels.
      const sourceWidth = Math.min(rect.width / fit, image.naturalWidth);
      const sourceHeight = Math.min(rect.height / fit, image.naturalHeight);
      const sourceX = clamp(rect.x / fit, 0, image.naturalWidth - sourceWidth);
      const sourceY = clamp(rect.y / fit, 0, image.naturalHeight - sourceHeight);

      const targetWidth = Math.max(1, Math.round(Math.min(maxWidth, sourceWidth)));
      const targetHeight = Math.max(1, Math.round((targetWidth * sourceHeight) / sourceWidth));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("no canvas");
      context.imageSmoothingQuality = "high";
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

      onSave(await canvasToJpegFile(canvas, jpegFileName(file.name), maxBytes));
    } catch {
      setError(c.failed);
    } finally {
      setSaving(false);
    }
  }

  const handleStyle = "absolute h-5 w-5 rounded-full border-2 bg-white";
  const handleBorder = { borderColor: "var(--brand-accent)" };

  const maskPanels: React.CSSProperties[] = [
    { left: 0, top: 0, width: displayWidth, height: rect.y },
    { left: 0, top: rect.y + rect.height, width: displayWidth, height: Math.max(0, displayHeight - rect.y - rect.height) },
    { left: 0, top: rect.y, width: rect.x, height: rect.height },
    {
      left: rect.x + rect.width,
      top: rect.y,
      width: Math.max(0, displayWidth - rect.x - rect.width),
      height: rect.height
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6">
      <div
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        style={{ boxShadow: "var(--shadow-panel)" }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border-soft)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {c.title}
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
            style={{ color: "var(--text-tertiary)" }}
            aria-label={c.cancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-5 py-4">
          <div ref={boxRef} className="flex w-full justify-center">
            {image ? (
              <div className="relative select-none" style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" draggable={false} className="absolute inset-0 h-full w-full" />
                <div
                  ref={overlayRef}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className="absolute inset-0 touch-none"
                >
                  {/* Four panels dim everything the frame leaves out. */}
                  {maskPanels.map((panel, index) => (
                    <div
                      key={index}
                      className="pointer-events-none absolute"
                      style={{ ...panel, background: "rgba(0,0,0,0.55)" }}
                    />
                  ))}

                  <div
                    onPointerDown={startDrag("move")}
                    className="absolute cursor-move border-2 border-white"
                    style={{
                      left: `${rect.x}px`,
                      top: `${rect.y}px`,
                      width: `${rect.width}px`,
                      height: `${rect.height}px`
                    }}
                  >
                    <span
                      onPointerDown={startDrag("nw")}
                      className={`${handleStyle} -left-2.5 -top-2.5 cursor-nwse-resize`}
                      style={handleBorder}
                    />
                    <span
                      onPointerDown={startDrag("ne")}
                      className={`${handleStyle} -right-2.5 -top-2.5 cursor-nesw-resize`}
                      style={handleBorder}
                    />
                    <span
                      onPointerDown={startDrag("sw")}
                      className={`${handleStyle} -bottom-2.5 -left-2.5 cursor-nesw-resize`}
                      style={handleBorder}
                    />
                    <span
                      onPointerDown={startDrag("se")}
                      className={`${handleStyle} -bottom-2.5 -right-2.5 cursor-nwse-resize`}
                      style={handleBorder}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-neutral-900">
                <Loader2 className="h-5 w-5 animate-spin text-white/70" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {c.hint}
            </p>
            {fit > 0 && (
              <span className="shrink-0 text-xs font-semibold" style={{ color: "var(--brand-accent)" }}>
                {Math.round(rect.width / fit)} × {Math.round(rect.height / fit)}
              </span>
            )}
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>

        <div
          className="flex flex-col gap-2 border-t px-5 py-4 sm:flex-row-reverse sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <button
            type="button"
            onClick={save}
            disabled={!image || saving}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white transition-opacity disabled:opacity-60 sm:w-auto sm:px-6"
            style={{ background: "var(--brand-accent)" }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? c.working : c.save}
          </button>
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors hover:bg-neutral-100"
              style={{ color: "var(--text-secondary)" }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {c.reset}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-2 text-xs font-semibold transition-colors hover:bg-neutral-100"
              style={{ color: "var(--text-tertiary)" }}
            >
              {c.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
