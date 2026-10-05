import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EasyTextTestBuilder, type EasyTestSeed } from "./easy-text-test-builder";
import { listTestFolders, createTestFolder, prepareFolderTest } from "@/lib/test-folders.functions";
import {
  expandFolderPaths,
  pathContains,
  pathKey,
  testPath,
  type FolderPath,
  type FolderTest,
} from "@/lib/test-folders";
const empty: FolderPath = { series_name: "", subject: "", chapter: "", topic: "" };
export function TestFolderOrganiser({
  tests,
  onSaved,
  onEdit,
}: {
  tests: FolderTest[];
  onSaved: (id: string, published: boolean) => void;
  onEdit: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const load = useServerFn(listTestFolders),
    create = useServerFn(createTestFolder),
    assemble = useServerFn(prepareFolderTest);
  const folders = useQuery({ queryKey: ["admin", "test-folders"], queryFn: () => load() });
  const [form, setForm] = useState<FolderPath>(empty),
    [selected, setSelected] = useState<FolderPath | null>(null),
    [ids, setIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<{ key: string; seed: EasyTestSeed } | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const manual = tests.filter((t) => t.question_source === "manual");
  const originals = manual.filter((t) => !t.assembly_source_ids?.length && t.questions_count > 0);
  const nodes = expandFolderPaths([...(folders.data || []), ...manual.map(testPath)]);
  const visible = selected ? manual.filter((t) => pathContains(selected, testPath(t))) : [];
  const candidates = visible.filter((t) => originals.some((o) => o.id === t.id));
  const choose = (path: FolderPath) => {
    setSelected(path);
    setForm(path);
    setIds([]);
    setError("");
  };
  const makeFolder = async () => {
    setBusy(true);
    setError("");
    try {
      const path = await create({ data: form });
      await queryClient.invalidateQueries({ queryKey: ["admin", "test-folders"] });
      choose(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Folder save failed");
    } finally {
      setBusy(false);
    }
  };
  const combine = async (wholeSubject: boolean) => {
    if (!selected) return;
    if (draft && !window.confirm("Replace the current unsaved test draft?")) return;
    setBusy(true);
    setError("");
    try {
      const chosen = wholeSubject
        ? originals
            .filter((t) => pathContains({ ...selected, chapter: "", topic: "" }, testPath(t)))
            .map((t) => t.id)
        : ids;
      const result = await assemble({ data: { ids: chosen } });
      const sources = manual.filter((t) => chosen.includes(t.id));
      const chapters = new Set(sources.map((t) => testPath(t).chapter));
      const chapter =
        wholeSubject || chapters.size > 1 ? "Complete Test" : testPath(sources[0]!).chapter;
      setNotice(
        `${result.questions.length} questions ready. ${result.duplicates} identical duplicates removed. Source sets unchanged.`,
      );
      setDraft({
        key: crypto.randomUUID(),
        seed: {
          is_paid: sources.some((source) => source.is_paid),
          subject: selected.subject,
          series_name: selected.series_name,
          chapter,
          topic: wholeSubject ? "" : selected.topic,
          title: `${selected.subject} — ${wholeSubject ? "Complete Test" : chapter}`,
          questions: result.questions,
          assembly_source_ids: result.source_ids,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not assemble");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section data-testid="test-folder-organiser" className="my-5 min-w-0 space-y-4">
      <h2 className="text-xl font-bold">Subject → Chapter → Topic folders</h2>
      <p className="text-sm text-muted-foreground">
        Folder banao → apne MCQs paste karo → draft save ya publish. Selected chapters ya poore
        subject ka complete test bhi bana sakte ho. Sirf original manual sets use honge, koi auto
        bank fill nahi.
      </p>
      {(error || folders.error) && (
        <p role="alert" className="rounded border border-destructive p-3">
          {error || String(folders.error instanceof Error ? folders.error.message : folders.error)}
        </p>
      )}
      <details className="rounded border p-3">
        <summary>Folder setup / examples</summary>
        <p className="text-sm">
          Subject: Mathematics → Chapter: Fractions → Topic: Addition (optional). Subject folder ke
          liye chapter/topic blank rakho. Series name optional hai, paid bundle access automatically
          create nahi hota.
        </p>
        <a href="/KKCC-Excellence-Hub-TEST-FOLDERS.sql" download className="underline">
          Download Test Folders SQL
        </a>
      </details>
      <fieldset disabled={busy} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <legend className="px-2 font-semibold">Create a folder</legend>
        <label>
          Folder series name
          <Input
            value={form.series_name}
            onChange={(e) => setForm({ ...form, series_name: e.target.value })}
            maxLength={120}
          />
        </label>
        <label>
          Folder subject
          <Input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            maxLength={80}
          />
        </label>
        <label>
          Folder chapter (optional)
          <Input
            value={form.chapter}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            maxLength={120}
          />
        </label>
        <label>
          Folder topic (optional)
          <Input
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            maxLength={120}
          />
        </label>
        <Button onClick={() => void makeFolder()} disabled={!form.subject.trim() || busy}>
          Create folder
        </Button>
      </fieldset>
      <div className="grid min-w-0 gap-4 md:grid-cols-[260px_1fr]">
        <nav aria-label="Test folder tree" className="min-w-0 space-y-1 rounded-xl border p-3">
          {folders.isLoading && <p>Loading folders…</p>}
          {!nodes.length && !folders.isLoading && (
            <p className="text-sm">No folders yet. Create your first subject above.</p>
          )}
          {nodes.map((node) => (
            <button
              key={pathKey(node)}
              type="button"
              aria-pressed={Boolean(selected && pathKey(selected) === pathKey(node))}
              onClick={() => choose(node)}
              className={`block w-full break-words rounded-lg border p-2 text-left text-sm ${selected && pathKey(selected) === pathKey(node) ? "border-primary bg-primary/10" : ""} ${node.topic ? "pl-8" : node.chapter ? "pl-5" : ""}`}
            >
              📁 {node.topic || node.chapter || node.subject}
              {!node.chapter && (
                <span className="block text-xs text-muted-foreground">
                  {node.series_name || "No series"}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="min-w-0 space-y-3 rounded-xl border p-4">
          {!selected ? (
            <p>Select a folder.</p>
          ) : (
            <>
              <h3 className="break-words font-bold">
                {[selected.series_name, selected.subject, selected.chapter, selected.topic]
                  .filter(Boolean)
                  .join(" / ")}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!selected.chapter || busy}
                  onClick={() => {
                    if (draft && !window.confirm("Replace the current unsaved test draft?")) return;
                    setNotice("");
                    setDraft({
                      key: crypto.randomUUID(),
                      seed: {
                        ...selected,
                        title: `${selected.subject} — ${selected.topic || selected.chapter}`,
                      },
                    });
                  }}
                >
                  Add text questions here
                </Button>
                <Button variant="outline" disabled={busy} onClick={() => void combine(true)}>
                  Complete subject test
                </Button>
              </div>
              {!selected.chapter && (
                <p className="text-xs">
                  Questions paste karne ke liye chapter folder create/select karo. Complete test ke
                  liye chapter sets add karo.
                </p>
              )}
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={candidates.length > 0 && ids.length === candidates.length}
                  onChange={(e) => setIds(e.target.checked ? candidates.map((t) => t.id) : [])}
                />
                Select all original sets in this folder
              </label>
              {visible.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-2 rounded border p-3">
                  {!t.assembly_source_ids?.length && t.questions_count > 0 && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${t.title}`}
                      checked={ids.includes(t.id)}
                      onChange={(e) =>
                        setIds(e.target.checked ? [...ids, t.id] : ids.filter((id) => id !== t.id))
                      }
                    />
                  )}
                  <div className="min-w-0 flex-1 break-words">
                    <b>{t.title}</b>
                    <p className="text-xs">
                      {t.syllabus_chapter} {t.syllabus_topic && `/ ${t.syllabus_topic}`} ·{" "}
                      {t.questions_count} Q · {t.is_published ? "Published" : "Draft"}
                      {t.assembly_source_ids?.length ? " · Combined snapshot" : ""}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => onEdit(t.id)}>
                    Edit in Advanced
                  </Button>
                </div>
              ))}
              {!visible.length && <p>No question sets here yet.</p>}
              <Button disabled={!ids.length || busy} onClick={() => void combine(false)}>
                Make test from selected sets ({ids.length})
              </Button>
              <p className="text-xs text-muted-foreground">
                Combined papers are independent copies, excluded from future source selection to
                avoid repeated questions. Max 50 sets / 200 unique questions; nothing is silently
                truncated.
              </p>
            </>
          )}
        </div>
      </div>
      {notice && <p role="status">{notice}</p>}
      {draft && (
        <div data-testid="folder-test-draft">
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm("Discard this unsaved test draft?")) setDraft(null);
            }}
          >
            Close unsaved editor
          </Button>
          <EasyTextTestBuilder
            key={draft.key}
            initial={draft.seed}
            onPublished={(id, published) => {
              setDraft(null);
              setNotice(
                published
                  ? "Test published."
                  : "Folder question set saved as draft — hidden from students.",
              );
              void queryClient.invalidateQueries({ queryKey: ["admin", "test-folders"] });
              onSaved(id, published);
            }}
          />
        </div>
      )}
    </section>
  );
}
