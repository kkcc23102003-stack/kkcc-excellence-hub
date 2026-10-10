import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renderNotesBody } from "@/lib/notes-visuals";
import { NOTE_DIAGRAM_TEMPLATES } from "@/lib/notes-visuals/templates";

type Entry = {
  id: string;
  subject: string;
  title: string;
  kind: string;
  exams: string[];
  body: string;
};
const curated: Entry[] = NOTE_DIAGRAM_TEMPLATES.map((item, index) => ({
  ...item,
  id: `curated-${index}`,
  kind: "teaching-diagram",
  exams: [],
}));

/** Large syllabus content loads only when an admin opens the library. */
export function DiagramTemplateLibrary({
  onInsert,
  diagramsDisabled,
}: {
  onInsert: (body: string) => void;
  diagramsDisabled: boolean;
}) {
  const [entries, setEntries] = useState<Entry[]>(curated);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState("");
  const [selected, setSelected] = useState<Entry | null>(null);
  const [page, setPage] = useState(0);
  const [inserted, setInserted] = useState(false);
  const load = async () => {
    setOpen(true);
    if (loaded || loading) return;
    setLoading(true);
    setError("");
    try {
      const module = await import("@/lib/notes-visuals/syllabus-library.json");
      setEntries([...curated, ...module.default]);
      setLoaded(true);
    } catch {
      setError("Library load nahi hui. Retry karein; existing notes safe hain.");
    } finally {
      setLoading(false);
    }
  };
  const exams = useMemo(
    () => [...new Set(entries.flatMap((item) => item.exams))].sort(),
    [entries],
  );
  const subjects = useMemo(
    () =>
      [
        ...new Set(
          entries.filter((item) => !exam || item.exams.includes(exam)).map((item) => item.subject),
        ),
      ].sort(),
    [entries, exam],
  );
  const filtered = useMemo(() => {
    const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return entries.filter(
      (item) =>
        (!subject || item.subject === subject) &&
        (!exam || item.exams.includes(exam)) &&
        words.every((word) => `${item.subject} ${item.title}`.toLocaleLowerCase().includes(word)),
    );
  }, [entries, subject, exam, query]);
  const preview = useMemo(() => (selected ? renderNotesBody(selected.body) : ""), [selected]);
  return (
    <div className="space-y-3 rounded-xl border p-3">
      <Button type="button" variant="outline" onClick={() => (open ? setOpen(false) : void load())}>
        {open ? "Close diagram library" : "Open full syllabus diagram library"}
      </Button>
      {open && (
        <>
          <p className="text-xs text-muted-foreground">
            Teaching diagrams + topic-wise revision maps from the project's question bank. Revision
            maps are worked-example summaries, not anatomical drawings/circuit schematics. Review
            content before publishing.
          </p>
          {loading && <p role="status">Loading full syllabus library…</p>}
          {error && (
            <div role="alert">
              {error}{" "}
              <Button type="button" onClick={() => void load()}>
                Retry
              </Button>
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              aria-label="Diagram exam filter"
              className="rounded border bg-background p-2"
              value={exam}
              onChange={(event) => {
                setExam(event.target.value);
                setSubject("");
                setPage(0);
              }}
            >
              <option value="">All exams / boards</option>
              {exams.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              aria-label="Diagram subject filter"
              className="rounded border bg-background p-2"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setPage(0);
              }}
            >
              <option value="">All subjects</option>
              {subjects.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <Input
            aria-label="Search diagram topics"
            placeholder="Search subject / chapter / topic…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
          <p className="text-xs" role="status">
            {filtered.length} matching templates {loaded ? `· ${entries.length} total` : ""}
          </p>
          <div className="grid max-h-72 gap-2 overflow-auto sm:grid-cols-2">
            {filtered.slice(page * 20, (page + 1) * 20).map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selected?.id === item.id}
                className={`rounded-lg border p-3 text-left text-xs ${selected?.id === item.id ? "border-primary bg-primary/10" : "bg-background"}`}
                onClick={() => {
                  setSelected(item);
                  setInserted(false);
                }}
              >
                <strong className="block">{item.title}</strong>
                <span>
                  {item.subject} ·{" "}
                  {item.kind === "revision-map" ? "Revision map" : "Teaching diagram"}
                </span>
              </button>
            ))}
          </div>
          {!filtered.length && (
            <p>No matching topics. Clear the search or choose another exam/subject.</p>
          )}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-xs">
              Page {page + 1} / {Math.max(1, Math.ceil(filtered.length / 20))}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={(page + 1) * 20 >= filtered.length}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
          {selected && (
            <div className="space-y-2 rounded-xl border p-3">
              <h4 className="font-bold">
                Preview: {selected.subject} — {selected.title}
              </h4>
              <div
                className="kkcc-note-reader max-h-96 overflow-auto rounded bg-white p-3 text-slate-900"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
              {diagramsDisabled && (
                <p className="text-xs text-amber-600">
                  No-diagram switch ON hai. Inserted text rahega, lekin note mein diagrams hidden
                  rahenge jab tak aap switch OFF nahi karte.
                </p>
              )}
              <Button
                type="button"
                disabled={inserted}
                onClick={() => {
                  onInsert(selected.body);
                  setInserted(true);
                }}
              >
                {inserted ? "Inserted into draft" : "Insert into note draft"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Edit inserted text/labels in the note editor. Inserting does not publish or save the
                note.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
