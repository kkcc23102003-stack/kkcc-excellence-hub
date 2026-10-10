import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ClipboardList,
  Database,
  Gamepad2,
  Layers3,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SiteLayout } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getAdminAppControls,
  getAdminSystemHealth,
  saveAdminAppControls,
  type PublicAppControls,
} from "@/lib/app-controls.functions";
import { friendlyError } from "@/lib/storage";
import {
  KITTU_EXAM_TRACKS,
  KITTU_PRACTICE_MODES,
  KITTU_SUBJECT_OPTIONS,
  KITTU_SUBJECT_TOPICS,
  type KittuPracticeBatch,
} from "@/lib/kittu-batch-catalog";

export const Route = createFileRoute("/_authenticated/admin/security")({
  head: () => ({
    meta: [
      { title: "Admin — Security & App Controls | KKCC" },
      { name: "description", content: "Manage protection, practice rewards and platform health." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSecurityPage,
});

type AppControlsForm = Omit<PublicAppControls, "kittuRewards"> & {
  kittuDailyRewardCap: number;
  kittuDailyPracticeHours: number;
  kittuDailyGift: number;
};

function controlsToForm(controls: PublicAppControls): AppControlsForm {
  const { kittuRewards, ...rest } = controls;
  return {
    ...rest,
    kittuDailyRewardCap: kittuRewards.dailyRewardCap,
    kittuDailyPracticeHours: kittuRewards.dailyPracticeHours,
    kittuDailyGift: kittuRewards.dailyGift,
  };
}

function fmtNumber(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(value);
}

function SettingRow({
  title,
  description,
  checked,
  onCheckedChange,
  badge,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  badge?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border bg-background/60 p-4 transition hover:border-primary/30">
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {title}
          {badge && (
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {badge}
            </Badge>
          )}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </label>
  );
}

function NumberField({
  label,
  description,
  value,
  min,
  max,
  step = "1",
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border bg-background/60 p-4">
      <span className="block text-sm font-semibold">{label}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
        {description}
      </span>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        className="mt-3"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function AdminSecurityPage() {
  const qc = useQueryClient();
  const loadControls = useServerFn(getAdminAppControls);
  const saveControls = useServerFn(saveAdminAppControls);
  const loadHealth = useServerFn(getAdminSystemHealth);
  const [form, setForm] = useState<AppControlsForm | null>(null);

  const controlsQuery = useQuery({
    queryKey: ["admin", "app-controls"],
    queryFn: () => loadControls(),
    retry: false,
  });

  const healthQuery = useQuery({
    queryKey: ["admin", "system-health"],
    queryFn: () => loadHealth(),
    retry: false,
  });

  useEffect(() => {
    if (controlsQuery.data && !form) setForm(controlsToForm(controlsQuery.data));
  }, [controlsQuery.data, form]);

  const estimatedRewards = useMemo(() => {
    const cap = Math.max(20, Number(form?.kittuDailyRewardCap ?? 160));
    const hours = Math.min(24, Math.max(1, Number(form?.kittuDailyPracticeHours ?? 8)));
    const correct = cap / (hours * 60);
    return { correct, wrong: correct / 10, questions: hours * 60 };
  }, [form?.kittuDailyPracticeHours, form?.kittuDailyRewardCap]);

  const saveMutation = useMutation({
    mutationFn: (payload: AppControlsForm) => saveControls({ data: payload }),
    onSuccess: (next) => {
      setForm(controlsToForm(next));
      void qc.invalidateQueries({ queryKey: ["admin", "app-controls"] });
      void qc.invalidateQueries({ queryKey: ["public-app-controls"] });
      toast.success("Security and app controls saved");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const setFlag = (key: keyof AppControlsForm, value: boolean) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateBatch = (id: string, patch: Partial<KittuPracticeBatch>) => {
    setForm((current) =>
      current
        ? {
            ...current,
            kittuPracticeBatches: current.kittuPracticeBatches.map((batch) =>
              batch.id === id ? { ...batch, ...patch } : batch,
            ),
          }
        : current,
    );
  };

  const addBatch = () => {
    setForm((current) => {
      if (!current || current.kittuPracticeBatches.length >= 20) return current;
      const id = `kittu-batch-${Date.now().toString(36)}`;
      const next: KittuPracticeBatch = {
        id,
        label: `Custom practice batch ${current.kittuPracticeBatches.length + 1}`,
        exam: "All Exams",
        subject: "Mixed",
        topic: "Mixed",
        mode: "NCERT-based",
        enabled: true,
      };
      return { ...current, kittuPracticeBatches: [...current.kittuPracticeBatches, next] };
    });
  };

  const removeBatch = (id: string) => {
    setForm((current) =>
      current
        ? {
            ...current,
            kittuPracticeBatches: current.kittuPracticeBatches.filter((batch) => batch.id !== id),
          }
        : current,
    );
  };

  if (controlsQuery.isLoading || !form) {
    return (
      <SiteLayout>
        <PageHeader
          eyebrow="Admin panel"
          title="Security & app controls"
          description="Loading protected controls…"
        />
      </SiteLayout>
    );
  }

  if (controlsQuery.isError) {
    return (
      <SiteLayout>
        <PageHeader
          eyebrow="Admin panel"
          title="Security & app controls"
          description={friendlyError(controlsQuery.error as Error)}
        />
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
          <Button asChild className="rounded-full">
            <Link to="/admin">Back to course manager</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Security & app controls"
        description="Central controls for content protection, maintenance mode, feature access, Kit 2 Coins reward pacing and Supabase health."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Course manager</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/storage">Storage</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="space-y-5">
            <section className="surface-panel p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Content protection
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Browser and PWA protection layers for student-facing pages. These controls
                    reduce copying, printing and casual capture attempts.
                  </p>
                </div>
                <Badge className="rounded-full">Secure</Badge>
              </div>
              <div className="mt-5 grid gap-3">
                <SettingRow
                  title="Master protection"
                  description="Enable or disable all browser protection layers together."
                  checked={form.protectionEnabled}
                  onCheckedChange={(value) => setFlag("protectionEnabled", value)}
                  badge="Recommended"
                />
                <SettingRow
                  title="Copy and drag guard"
                  description="Blocks public text selection, copy, cut and drag actions outside form fields."
                  checked={form.copyGuardEnabled}
                  onCheckedChange={(value) => setFlag("copyGuardEnabled", value)}
                />
                <SettingRow
                  title="Context menu guard"
                  description="Prevents right-click and long-press menu access on protected content."
                  checked={form.contextMenuGuardEnabled}
                  onCheckedChange={(value) => setFlag("contextMenuGuardEnabled", value)}
                />
                <SettingRow
                  title="Secure shortcut guard"
                  description="Blocks common copy, save, view-source and print shortcuts."
                  checked={form.shortcutGuardEnabled}
                  onCheckedChange={(value) => setFlag("shortcutGuardEnabled", value)}
                />
                <SettingRow
                  title="Identity watermark"
                  description="Shows the signed-in student email on protected learning pages."
                  checked={form.watermarkEnabled}
                  onCheckedChange={(value) => setFlag("watermarkEnabled", value)}
                  badge="Student pages"
                />
                <SettingRow
                  title="Screenshot blur overlay"
                  description="Instantly blanks content on protected capture shortcuts and when the app is hidden."
                  checked={form.screenshotBlurEnabled}
                  onCheckedChange={(value) => setFlag("screenshotBlurEnabled", value)}
                />
                <SettingRow
                  title="Print guard"
                  description="Blocks normal page printing of learning content."
                  checked={form.printGuardEnabled}
                  onCheckedChange={(value) => setFlag("printGuardEnabled", value)}
                />
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Gamepad2 className="h-5 w-5 text-primary" /> Kit 2 Coins Quiz reward pacing
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Rewards remain local on the student device. Admin can change the healthy daily cap
                and expected practice pace without storing quiz progress in Supabase.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <NumberField
                  label="Daily reward cap"
                  description="Maximum Kit 2 Coins per calendar day."
                  value={form.kittuDailyRewardCap}
                  min={20}
                  max={1000}
                  onChange={(value) =>
                    setForm((current) =>
                      current ? { ...current, kittuDailyRewardCap: value } : current,
                    )
                  }
                />
                <NumberField
                  label="Practice-hour pace"
                  description="Expected healthy practice duration used to split rewards."
                  value={form.kittuDailyPracticeHours}
                  min={1}
                  max={24}
                  step="0.5"
                  onChange={(value) =>
                    setForm((current) =>
                      current ? { ...current, kittuDailyPracticeHours: value } : current,
                    )
                  }
                />
                <NumberField
                  label="Daily gift"
                  description="Small one-time daily boost, counted inside the daily cap."
                  value={form.kittuDailyGift}
                  min={0}
                  max={500}
                  onChange={(value) =>
                    setForm((current) =>
                      current ? { ...current, kittuDailyGift: value } : current,
                    )
                  }
                />
              </div>
              <div className="mt-4 grid gap-3 rounded-3xl border bg-background/70 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Correct reward
                  </p>
                  <p className="mt-1 text-lg font-black text-primary">
                    +{fmtNumber(estimatedRewards.correct)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Wrong-review reward
                  </p>
                  <p className="mt-1 text-lg font-black text-primary">
                    +{fmtNumber(estimatedRewards.wrong)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Pace reference
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {fmtNumber(estimatedRewards.questions)} 1-min questions
                  </p>
                </div>
              </div>
            </section>
            <section className="surface-panel p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Layers3 className="h-5 w-5 text-primary" /> Kit 2 Coins practice batches
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Add focused quiz batches without creating a new database table. Each enabled
                    batch appears on the Kit 2 Coins page and uses the app's built-in local question
                    engine for instant, original MCQs by exam, subject, chapter and mode.
                  </p>
                </div>
                <Badge className="rounded-full">
                  {form.kittuPracticeBatches.filter((batch) => batch.enabled).length} enabled
                </Badge>
              </div>

              <div className="mt-5 space-y-4">
                {form.kittuPracticeBatches.length === 0 ? (
                  <div className="rounded-3xl border border-dashed bg-background/55 p-5 text-sm leading-relaxed text-muted-foreground">
                    No custom practice batch yet. Add one when you want a named shortcut such as a
                    Punjabi grammar batch, board-science batch or a new competitive-exam practice
                    track.
                  </div>
                ) : (
                  form.kittuPracticeBatches.map((batch) => {
                    const topicOptions =
                      batch.subject === "Mixed" ? [] : (KITTU_SUBJECT_TOPICS[batch.subject] ?? []);
                    return (
                      <div key={batch.id} className="rounded-3xl border bg-background/60 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <label className="min-w-0 flex-1">
                            <span className="block text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                              Batch name
                            </span>
                            <Input
                              value={batch.label}
                              maxLength={80}
                              className="mt-2 bg-background"
                              onChange={(event) =>
                                updateBatch(batch.id, { label: event.target.value })
                              }
                            />
                          </label>
                          <div className="flex items-center gap-2 pb-1 pt-6">
                            <Switch
                              checked={batch.enabled}
                              onCheckedChange={(value) => updateBatch(batch.id, { enabled: value })}
                              aria-label={`Enable ${batch.label}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                              onClick={() => removeBatch(batch.id)}
                              aria-label={`Remove ${batch.label}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 lg:grid-cols-4">
                          <label>
                            <span className="block text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                              Exam track
                            </span>
                            <select
                              value={batch.exam}
                              className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-semibold outline-none ring-primary/25 transition focus:ring-4"
                              onChange={(event) =>
                                updateBatch(batch.id, {
                                  exam: event.target.value,
                                  subject: "Mixed",
                                  topic: "Mixed",
                                })
                              }
                            >
                              {KITTU_EXAM_TRACKS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            <span className="block text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                              Subject
                            </span>
                            <select
                              value={batch.subject}
                              className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-semibold outline-none ring-primary/25 transition focus:ring-4"
                              onChange={(event) =>
                                updateBatch(batch.id, {
                                  subject: event.target.value,
                                  topic: "Mixed",
                                })
                              }
                            >
                              <option value="Mixed">Mixed</option>
                              {KITTU_SUBJECT_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            <span className="block text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                              Chapter / topic
                            </span>
                            <select
                              value={batch.topic}
                              disabled={batch.subject === "Mixed"}
                              className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-semibold outline-none ring-primary/25 transition focus:ring-4 disabled:opacity-60"
                              onChange={(event) =>
                                updateBatch(batch.id, { topic: event.target.value })
                              }
                            >
                              <option value="Mixed">Mixed</option>
                              {topicOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            <span className="block text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                              Question style
                            </span>
                            <select
                              value={batch.mode}
                              className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-semibold outline-none ring-primary/25 transition focus:ring-4"
                              onChange={(event) =>
                                updateBatch(batch.id, {
                                  mode: event.target.value as (typeof KITTU_PRACTICE_MODES)[number],
                                })
                              }
                            >
                              {KITTU_PRACTICE_MODES.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-primary/5 p-4">
                  <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                    After saving, the app automatically generates questions on-device from its local
                    original/template bank. No AI request, question table, or inactive Supabase
                    storage is created.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={addBatch}
                    disabled={form.kittuPracticeBatches.length >= 20}
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add batch
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="surface-panel p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <SlidersHorizontal className="h-5 w-5 text-primary" /> Maintenance & features
              </h2>
              <div className="mt-5 grid gap-3">
                <SettingRow
                  title="Maintenance mode"
                  description="Shows a professional holding page across public/student pages. Admin routes stay open."
                  checked={form.maintenanceMode}
                  onCheckedChange={(value) => setFlag("maintenanceMode", value)}
                  badge="Danger zone"
                />
                <label className="rounded-2xl border bg-background/60 p-4">
                  <span className="block text-sm font-semibold">Maintenance message</span>
                  <Textarea
                    value={form.maintenanceMessage}
                    className="mt-3 min-h-[110px]"
                    maxLength={240}
                    onChange={(event) =>
                      setForm((current) =>
                        current ? { ...current, maintenanceMessage: event.target.value } : current,
                      )
                    }
                  />
                </label>
                <SettingRow
                  title="Kit 2 Coins"
                  description="Public access to the local endless practice zone."
                  checked={form.kittuQuizEnabled}
                  onCheckedChange={(value) => setFlag("kittuQuizEnabled", value)}
                />
                <SettingRow
                  title="Test series"
                  description="Public access to published tests and free chapterwise Kit 2 Coins practice cards."
                  checked={form.testSeriesEnabled}
                  onCheckedChange={(value) => setFlag("testSeriesEnabled", value)}
                />
                <SettingRow
                  title="Study material"
                  description="Public notes/resources page visibility."
                  checked={form.studyMaterialEnabled}
                  onCheckedChange={(value) => setFlag("studyMaterialEnabled", value)}
                />
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Database className="h-5 w-5 text-primary" /> Supabase system health
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No Kit 2 Coins quiz progress is stored in the database. Health metrics are
                    read-only and admin-only.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => healthQuery.refetch()}
                  disabled={healthQuery.isFetching}
                >
                  {healthQuery.isFetching ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <ClipboardList className="mr-1.5 h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>

              <div className="mt-5 space-y-2">
                {healthQuery.data?.available ? (
                  healthQuery.data.rows.map((row) => (
                    <div
                      key={`${row.area}-${row.label}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border bg-background/60 px-4 py-3 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold">{row.label}</span>
                        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {row.area}
                        </span>
                      </span>
                      <span className="font-bold text-primary">{row.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                      <AlertTriangle className="h-4 w-4" /> Storage health check unavailable
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Run the newest migration from Supabase SQL Editor:
                      `KKCC-Excellence-Hub-STORAGE-USAGE.sql`. Controls below already work from
                      defaults and saved site settings.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <h2 className="text-lg font-bold">Free-plan safety guidance</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Kit 2 Coins rewards and progress stay browser-local, so quiz volume does not grow
                  the database.
                </li>
                <li>Keep videos on YouTube and large files below the project storage budget.</li>
                <li>
                  Move future large media to external storage from Admin → Storage before Supabase
                  file quota is close.
                </li>
                <li>
                  Health rows help track database/table sizes without sharing secrets with students.
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className="sticky bottom-20 z-30 mt-6 flex justify-end lg:bottom-5">
          <Button
            size="lg"
            className="rounded-full shadow-lift"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate(form)}
          >
            {saveMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save app controls
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
