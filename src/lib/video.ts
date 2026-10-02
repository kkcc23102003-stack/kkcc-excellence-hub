/** Video URL helpers. Video sources are stored in the database, never hard-coded. */

const SECURE_VIDEO_PREFIX = "kkccv1.";

/** Extract a YouTube video id from watch / youtu.be / shorts / embed URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  const value = url.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/i,
    /youtu\.be\/([\w-]{11})/i,
    /youtube\.com\/(?:embed|shorts|live|v)\/([\w-]{11})/i,
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function base64UrlEncode(value: string) {
  const encoded =
    typeof btoa === "function" ? btoa(value) : Buffer.from(value, "utf8").toString("base64");
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("utf8");
}

export function encodeSecureVideoToken(url?: string | null): string | null {
  const id = youtubeId(url);
  if (!id) return null;
  const payload = ["yt", id.split("").reverse().join(""), "kkcc-secure-video"].join("|");
  return `${SECURE_VIDEO_PREFIX}${base64UrlEncode(payload)}`;
}

export function isSecureVideoToken(value?: string | null) {
  return Boolean(value?.trim().startsWith(SECURE_VIDEO_PREFIX));
}

export function decodeSecureVideoToken(
  value?: string | null,
): { provider: "youtube"; id: string } | null {
  const token = value?.trim();
  if (!token?.startsWith(SECURE_VIDEO_PREFIX)) return null;
  try {
    const decoded = base64UrlDecode(token.slice(SECURE_VIDEO_PREFIX.length));
    const [provider, reversedId, marker] = decoded.split("|");
    const id = reversedId?.split("").reverse().join("");
    if (provider !== "yt" || marker !== "kkcc-secure-video" || !/^[\w-]{11}$/.test(id ?? "")) {
      return null;
    }
    return { provider: "youtube", id: id ?? "" };
  } catch {
    return null;
  }
}

export function protectVideoUrl(url?: string | null): string | null {
  return encodeSecureVideoToken(url) ?? url?.trim() ?? null;
}

export function youtubeEmbedUrlFromId(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&controls=1&disablekb=1&iv_load_policy=3&playsinline=1`;
}

export function youtubeEmbedUrl(url?: string | null): string | null {
  const id = youtubeId(url);
  return id ? youtubeEmbedUrlFromId(id) : null;
}

export type VideoSource =
  { kind: "youtube"; src: string } | { kind: "file"; src: string } | { kind: "none" };

export function videoSource(url?: string | null): VideoSource {
  const value = url?.trim();
  const secure = decodeSecureVideoToken(value);
  if (secure?.provider === "youtube") {
    return { kind: "youtube", src: `/secure-video.html?token=${encodeURIComponent(value ?? "")}` };
  }

  const embed = youtubeEmbedUrl(value);
  if (embed) {
    const token = encodeSecureVideoToken(value);
    return {
      kind: "youtube",
      src: token ? `/secure-video.html?token=${encodeURIComponent(token)}` : embed,
    };
  }

  if (value && /^https?:\/\//i.test(value)) return { kind: "file", src: value };
  return { kind: "none" };
}

/** Validate a lecture video URL entered in the Admin Panel. Empty is allowed. */
export function validateVideoUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (youtubeId(v)) return null;
  if (!/^https?:\/\//i.test(v)) return "Paste a valid YouTube link starting with https://";
  return "Lectures must use YouTube links only. Upload PDFs/notes in Materials, not video files.";
}
