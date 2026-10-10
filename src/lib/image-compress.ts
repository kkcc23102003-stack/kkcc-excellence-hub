/**
 * Client-side image shrinking for note photos and handwritten pages.
 *
 * Every uploaded image used to go to Supabase Storage at full phone-camera
 * size (3–8 MB for one photo). Notes need readable diagrams, not 12 MP
 * originals, so images are resized to a sensible maximum and re-encoded as
 * JPEG before they leave the device. A typical page drops from megabytes to a
 * couple of hundred kilobytes, which keeps the free storage from filling up.
 */

export type CompressOptions = {
  /** Longest side in pixels. A4 pages stay sharp at 1600. */
  maxSize?: number;
  /** JPEG quality (0–1). 0.82 is visually clean for notes. */
  quality?: number;
  /** Skip shrinking when the file is already small (bytes). */
  skipBelowBytes?: number;
};

export type CompressedImage = {
  file: File;
  /** Data URL of the compressed image, ready for the preview canvas. */
  dataUrl: string;
  width: number;
  height: number;
  originalBytes: number;
  bytes: number;
};

const DEFAULTS: Required<CompressOptions> = {
  maxSize: 1600,
  quality: 0.82,
  skipBelowBytes: 240 * 1024,
};

export function humanBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE_DECODE_FAILED"));
    image.src = source;
  });
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("IMAGE_READ_FAILED"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

/**
 * Shrink an image file/Blob. When anything fails (odd formats, HEIC on desktop,
 * SVG) the original file is returned untouched so an upload is never blocked.
 */
export async function compressImageFile(
  input: File | Blob,
  options: CompressOptions = {},
): Promise<CompressedImage> {
  const settings = { ...DEFAULTS, ...options };
  const originalBytes = input.size;
  const fallback = async (): Promise<CompressedImage> => {
    const dataUrl = await fileToDataUrl(input);
    return {
      file: input instanceof File ? input : new File([input], "image.jpg", { type: "image/jpeg" }),
      dataUrl,
      width: 0,
      height: 0,
      originalBytes,
      bytes: originalBytes,
    };
  };

  try {
    const dataUrl = await fileToDataUrl(input);
    const image = await loadImage(dataUrl);
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return await fallback();

    const scale = Math.min(1, settings.maxSize / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    // Already small and not oversized: keep the bytes as they are.
    if (originalBytes <= settings.skipBelowBytes && scale === 1) {
      return {
        file:
          input instanceof File ? input : new File([input], "image.jpg", { type: "image/jpeg" }),
        dataUrl,
        width,
        height,
        originalBytes,
        bytes: originalBytes,
      };
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return await fallback();
    // Notes are read on white paper: flatten transparency onto white first.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const compressedUrl = canvas.toDataURL("image/jpeg", settings.quality);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), "image/jpeg", settings.quality),
    );
    if (!blob) return await fallback();
    if (blob.size >= originalBytes && scale === 1) return await fallback();

    const name = input instanceof File ? input.name.replace(/\.[^.]+$/, "") : "photo";
    return {
      file: new File([blob], `${name || "photo"}.jpg`, { type: "image/jpeg" }),
      dataUrl: compressedUrl,
      width: targetWidth,
      height: targetHeight,
      originalBytes,
      bytes: blob.size,
    };
  } catch {
    return await fallback();
  }
}

/** "2.4 MB → 180 KB (93% bacha)" — shown to the admin after an upload. */
export function savingsLabel(result: CompressedImage): string {
  if (!result.originalBytes || result.bytes >= result.originalBytes)
    return humanBytes(result.bytes);
  const saved = Math.round((1 - result.bytes / result.originalBytes) * 100);
  return `${humanBytes(result.originalBytes)} → ${humanBytes(result.bytes)} (${saved}% bacha)`;
}
