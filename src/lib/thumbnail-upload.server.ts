/** No SVG/HTML thumbnails: only capped raster files. Never trusts a file extension. */
export function validateThumbnailBytes(bytes: Buffer, mime: string) {
  if (bytes.length < 12 || bytes.length > 4 * 1024 * 1024)
    throw new Error("Thumbnail must be a raster image up to 4 MB after compression.");
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp =
    bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!(
    (mime === "image/png" && png) ||
    (mime === "image/jpeg" && jpeg) ||
    (mime === "image/webp" && webp)
  ))
    throw new Error("Invalid thumbnail image. Use JPG, PNG or WebP.");
}
