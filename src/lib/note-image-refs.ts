/** Permanent storage references; signed URLs are only used for display, never saved. */
export function noteImageRefs(text: string): string[] {
  return [...new Set(text.match(/kkcc-file:\/\/[^\s"<>]+/g) ?? [])].slice(0, 100);
}
export function replaceNoteImageRefs(text: string, urls: Record<string, string>): string {
  return text.replace(/kkcc-file:\/\/[^\s"<>]+/g, (ref) => urls[ref] ?? ref);
}
