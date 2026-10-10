/** Bounded process-local cache: raw and compressed bytes both count. No user data. */
export class AssetCache {
  constructor(maxBytes = 32 * 1024 * 1024, maxEntries = 128) {
    this.maxBytes = maxBytes;
    this.maxEntries = maxEntries;
    this.bytes = 0;
    this.entries = new Map();
  }
  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }
  set(key, value) {
    const previous = this.entries.get(key);
    if (previous) {
      this.bytes -= previous.bytes;
      this.entries.delete(key);
    }
    const bytes = value.raw.byteLength + (value.gzipped?.byteLength || 0);
    if (bytes > this.maxBytes) return;
    this.entries.set(key, { value, bytes });
    this.bytes += bytes;
    while (this.bytes > this.maxBytes || this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      this.bytes -= this.entries.get(oldest).bytes;
      this.entries.delete(oldest);
    }
  }
}
export function acceptsGzip(header) {
  let wildcard = 0;
  for (const item of String(header).toLowerCase().split(",")) {
    const [name, ...params] = item.trim().split(";");
    const quality = params.find((p) => p.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    const accepted = Number.isFinite(q) && q > 0 && q <= 1;
    if (name === "gzip") return accepted;
    if (name === "*") wildcard = accepted ? 1 : 0;
  }
  return Boolean(wildcard);
}
export function matchesEtag(header, etag) {
  return String(header || "")
    .split(",")
    .some(
      (value) =>
        value.trim() === "*" || value.trim().replace(/^W\//, "") === etag.replace(/^W\//, ""),
    );
}
