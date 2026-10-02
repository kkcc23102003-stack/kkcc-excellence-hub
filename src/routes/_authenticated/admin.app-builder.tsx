import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Code2, Loader2, Save, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_APP_BUILDER_SETTINGS,
  getAdminAppBuilderSettings,
  saveAdminAppBuilderSettings,
  type AppBuilderSettings,
} from "@/lib/app-builder.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/app-builder")({
  head: () => ({
    meta: [
      { title: "Admin — App Builder | KKCC" },
      {
        name: "description",
        content: "Live no-code/code snippets for KKCC frontend changes without redeploy.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppBuilderPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">{friendlyError(error)}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/admin">Back to admin</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
});

function CodeField({
  label,
  helper,
  value,
  onChange,
  rows = 8,
  placeholder,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      <Textarea
        className="mt-2 font-mono text-xs"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function AppBuilderPage() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminAppBuilderSettings);
  const save = useServerFn(saveAdminAppBuilderSettings);
  const [form, setForm] = useState<AppBuilderSettings>(DEFAULT_APP_BUILDER_SETTINGS);

  const query = useQuery({
    queryKey: ["admin", "app-builder"],
    queryFn: () => load(),
    throwOnError: true,
  });

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: (payload: AppBuilderSettings) => save({ data: payload }),
    onSuccess: (saved) => {
      setForm(saved);
      void qc.invalidateQueries({ queryKey: ["admin", "app-builder"] });
      void qc.invalidateQueries({ queryKey: ["public-app-builder"] });
      toast.success("App Builder changes saved live");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="App Builder / Custom Code"
        description="Save prompt notes, custom HTML, custom CSS, and custom JS to show live website changes. Use it for banners, notices, forms, widgets, embeds, and styling changes without downloading a ZIP or redeploying."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/content">Website content</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/settings">Social/app links</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/coupons">Coupons</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/doubts">Doubts</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/enquiries">Enquiries</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
        </div>

        {query.isLoading ? (
          <div className="surface-panel p-8 text-sm text-muted-foreground">Loading builder…</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="surface-panel space-y-6 p-6">
              <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Wand2 className="h-5 w-5 text-primary" /> Live app changes
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Turning Enable off keeps the saved code, but it will not apply on the frontend.
                  </p>
                </div>
                <label className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
                  />
                  Enable live code
                </label>
              </div>

              <CodeField
                label="Prompt / future feature instruction"
                helper="Save your prompt/idea here. There is no built-in AI compiler, but this note stays in the admin panel and you can manage live changes with custom blocks/code."
                rows={6}
                value={form.feature_prompt}
                placeholder="Example: Add an admissions banner on the home page with a WhatsApp button..."
                onChange={(value) => setForm({ ...form, feature_prompt: value })}
              />

              <CodeField
                label="Top HTML"
                helper="Renders below the header. You can add banners, notices, iframe forms, app badges, etc."
                rows={8}
                value={form.top_html}
                placeholder={
                  '<section class="mx-auto max-w-7xl px-4 py-3"><div class="rounded-2xl bg-primary/10 p-4">Admissions open...</div></section>'
                }
                onChange={(value) => setForm({ ...form, top_html: value })}
              />

              <CodeField
                label="Bottom HTML"
                helper="Renders before the footer. Use it for bottom notices, widgets, or extra CTAs."
                rows={8}
                value={form.bottom_html}
                onChange={(value) => setForm({ ...form, bottom_html: value })}
              />

              <CodeField
                label="Custom CSS"
                helper="Global styling. Example: .my-banner { background: linear-gradient(...); }"
                rows={9}
                value={form.custom_css}
                onChange={(value) => setForm({ ...form, custom_css: value })}
              />

              <CodeField
                label="Custom JavaScript"
                helper="Advanced only. Incorrect JS can break the site; test small snippets first."
                rows={8}
                value={form.custom_js}
                placeholder="console.log('KKCC custom script loaded')"
                onChange={(value) => setForm({ ...form, custom_js: value })}
              />

              <CodeField
                label="Admin note"
                helper="A short note/version label for this change."
                rows={3}
                value={form.updated_note}
                onChange={(value) => setForm({ ...form, updated_note: value })}
              />

              <div className="flex flex-wrap gap-2 border-t pt-5">
                <Button
                  className="rounded-full"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate(form)}
                >
                  {mutation.isPending ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4" />
                  )}
                  Save live changes
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setForm(DEFAULT_APP_BUILDER_SETTINGS)}
                >
                  Reset form
                </Button>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="surface-panel p-5">
                <Code2 className="h-8 w-8 text-primary" />
                <h2 className="mt-3 font-bold">Important</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    ✅ Text, banners, widgets, embeds, CSS, and small JS changes will go live.
                  </li>
                  <li>✅ Use `/admin/content` to move website content blocks between pages.</li>
                  <li>⚠️ Full React/database/backend features may still need a code deploy.</li>
                  <li>⚠️ Only trusted admins should add custom JS/HTML.</li>
                </ul>
              </div>

              <div className="surface-panel p-5">
                <Sparkles className="h-8 w-8 text-primary" />
                <h2 className="mt-3 font-bold">Quick example</h2>
                <pre className="mt-3 overflow-auto rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
                  {`<section class="mx-auto max-w-7xl px-4 py-4">
  <div class="rounded-3xl border p-5">
    <b>Admissions Open</b>
    <a href="/support">Contact now</a>
  </div>
</section>`}
                </pre>
              </div>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
