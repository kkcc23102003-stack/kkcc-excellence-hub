/**
 * Per-note control over the generated diagrams.
 *
 * Everything the admin does in the panel — hide a diagram, rename it, replace it
 * with their own photo, add an extra handwritten photo, or switch diagrams off
 * completely — is stored *inside the note text* as one small directive block:
 *
 *   :::visuals {"mode":"none","hide":[2],"rename":{"1":"My title"}}
 *   :::
 *
 * Storing it in the note keeps the database unchanged, keeps a note portable
 * (copy the text = copy the settings), and means the preview, the reader and the
 * printed PDF all read the same single source of truth.
 */
import type { PlacedVisual, VisualSpec } from "./analyze";

export type NoteImage = {
  /** 1-based index of the generated visual this photo replaces, if any. */
  replaces?: number;
  /** 0-based text-block index to place this photo after (defaults to the end). */
  after?: number;
  url: string;
  caption: string;
};

/**
 * The two note types the admin picks between:
 *  - "text"  → typing / paste only (PDF-ready, no handwriting pages)
 *  - "write" → handwriting pages + typed text together (notes-app style)
 */
export type NoteKind = "text" | "write";

export type VisualDirectives = {
  /** "none" = never generate diagrams for this note (text only). */
  mode: "auto" | "none";
  /** Note type: plain text note, or a write + text note. */
  kind: NoteKind;
  /** 1-based numbers of generated visuals to drop. */
  hide: number[];
  /** 1-based numbers → new title. */
  rename: Record<number, string>;
  /** 1-based numbers → photo that replaces the generated drawing. */
  replace: Record<number, { url: string; caption: string }>;
  /** Photos added by the admin, optionally pinned after a given text block. */
  images: NoteImage[];
};

export const EMPTY_DIRECTIVES: VisualDirectives = {
  mode: "auto",
  kind: "text",
  hide: [],
  rename: {},
  replace: {},
  images: [],
};

const BLOCK = /:::\s*visuals\s*([\s\S]*?):::/i;
const IMAGE_FENCE = /:::\s*image\s*(.*?)\n([\s\S]*?):::/gi;

/** Only real images are allowed: no scripts, no data URLs beyond images. */
export function safeImageUrl(value: string | undefined | null): string | null {
  const url = (value ?? "").trim();
  if (!url) return null;
  if (/^kkcc-file:\/\/[^/\s]+\/[^\s"<>]+$/.test(url)) return url;
  if (url.startsWith("data:image/")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;
  return null;
}

function toPositiveInt(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 99) return null;
  return number;
}

function parseRaw(raw: string): VisualDirectives {
  const directives: VisualDirectives = {
    ...EMPTY_DIRECTIVES,
    hide: [],
    rename: {},
    replace: {},
    images: [],
  };
  const trimmed = raw.trim();
  if (!trimmed) return directives;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return directives;
  }
  if (!parsed || typeof parsed !== "object") return directives;
  const input = parsed as Record<string, unknown>;

  if (input["mode"] === "none") directives.mode = "none";
  if (input["kind"] === "write") directives.kind = "write";
  if (Array.isArray(input["hide"])) {
    directives.hide = input["hide"].map(toPositiveInt).filter((n): n is number => n !== null);
  }
  if (input["rename"] && typeof input["rename"] === "object") {
    for (const [key, value] of Object.entries(input["rename"] as Record<string, unknown>)) {
      const index = toPositiveInt(key);
      if (index && typeof value === "string" && value.trim())
        directives.rename[index] = value.trim().slice(0, 120);
    }
  }
  if (input["replace"] && typeof input["replace"] === "object") {
    for (const [key, value] of Object.entries(input["replace"] as Record<string, unknown>)) {
      const index = toPositiveInt(key);
      if (!index || !value || typeof value !== "object") continue;
      const entry = value as Record<string, unknown>;
      const url = safeImageUrl(typeof entry["url"] === "string" ? entry["url"] : "");
      if (!url) continue;
      directives.replace[index] = {
        url,
        caption: typeof entry["caption"] === "string" ? entry["caption"].slice(0, 120) : "",
      };
    }
  }
  if (Array.isArray(input["images"])) {
    for (const value of input["images"]) {
      if (!value || typeof value !== "object") continue;
      const entry = value as Record<string, unknown>;
      const url = safeImageUrl(typeof entry["url"] === "string" ? entry["url"] : "");
      if (!url) continue;
      const replaces = toPositiveInt(entry["replaces"]);
      const after = Number.isInteger(entry["after"]) ? Number(entry["after"]) : undefined;
      directives.images.push({
        ...(replaces ? { replaces } : {}),
        ...(after !== undefined ? { after } : {}),
        url,
        caption: typeof entry["caption"] === "string" ? entry["caption"].slice(0, 120) : "",
      });
    }
  }
  return directives;
}

/** Pull the directives out of a note and return the note text without them. */
export function parseVisualDirectives(text: string): {
  directives: VisualDirectives;
  text: string;
  /** Images written as their own `:::image Caption <url> :::` fence. */
  inlineImages: NoteImage[];
} {
  const source = text ?? "";
  const inlineImages: NoteImage[] = [];
  const withoutImageFences = source.replace(
    IMAGE_FENCE,
    (_match, caption: string, body: string) => {
      const url = safeImageUrl(body.trim().split(/\s+/)[0] ?? "");
      if (url) inlineImages.push({ url, caption: (caption ?? "").trim().slice(0, 120) });
      return "";
    },
  );

  const match = BLOCK.exec(withoutImageFences);
  if (!match)
    return {
      directives: { ...EMPTY_DIRECTIVES, images: [...inlineImages] },
      text: source.replace(IMAGE_FENCE, ""),
      inlineImages,
    };
  const json = match[1] ?? "";
  const directives = parseRaw(json);
  // The web address may also be a plain URL line inside the block.
  const plainUrl = safeImageUrl(
    json
      .trim()
      .split(/\s+/)
      .find((word) => /^https?:/i.test(word)),
  );
  if (plainUrl && !directives.images.length) directives.images.push({ url: plainUrl, caption: "" });

  const stripped = withoutImageFences.replace(BLOCK, "");
  return {
    directives: { ...directives, images: [...directives.images, ...inlineImages] },
    text: stripped,
    inlineImages,
  };
}

/** The directive block as it is stored in the note text ("" when nothing set). */
export function serialiseDirectives(directives: VisualDirectives): string {
  const payload: Record<string, unknown> = {};
  if (directives.kind === "write") payload["kind"] = "write";
  if (directives.mode === "none") payload["mode"] = "none";
  if (directives.hide.length) payload["hide"] = [...new Set(directives.hide)].sort((a, b) => a - b);
  if (Object.keys(directives.rename).length) payload["rename"] = directives.rename;
  if (Object.keys(directives.replace).length) payload["replace"] = directives.replace;
  const images = directives.images.filter((image) => !image.replaces);
  if (images.length) payload["images"] = images;
  if (!Object.keys(payload).length) return "";
  return `\n\n:::visuals ${JSON.stringify(payload)}\n:::\n`;
}

/** Replace (or add) the directive block inside a note, keeping the text intact. */
export function updateNoteWithDirectives(text: string, directives: VisualDirectives): string {
  const { text: withoutBlock } = parseVisualDirectives(text);
  const base = withoutBlock.replace(/\n{3,}$/, "\n");
  const block = serialiseDirectives(directives);
  return block ? `${base.replace(/\s+$/, "")}${block}` : base.replace(/\s+$/, "");
}

/** Apply hide / rename / replace / mode:none to the detected visuals. */
export function applyDirectives(
  visuals: PlacedVisual[],
  directives: VisualDirectives,
): PlacedVisual[] {
  const applied: PlacedVisual[] = [];
  visuals.forEach((visual, index) => {
    const number = index + 1;
    const rename = directives.rename[number];
    const titled =
      rename && "title" in visual.spec
        ? ({ ...visual.spec, title: rename } as VisualSpec)
        : visual.spec;
    const replacement = directives.replace[number];
    if (replacement) {
      // The admin replaced this diagram with their own photo.
      applied.push({
        afterBlock: visual.afterBlock,
        spec: {
          kind: "image",
          url: replacement.url,
          caption: replacement.caption || rename || generatedTitle(titled),
        },
      });
      return;
    }
    if (directives.hide.includes(number)) return;
    applied.push({ afterBlock: visual.afterBlock, spec: titled });
  });

  // Photos the admin inserted, pinned after a text block or at the end.
  const images: PlacedVisual[] = directives.images
    .filter((image) => !image.replaces)
    .map((image) => ({
      afterBlock:
        typeof image.after === "number" && image.after >= 0 ? image.after : Number.MAX_SAFE_INTEGER,
      spec: { kind: "image" as const, url: image.url, caption: image.caption },
    }));

  return [...applied, ...images];
}

function generatedTitle(spec: VisualSpec): string {
  return "title" in spec ? spec.title : "";
}
