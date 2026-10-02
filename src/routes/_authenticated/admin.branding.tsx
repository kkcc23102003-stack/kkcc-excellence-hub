import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_BRANDING,
  getAdminBrandingSettings,
  saveAdminBrandingSettings,
  type BrandingSettings,
} from "@/lib/branding.functions";
import { friendlyError, uploadContentFile } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/branding")({
  head: () => ({
    meta: [
      { title: "Admin — Branding & Theme | KKCC" },
      {
        name: "description",
        content: "Edit app logo, name, hero text and frontend theme colours from the admin panel.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrandingManager,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link to="/admin">Back to admin</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login" search={{ redirectTo: "/admin/branding" }}>
              Sign in as admin
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  ),
});

function field<K extends keyof BrandingSettings>(
  value: BrandingSettings,
  key: K,
  next: BrandingSettings[K],
): BrandingSettings {
  return { ...value, [key]: next };
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  onClear,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {onClear && value && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const colorValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#18f4d6";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {value && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="color"
          value={colorValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-md border bg-background p-1"
          aria-label={label}
        />
        <Input value={value} placeholder="#18f4d6" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function LogoUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          const toastId = toast.loading(`Uploading ${file.name}…`);
          try {
            const { url } = await uploadContentFile(file, "branding/logos");
            onUploaded(url);
            toast.success("Logo uploaded. Save changes now.", { id: toastId });
          } catch (error) {
            toast.error(friendlyError(error), { id: toastId });
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={busy}
        onClick={() => ref.current?.click()}
      >
        {busy ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-1.5 h-4 w-4" />
        )}
        Upload logo
      </Button>
    </>
  );
}

function BrandingManager() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminBrandingSettings);
  const save = useServerFn(saveAdminBrandingSettings);
  const [form, setForm] = useState<BrandingSettings>(DEFAULT_BRANDING);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "branding"],
    queryFn: () => load(),
    retry: false,
    throwOnError: true,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: BrandingSettings) => save({ data: payload }),
    onSuccess: (saved) => {
      setForm(saved);
      void qc.invalidateQueries({ queryKey: ["admin", "branding"] });
      void qc.invalidateQueries({ queryKey: ["public-branding"] });
      toast.success("Branding saved. Refresh/open site to see everywhere.");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Branding, logo, text & colours"
        description="Change the app name, logo, hero text and main frontend colours without editing code. Blank fields can hide/remove text where supported."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/materials">Study material</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/content">Website content</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/offline-access">Offline access</Link>
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
            <Link to="/admin/storage">Storage</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/settings">Social/app links</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="surface-panel p-8 text-sm text-muted-foreground">Loading branding…</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <section className="surface-panel p-5">
                <div className="mb-5 flex items-center gap-2">
                  <ImagePlus className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-semibold">Logo & app name</h2>
                    <p className="text-xs text-muted-foreground">
                      Edit/change/delete the visible logo text and app identity.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="App full name"
                    value={form.app_name}
                    placeholder="Kusum Kartik Coaching Centre"
                    onChange={(value) => setForm(field(form, "app_name", value))}
                    onClear={() => setForm(field(form, "app_name", ""))}
                  />
                  <TextField
                    label="Short name"
                    value={form.short_name}
                    placeholder="KKCC"
                    onChange={(value) => setForm(field(form, "short_name", value))}
                    onClear={() => setForm(field(form, "short_name", ""))}
                  />
                  <div className="sm:col-span-2">
                    <TextField
                      label="Tagline"
                      value={form.tagline}
                      placeholder="Learn Better. Understand Deeper. Achieve More."
                      onChange={(value) => setForm(field(form, "tagline", value))}
                      onClear={() => setForm(field(form, "tagline", ""))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <Label>Logo URL</Label>
                      {form.logo_url && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => setForm(field(form, "logo_url", ""))}
                        >
                          <Trash2 className="h-3 w-3" /> Remove custom logo
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={form.logo_url}
                        placeholder="Upload or paste logo image URL. Empty = old KKCC logo."
                        onChange={(e) => setForm(field(form, "logo_url", e.target.value))}
                        className="flex-1"
                      />
                      <LogoUploader onUploaded={(url) => setForm(field(form, "logo_url", url))} />
                    </div>
                  </div>
                  <TextField
                    label="Logo alt text"
                    value={form.logo_alt}
                    placeholder="KKCC logo"
                    onChange={(value) => setForm(field(form, "logo_alt", value))}
                    onClear={() => setForm(field(form, "logo_alt", ""))}
                  />
                  <label className="flex items-center gap-2 pt-7 text-sm">
                    <input
                      type="checkbox"
                      checked={form.show_logo_text}
                      onChange={(e) => setForm(field(form, "show_logo_text", e.target.checked))}
                    />
                    Show logo text in header/footer
                  </label>
                </div>
              </section>

              <section className="surface-panel p-5">
                <h2 className="font-semibold">Home page main text</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Change the big frontend hero text and button labels.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Top badge / eyebrow"
                    value={form.hero_eyebrow}
                    onChange={(value) => setForm(field(form, "hero_eyebrow", value))}
                    onClear={() => setForm(field(form, "hero_eyebrow", ""))}
                  />
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <Label>Highlighted heading line</Label>
                      {form.hero_highlight && (
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => setForm(field(form, "hero_highlight", ""))}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <Textarea
                      className="min-h-40"
                      value={form.hero_highlight}
                      onChange={(event) =>
                        setForm(field(form, "hero_highlight", event.target.value))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextField
                      label="Main heading"
                      value={form.hero_title}
                      onChange={(value) => setForm(field(form, "hero_title", value))}
                      onClear={() => setForm(field(form, "hero_title", ""))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      className="mt-1.5 min-h-28"
                      value={form.hero_description}
                      onChange={(e) => setForm(field(form, "hero_description", e.target.value))}
                    />
                    {form.hero_description && (
                      <button
                        type="button"
                        className="mt-1 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setForm(field(form, "hero_description", ""))}
                      >
                        Clear description
                      </button>
                    )}
                  </div>
                  <TextField
                    label="Primary button text"
                    value={form.cta_primary_label}
                    onChange={(value) => setForm(field(form, "cta_primary_label", value))}
                    onClear={() => setForm(field(form, "cta_primary_label", ""))}
                  />
                  <TextField
                    label="Secondary button text"
                    value={form.cta_secondary_label}
                    onChange={(value) => setForm(field(form, "cta_secondary_label", value))}
                    onClear={() => setForm(field(form, "cta_secondary_label", ""))}
                  />
                </div>
              </section>

              <section className="surface-panel p-5">
                <h2 className="font-semibold">Frontend colours</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Change main website colours. Leave background/foreground blank to keep the old
                  KKCC theme.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ColorField
                    label="Primary colour"
                    value={form.primary_color}
                    onChange={(value) => setForm(field(form, "primary_color", value))}
                    onClear={() => setForm(field(form, "primary_color", ""))}
                  />
                  <ColorField
                    label="Accent colour"
                    value={form.accent_color}
                    onChange={(value) => setForm(field(form, "accent_color", value))}
                    onClear={() => setForm(field(form, "accent_color", ""))}
                  />
                  <ColorField
                    label="Background colour (optional)"
                    value={form.background_color}
                    onChange={(value) => setForm(field(form, "background_color", value))}
                    onClear={() => setForm(field(form, "background_color", ""))}
                  />
                  <ColorField
                    label="Text colour (optional)"
                    value={form.foreground_color}
                    onChange={(value) => setForm(field(form, "foreground_color", value))}
                    onClear={() => setForm(field(form, "foreground_color", ""))}
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="surface-panel p-5">
                <h2 className="font-semibold">Live preview</h2>
                <div
                  className="mt-4 rounded-3xl border p-5"
                  style={{
                    background: form.background_color || undefined,
                    color: form.foreground_color || undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl border bg-card">
                      {form.logo_url ? (
                        <img
                          src={form.logo_url}
                          alt={form.logo_alt || "Logo"}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span
                          className="text-xs font-bold"
                          style={{ color: form.primary_color || undefined }}
                        >
                          {form.short_name || "KKCC"}
                        </span>
                      )}
                    </div>
                    {form.show_logo_text && (
                      <div className="min-w-0">
                        <p className="font-bold">{form.short_name || "Short name hidden"}</p>
                        <p className="truncate text-xs opacity-70">
                          {form.app_name || "App name hidden"}
                        </p>
                      </div>
                    )}
                  </div>
                  <p
                    className="mt-5 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: form.primary_color || undefined }}
                  >
                    {form.hero_eyebrow || "Badge hidden"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{form.hero_title || "Heading hidden"}</h3>
                  {form.hero_highlight && (
                    <p
                      className="whitespace-pre-wrap text-xl font-bold"
                      style={{ color: form.primary_color || undefined }}
                    >
                      {form.hero_highlight}
                    </p>
                  )}
                  {form.hero_description && (
                    <p className="mt-3 text-sm opacity-75">{form.hero_description}</p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                      style={{ background: form.primary_color || "#18f4d6" }}
                    >
                      {form.cta_primary_label || "Primary"}
                    </span>
                    <span className="rounded-full border px-4 py-2 text-sm font-semibold">
                      {form.cta_secondary_label || "Secondary"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="surface-panel p-5">
                <h2 className="font-semibold">Save changes</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Changes are stored in Supabase `site_settings`. No coding needed next time.
                </p>
                <div className="mt-5 flex flex-col gap-2">
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
                    Save branding
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setForm(DEFAULT_BRANDING)}
                  >
                    <RotateCcw className="mr-1.5 h-4 w-4" /> Reset form to defaults
                  </Button>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
