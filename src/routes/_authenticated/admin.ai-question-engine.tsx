import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Play, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  getAIQuestionEngineSettings,
  listAIQuestionCandidates,
  reviewAIQuestionCandidate,
  runAIQuestionEngine,
  saveAIQuestionEngineSettings,
  syncAIQuestionTargets,
  getAIArchiveStatus,
} from "@/lib/ai-question-engine.functions";

export const Route = createFileRoute("/_authenticated/admin/ai-question-engine")({
  component: AIQuestionEnginePage,
});

function AIQuestionEnginePage() {
  const qc = useQueryClient();
  const get = useServerFn(getAIQuestionEngineSettings),
    list = useServerFn(listAIQuestionCandidates),
    save = useServerFn(saveAIQuestionEngineSettings),
    run = useServerFn(runAIQuestionEngine),
    sync = useServerFn(syncAIQuestionTargets),
    review = useServerFn(reviewAIQuestionCandidate);
  const settings = useQuery({ queryKey: ["admin", "ai-engine-settings"], queryFn: () => get() });
  const archive = useQuery({
    queryKey: ["admin", "ai-question-archive"],
    queryFn: () => getAIArchiveStatus(),
  });
  const candidates = useQuery({ queryKey: ["admin", "ai-candidates"], queryFn: () => list() });
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(false),
    [autoPublish, setAutoPublish] = useState(false),
    [googleSearch, setGoogleSearch] = useState(true);
  const [dailyLimit, setDailyLimit] = useState("30"),
    [minQuality, setMinQuality] = useState("85"),
    [model, setModel] = useState("gemini-2.5-flash");
  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          enabled,
          model,
          dailyLimit: Number(dailyLimit),
          minQuality: Number(minQuality),
          autoPublish,
          googleSearch,
          apiKey: apiKey || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("AI settings saved");
      void settings.refetch();
      setApiKey("");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const syncMutation = useMutation({
    mutationFn: () => sync(),
    onSuccess: (r) => toast.success(`${r.targets.toLocaleString("en-IN")} research targets synced`),
    onError: (e: Error) => toast.error(e.message),
  });
  const runMutation = useMutation({
    mutationFn: () => run(),
    onSuccess: (r) => {
      toast.success(`AI run complete: ${r?.generated ?? 0} candidate(s)`);
      void candidates.refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reviewMutation = useMutation({
    mutationFn: (x: { id: string; status: "approved" | "rejected" | "review" }) =>
      review({ data: x }),
    onSuccess: () => {
      void candidates.refetch();
    },
  });
  const s = settings.data;
  useEffect(() => {
    if (!s) return;
    setModel(s.model);
    setDailyLimit(String(s.dailyLimit));
    setMinQuality(String(s.minQuality));
    setEnabled(s.enabled);
    setAutoPublish(s.autoPublish);
    setGoogleSearch(s.googleSearch);
  }, [s]);
  const rows = candidates.data ?? [];
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin · AI"
        title="KKCC AI Question Intelligence"
        description="Research, verify and queue high-yield questions without storing raw web research in Supabase."
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6" />
              <div>
                <h2 className="font-semibold">Research engine</h2>
                <p className="text-sm text-muted-foreground">
                  Gemini + Google Search grounding. API key stays server-side.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Gemini model</Label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div>
                <Label>Daily candidate limit</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                />
              </div>
              <div>
                <Label>Minimum quality score</Label>
                <Input
                  type="number"
                  min="70"
                  max="100"
                  value={minQuality}
                  onChange={(e) => setMinQuality(e.target.value)}
                />
              </div>
              <div>
                <Label>API key</Label>
                <Input
                  type="password"
                  placeholder={
                    s?.apiKeyConfigured ? "Key already saved — leave blank" : "Paste Gemini API key"
                  }
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Row label="AI engine enabled" checked={enabled} set={setEnabled} />
              <Row label="Google Search grounding" checked={googleSearch} set={setGoogleSearch} />
              <Row
                label="Auto-verify & publish above quality threshold"
                checked={autoPublish}
                set={setAutoPublish}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                Save settings
              </Button>
              <Button
                variant="outline"
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync all topics
              </Button>
              <Button
                variant="outline"
                onClick={() => runMutation.mutate()}
                disabled={runMutation.isPending || !enabled}
              >
                <Play className="mr-2 h-4 w-4" />
                Run AI now
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Question archive</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Full question text is kept outside Supabase.
            </p>
            <div className="mt-4 rounded-xl border p-3 text-sm">
              <div className="font-medium">
                {archive.data?.configured
                  ? `External archive: ${archive.data.provider}`
                  : "External archive not configured"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {archive.data?.configured
                  ? `Bucket: ${archive.data.bucket}`
                  : "Configure R2 / AWS S3 / Backblaze B2 / Wasabi in Admin → Storage before running AI."}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/admin/storage">Configure archive storage</Link>
            </Button>
            <h2 className="mt-6 font-semibold">Safety gate</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>✓ Exactly 4 distinct options</li>
              <li>✓ Answer + explanation required</li>
              <li>✓ Quality threshold</li>
              <li>✓ Duplicate protection</li>
              <li>✓ Source URLs retained</li>
              <li>✓ Deterministic quality gate before publish</li>
            </ul>
            <div className="mt-5 rounded-xl bg-muted p-3 text-xs">
              Raw Google/Gemini research is not stored. Full AI question payloads are archived
              externally; Supabase keeps only lightweight index/status metadata.
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-semibold">AI review queue</h2>
            <p className="text-sm text-muted-foreground">
              Approve only questions you are satisfied with. The student-facing design is unchanged.
            </p>
          </div>
          <div className="divide-y">
            {rows.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No AI candidates yet. Sync topics, configure the key, then run the engine.
              </div>
            ) : (
              rows.map((q) => (
                <div key={q.id} className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{q.exam}</Badge>
                    <Badge variant="outline">{q.subject}</Badge>
                    <Badge variant="outline">{q.difficulty}</Badge>
                    <Badge
                      variant={q.quality_score >= Number(minQuality) ? "default" : "destructive"}
                    >
                      {q.quality_score}/100
                    </Badge>
                    <Badge variant="outline">{q.status}</Badge>
                  </div>
                  <p className="mt-3 font-medium">{q.prompt}</p>
                  <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    {q.options.map((o, i) => (
                      <li key={o} className={i === q.correct_index ? "font-semibold" : ""}>
                        {String.fromCharCode(65 + i)}. {o}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-sm text-muted-foreground">{q.explanation}</p>
                  <div className="mt-3 flex gap-2">
                    {q.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => reviewMutation.mutate({ id: q.id, status: "approved" })}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {q.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reviewMutation.mutate({ id: q.id, status: "rejected" })}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          No AI system can guarantee that a future exam will repeat 90% of its questions. This
          engine optimizes for syllabus alignment, PYQ patterns, high-yield concepts and verified
          sources instead.
        </div>
      </section>
    </SiteLayout>
  );
}
function Row({
  label,
  checked,
  set,
}: {
  label: string;
  checked: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={set} />
    </div>
  );
}
