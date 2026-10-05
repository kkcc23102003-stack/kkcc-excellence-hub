import { useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EasyTextTestBuilder, type EasyTestSeed } from "./easy-text-test-builder";
import {
  listTestFolders,
  createTestFolder,
  prepareFolderTest,
  addTestOutlineList,
} from "@/lib/test-folders.functions";
import {
  expandFolderPaths,
  pathContains,
  pathKey,
  testPath,
  parseOutlineNames,
  type FolderPath,
  type FolderTest,
} from "@/lib/test-folders";

function ChildListEditor({
  parent,
  busy,
  onAdd,
}: {
  parent: FolderPath;
  busy: boolean;
  onAdd: (names: string[]) => Promise<boolean>;
}) {
  const [text, setText] = useState("");
  const kind = parent.chapter ? "Topics" : "Chapters";
  return (
    <fieldset disabled={busy} className="space-y-2 rounded-xl border border-dashed p-3">
      <legend className="px-1 text-sm font-semibold">
        {parent.chapter ? "Optional: add topics" : "Add chapters to this subject"}
      </legend>
      <label className="block text-sm">
        {kind} — one per line
        <Textarea
          aria-label={`${kind} list for ${parent.chapter || parent.subject}`}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={parent.chapter ? "Addition\nSubtraction" : "Fractions\nDecimals\nAlgebra"}
        />
      </label>
      <Button
        disabled={busy || !parseOutlineNames(text).length}
        onClick={async () => {
          if (await onAdd(parseOutlineNames(text))) setText("");
        }}
      >
        {parent.chapter ? "Add topics" : "Add chapters"}
      </Button>
      <p className="text-xs text-muted-foreground">
        {parent.chapter
          ? "Topic zaroori nahi—neeche seedha chapter ke questions paste kar sakte ho."
          : "Ek naam ya poori list paste karo. Ye chapters isi subject ke andar add honge."}
      </p>
    </fieldset>
  );
}
function SubjectEntry({
  series,
  busy,
  onSave,
}: {
  series: string;
  busy: boolean;
  onSave: (name: string, series: string) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  return (
    <fieldset
      disabled={busy}
      className="flex flex-wrap items-end gap-2 rounded border border-dashed p-3"
    >
      <label className="min-w-0 flex-1">
        Subject name
        <Input
          aria-label={`Subject name in ${series || "Unassigned series"}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="e.g. Mathematics"
        />
      </label>
      <Button
        disabled={busy || !name.trim()}
        onClick={async () => {
          if (await onSave(name, series)) setName("");
        }}
      >
        Save subject
      </Button>
    </fieldset>
  );
}
export function TestFolderOrganiser({
  tests,
  onSaved,
  onEdit,
}: {
  tests: FolderTest[];
  onSaved: (id: string, published: boolean) => void;
  onEdit: (id: string) => void;
}) {
  const treeId = useId();
  const queryClient = useQueryClient();
  const load = useServerFn(listTestFolders),
    create = useServerFn(createTestFolder),
    assemble = useServerFn(prepareFolderTest),
    addList = useServerFn(addTestOutlineList);
  const folders = useQuery({ queryKey: ["admin", "test-folders"], queryFn: () => load() });
  const [series, setSeries] = useState("");
  const [pendingSeries, setPendingSeries] = useState<string[]>([]);
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<FolderPath | null>(null),
    [ids, setIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<{ key: string; location: string; seed: EasyTestSeed } | null>(
    null,
  );
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const manual = tests.filter((t) => t.question_source === "manual");
  const originals = manual.filter((t) => !t.assembly_source_ids?.length && t.questions_count > 0);
  const nodes = expandFolderPaths([...(folders.data || []), ...manual.map(testPath)]);
  const choose = (path: FolderPath) => {
    if (!selected || pathKey(selected) !== pathKey(path)) {
      setIds([]);
      setSelected(path);
    }
    setError("");
  };
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "test-folders"] });
  const makeSubject = async (subject: string, series: string) => {
    setBusy(true);
    setError("");
    try {
      const path = await create({ data: { series_name: series, subject, chapter: "", topic: "" } });
      await refresh();
      choose(path);
      setNotice("Subject saved. Click Chapters → next to its name.");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Subject save failed");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const saveChildren = async (parent: FolderPath, names: string[]) => {
    setBusy(true);
    setError("");
    try {
      await addList({ data: { parent, names } });
      await refresh();
      setOpened((current) => ({ ...current, [pathKey(parent)]: true }));
      choose(parent);
      setNotice(
        parent.chapter
          ? "Topic list saved. Expand a topic to paste its questions."
          : "Chapter list saved. Expand a chapter to continue.",
      );
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "List save failed");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const startDraft = (path: FolderPath) => {
    if (draft && !window.confirm("Replace the current unsaved test draft?")) return;
    choose(path);
    setNotice("");
    setDraft({
      key: crypto.randomUUID(),
      location: pathKey(path),
      seed: { ...path, title: `${path.subject} — ${path.topic || path.chapter}` },
    });
  };
  const combine = async (path: FolderPath, wholeSubject: boolean) => {
    if (draft && !window.confirm("Replace the current unsaved test draft?")) return;
    setBusy(true);
    setError("");
    try {
      const chosen = wholeSubject
        ? originals
            .filter((t) => pathContains({ ...path, chapter: "", topic: "" }, testPath(t)))
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
        location: pathKey(path),
        seed: {
          is_paid: sources.some((t) => t.is_paid),
          subject: path.subject,
          series_name: path.series_name,
          chapter,
          topic: wholeSubject ? "" : path.topic,
          title: `${path.subject} — ${chapter}`,
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
  function editor(path: FolderPath) {
    if (!draft || draft.location !== pathKey(path)) return null;
    return (
      <div data-testid="folder-test-draft" className="min-w-0 border-t pt-3">
        <p className="text-sm font-semibold">
          Questions under: {[path.subject, path.chapter, path.topic].filter(Boolean).join(" → ")}
        </p>
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
              published ? "Test published." : "Question set saved as draft — hidden from students.",
            );
            void refresh();
            onSaved(id, published);
          }}
        />
      </div>
    );
  }
  function actions(path: FolderPath) {
    const active = Boolean(selected && pathKey(path) === pathKey(selected));
    const visible = manual.filter((t) => pathContains(path, testPath(t)));
    const candidates = visible.filter((t) => originals.some((o) => o.id === t.id));
    return (
      <div data-testid="outline-selection" className="min-w-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {path.chapter ? (
            <Button disabled={busy} onClick={() => startDraft(path)}>
              {path.topic ? "Paste topic questions" : "Skip topics → Paste chapter questions"}
            </Button>
          ) : (
            <Button disabled={busy} onClick={() => void combine(path, true)}>
              Complete subject test
            </Button>
          )}
        </div>
        {!active && visible.length > 0 && (
          <Button variant="outline" onClick={() => choose(path)}>
            Show saved sets
          </Button>
        )}
        {active && !!visible.length && (
          <>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={candidates.length > 0 && ids.length === candidates.length}
                onChange={(e) => setIds(e.target.checked ? candidates.map((t) => t.id) : [])}
              />
              Select all original sets in this section
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
            <Button disabled={!ids.length || busy} onClick={() => void combine(path, false)}>
              Make test from selected sets ({ids.length})
            </Button>
          </>
        )}
        {!visible.length && <p className="text-xs text-muted-foreground">No question sets yet.</p>}
      </div>
    );
  }
  function node(path: FolderPath) {
    const key = pathKey(path),
      isOpen = Boolean(opened[key]);
    const level = path.topic ? "Topic" : path.chapter ? "Chapter" : "Subject";
    const name = path.topic || path.chapter || path.subject;
    const children = nodes.filter(
      (child) =>
        child.series_name === path.series_name &&
        child.subject === path.subject &&
        (path.topic
          ? false
          : path.chapter
            ? child.chapter === path.chapter && Boolean(child.topic)
            : Boolean(child.chapter) && !child.topic),
    );
    const panelId = `${treeId}-${encodeURIComponent(key)}`;
    return (
      <div
        key={key}
        data-testid={`outline-${level.toLowerCase()}`}
        className="min-w-0 rounded-xl border bg-card"
      >
        <h3>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={`${level}: ${name}${level === "Subject" && path.series_name ? ` — ${path.series_name}` : ""}`}
            onClick={() => {
              setOpened((current) => ({ ...current, [key]: !isOpen }));
              if (!isOpen) choose(path);
            }}
            className="flex w-full items-center gap-2 rounded-xl p-3 text-left font-semibold hover:bg-muted/50"
          >
            <span aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
            <span className="min-w-0 break-words">
              {name}
              {level === "Subject" && path.series_name && (
                <span className="block text-xs font-normal text-muted-foreground">
                  {path.series_name}
                </span>
              )}
            </span>
            <span className="ml-auto shrink-0 rounded-md border bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              {isOpen
                ? "Close ↑"
                : path.topic
                  ? "Questions →"
                  : path.chapter
                    ? "Topics / Skip →"
                    : "Chapters →"}
            </span>
          </button>
        </h3>
        <div id={panelId} hidden={!isOpen} className="min-w-0 space-y-4 border-t p-2 sm:p-4">
          {!path.topic && (
            <ChildListEditor
              parent={path}
              busy={busy}
              onAdd={(names) => saveChildren(path, names)}
            />
          )}
          {!path.topic && (
            <div
              className="space-y-2"
              aria-label={`${path.chapter ? "Topics" : "Chapters"} under ${name}`}
            >
              {children.map(node)}
              {!children.length && (
                <p className="text-xs text-muted-foreground">
                  {path.chapter
                    ? "No topics added. You can paste questions directly below."
                    : "Add your chapters above, then expand one."}
                </p>
              )}
            </div>
          )}
          {actions(path)}
          {editor(path)}
        </div>
      </div>
    );
  }
  return (
    <section
      data-testid="test-folder-organiser"
      className="my-5 min-w-0 space-y-4 [&_button]:h-auto [&_button]:min-h-9 [&_button]:whitespace-normal"
    >
      <h2 className="text-xl font-bold">Series → Subjects → Chapters → Optional topics</h2>
      <p className="text-sm text-muted-foreground">
        Series name likho → neeche subjects save karo → subject ke aage Chapters → chapter ke aage
        Topics / Skip → apna MCQ text paste karo → preview → save / publish.
      </p>
      {(error || folders.error) && (
        <p role="alert" className="rounded border border-destructive p-3">
          {error || String(folders.error instanceof Error ? folders.error.message : folders.error)}
        </p>
      )}
      <fieldset disabled={busy} className="space-y-3 rounded-xl border p-4">
        <legend className="px-2 font-semibold">1. Name your series</legend>
        <label className="block">
          Series name
          <Input
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            maxLength={120}
            placeholder="e.g. ETT Practice Series"
          />
        </label>
        <Button
          disabled={busy || !series.trim()}
          onClick={() => {
            const name = series.trim();
            setPendingSeries((current) => [...new Set([...current, name])]);
            setSeries("");
            setNotice(
              "Series ready. Save subjects below; each subject has its own Chapters button.",
            );
          }}
        >
          Continue → Subjects
        </Button>
        <p className="text-xs text-muted-foreground">
          Series grouping is saved when you save its first subject.
        </p>
      </fieldset>
      {notice && <p role="status">{notice}</p>}
      <div aria-label="Series subject chapter accordion" className="space-y-4">
        {folders.isLoading && <p>Loading series…</p>}
        {[...new Set([...nodes.map((path) => path.series_name), ...pendingSeries])].map(
          (seriesName) => (
            <section
              key={seriesName}
              data-testid="outline-series"
              className="min-w-0 space-y-3 rounded-xl border-2 border-primary/30 p-2 sm:p-4"
            >
              <h3 className="break-words text-lg font-bold">{seriesName || "Unassigned series"}</h3>
              <p className="text-sm font-semibold">2. Subjects list</p>
              {nodes.filter((path) => !path.chapter && path.series_name === seriesName).map(node)}
              <SubjectEntry series={seriesName} busy={busy} onSave={makeSubject} />
            </section>
          ),
        )}
        {!nodes.length && !pendingSeries.length && !folders.isLoading && (
          <p>Start by naming your series above.</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        No fixed subject/chapter/topic or own-question count quota. Large chapter/topic lists save
        in batches. Complete/combined tests use only your selected original sets, without bank
        auto-fill. Very large pastes remain subject to server memory/request limits; save smaller
        sets in the same chapter if needed. Existing saved subjects, chapters, topics and tests are
        retained.
      </p>
      <details className="rounded border p-3 text-xs">
        <summary>Setup help</summary>
        <p>
          Run the latest Test Folders SQL for the large-question update. Series name is a grouping
          label, not a new paid catalogue bundle.
        </p>
        <a href="/KKCC-Excellence-Hub-TEST-FOLDERS.sql" download className="underline">
          Download Test Folders SQL if not installed yet
        </a>
      </details>
    </section>
  );
}
