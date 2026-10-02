import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emptySocialLinks,
  getSocialLinks,
  saveSocialLinks,
  socialUrlSchema,
  type SocialLink,
  type SocialLinks,
} from "@/lib/settings.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin — Social Links | KKCC" },
      {
        name: "description",
        content: "Manage every social/app/community link shown in the KKCC footer.",
      },
      { property: "og:title", content: "Admin — Social links | KKCC" },
      {
        property: "og:description",
        content: "Configure KKCC social media and future app/community links.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettings,
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

function createBlankLink(index: number): SocialLink {
  return {
    id: `custom-${Date.now()}-${index}`,
    label: "New app",
    url: "",
    enabled: true,
    sort_order: index + 1,
  };
}

function AdminSettings() {
  const load = useServerFn(getSocialLinks);
  const save = useServerFn(saveSocialLinks);
  const queryClient = useQueryClient();
  const [values, setValues] = useState<SocialLinks>(emptySocialLinks());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "social-links"],
    queryFn: () => load(),
    throwOnError: true,
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: SocialLinks) => save({ data: payload }),
    onSuccess: (saved) => {
      setValues(saved);
      toast.success("Social/app links updated");
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "social-links"] });
    },
    onError: (err) => toast.error(friendlyError(err)),
  });

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    setValues((current) => current.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  };

  const removeLink = (index: number) => {
    setValues((current) => current.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setValues((current) => [...current, createBlankLink(current.length)]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    const cleaned = values.map((link, index) => ({
      ...link,
      label: link.label.trim(),
      url: link.url.trim(),
      sort_order: Number.isFinite(link.sort_order) ? link.sort_order : index + 1,
    }));

    cleaned.forEach((link, index) => {
      if (!link.label) next[`label-${index}`] = "Label is required";
      const parsed = socialUrlSchema.safeParse(link.url);
      if (!parsed.success) next[`url-${index}`] = parsed.error.issues[0]?.message ?? "Invalid URL";
    });

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    mutation.mutate(cleaned);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Social & app links"
        description="Footer/social buttons are fully customizable. When a new app, channel, community, form, or website is needed later, you can add, delete, or rename it here without coding."
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
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
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/content">Website content</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/branding">Branding</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="surface-panel space-y-5 p-6" noValidate>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Custom social/app buttons</h2>
              <p className="text-sm text-muted-foreground">
                Add a label and full URL. Empty URLs or disabled links stay hidden in the footer.
              </p>
            </div>
            <Button type="button" variant="outline" className="rounded-full" onClick={addLink}>
              <Plus className="mr-1.5 h-4 w-4" /> Add new app/link
            </Button>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading settings…</p>
          ) : (
            <div className="space-y-4">
              {values.map((link, index) => (
                <div key={link.id} className="rounded-2xl border bg-card p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.7fr_110px_auto] lg:items-end">
                    <div>
                      <Label htmlFor={`label-${index}`}>App/link name</Label>
                      <Input
                        id={`label-${index}`}
                        placeholder="YouTube, Instagram, Telegram, KKCC App…"
                        value={link.label}
                        onChange={(e) => updateLink(index, { label: e.target.value })}
                        aria-invalid={!!errors[`label-${index}`]}
                        className="mt-1.5"
                      />
                      {errors[`label-${index}`] && (
                        <p className="mt-1 text-xs text-destructive">{errors[`label-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`url-${index}`}>URL</Label>
                      <Input
                        id={`url-${index}`}
                        inputMode="url"
                        placeholder="https://example.com/your-link"
                        value={link.url}
                        onChange={(e) => updateLink(index, { url: e.target.value })}
                        aria-invalid={!!errors[`url-${index}`]}
                        className="mt-1.5"
                      />
                      {errors[`url-${index}`] && (
                        <p className="mt-1 text-xs text-destructive">{errors[`url-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`order-${index}`}>Order</Label>
                      <Input
                        id={`order-${index}`}
                        type="number"
                        min={0}
                        max={999}
                        value={link.sort_order}
                        onChange={(e) =>
                          updateLink(index, { sort_order: Number(e.target.value || index + 1) })
                        }
                        className="mt-1.5"
                      />
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <label className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateLink(index, { enabled: e.target.checked })}
                        />
                        Show
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full text-destructive"
                        onClick={() => removeLink(index)}
                        aria-label={`Delete ${link.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {values.length === 0 && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No social/app links yet. Click “Add new app/link”.
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="submit"
              className="rounded-full"
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save links
            </Button>
            <Button asChild type="button" variant="outline" className="rounded-full">
              <Link to="/admin">Back to admin</Link>
            </Button>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}
