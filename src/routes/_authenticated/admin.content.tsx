import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CUSTOM_PAGE_KEYS,
  CUSTOM_PAGE_LABELS,
  DEFAULT_WEBSITE_CONTENT,
  getAdminWebsiteContent,
  saveAdminWebsiteContent,
  type CustomPageKey,
  type WebsiteContentSettings,
} from "@/lib/website-content.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({
    meta: [
      { title: "Admin — Website Content | KKCC" },
      {
        name: "description",
        content: "Edit frontend page text, navigation labels, support details and footer content.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WebsiteContentManager,
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

type PageKey = keyof WebsiteContentSettings["page_headers"];
type NavKey = keyof WebsiteContentSettings["nav"];
type CustomBlock = WebsiteContentSettings["custom_blocks"][number];

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        className="mt-1.5"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        className="mt-1.5 min-h-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const PAGE_LABELS: Record<PageKey, string> = {
  courses: "Courses page",
  classes: "Classes page",
  study_material: "Study material page",
  test_series: "Test series page",
  results: "Results page",
  support: "Support page",
  faculty: "Faculty page",
};

const NAV_LABELS: Record<NavKey, string> = {
  home: "Home",
  courses: "Courses",
  classes: "Classes",
  test_series: "Test Series",
  study_material: "Study Material",
  faculty: "Faculty",
  results: "Results",
  support: "Support",
  login: "Login button",
  signup: "Signup button",
  dashboard: "Dashboard button",
  admin: "Admin button",
};

function createCustomBlock(index: number): CustomBlock {
  return {
    id: `block-${Date.now()}-${index}`,
    page: "home",
    position: "bottom",
    style: "card",
    enabled: true,
    sort_order: index + 1,
    eyebrow: "",
    title: "New content block",
    description: "",
    body: "",
    button_label: "",
    button_to: "",
    image_url: "",
  };
}

function WebsiteContentManager() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminWebsiteContent);
  const save = useServerFn(saveAdminWebsiteContent);
  const [form, setForm] = useState<WebsiteContentSettings>(DEFAULT_WEBSITE_CONTENT);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "website-content"],
    queryFn: () => load(),
    retry: false,
    throwOnError: true,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: WebsiteContentSettings) => save({ data: payload }),
    onSuccess: (saved) => {
      setForm(saved);
      void qc.invalidateQueries({ queryKey: ["admin", "website-content"] });
      void qc.invalidateQueries({ queryKey: ["public-website-content"] });
      toast.success("Website content saved");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const setNav = (key: NavKey, value: string) =>
    setForm((current) => ({ ...current, nav: { ...current.nav, [key]: value } }));

  const setPageHeader = (
    page: PageKey,
    field: "eyebrow" | "title" | "description",
    value: string,
  ) =>
    setForm((current) => ({
      ...current,
      page_headers: {
        ...current.page_headers,
        [page]: { ...current.page_headers[page], [field]: value },
      },
    }));

  const updateCustomBlock = (index: number, patch: Partial<CustomBlock>) =>
    setForm((current) => {
      const custom_blocks = [...current.custom_blocks];
      const existing = custom_blocks[index];
      if (!existing) return current;
      custom_blocks[index] = { ...existing, ...patch };
      return { ...current, custom_blocks };
    });

  const addCustomBlock = () =>
    setForm((current) => ({
      ...current,
      custom_blocks: [...current.custom_blocks, createCustomBlock(current.custom_blocks.length)],
    }));

  const removeCustomBlock = (index: number) =>
    setForm((current) => ({
      ...current,
      custom_blocks: current.custom_blocks.filter((_, itemIndex) => itemIndex !== index),
    }));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Website content"
        description="Edit navigation labels, public page headings, support/contact details, footer links and home page section text without coding."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/branding">Branding</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/text-manager">Text Manager</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
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
            <Link to="/admin/offline-access">Offline access</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="surface-panel p-8 text-sm text-muted-foreground">Loading content…</div>
        ) : (
          <div className="space-y-6">
            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Navigation labels</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.keys(NAV_LABELS) as NavKey[]).map((key) => (
                  <TextField
                    key={key}
                    label={NAV_LABELS[key]}
                    value={form.nav[key]}
                    onChange={(value) => setNav(key, value)}
                  />
                ))}
              </div>
            </section>

            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Public page headers</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {(Object.keys(PAGE_LABELS) as PageKey[]).map((page) => (
                  <div key={page} className="rounded-2xl border p-4">
                    <h3 className="font-semibold">{PAGE_LABELS[page]}</h3>
                    <div className="mt-4 space-y-3">
                      <TextField
                        label="Eyebrow/top small text"
                        value={form.page_headers[page].eyebrow}
                        onChange={(value) => setPageHeader(page, "eyebrow", value)}
                      />
                      <TextField
                        label="Title"
                        value={form.page_headers[page].title}
                        onChange={(value) => setPageHeader(page, "title", value)}
                      />
                      <TextAreaField
                        label="Description"
                        value={form.page_headers[page].description}
                        onChange={(value) => setPageHeader(page, "description", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Home page sections</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <h3 className="font-semibold">Course momentum section</h3>
                  <div className="mt-4 space-y-3">
                    <TextField
                      label="Eyebrow"
                      value={form.home.course_eyebrow}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, course_eyebrow: value } })
                      }
                    />
                    <TextField
                      label="Title"
                      value={form.home.course_title}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, course_title: value } })
                      }
                    />
                    <TextAreaField
                      label="Description"
                      value={form.home.course_description}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, course_description: value } })
                      }
                    />
                    <TextField
                      label="Search placeholder"
                      value={form.home.course_search_placeholder}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          home: { ...form.home, course_search_placeholder: value },
                        })
                      }
                    />
                    <TextField
                      label="View all courses button"
                      value={form.home.view_all_courses_label}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, view_all_courses_label: value } })
                      }
                    />
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <h3 className="font-semibold">Feature cards & faculty</h3>
                  <div className="mt-4 space-y-4">
                    {form.home.pillars.map((pillar, index) => (
                      <div key={index} className="grid gap-2 sm:grid-cols-2">
                        <TextField
                          label={`Feature ${index + 1} title`}
                          value={pillar.label}
                          onChange={(value) => {
                            const pillars = [...form.home.pillars];
                            pillars[index] = { ...pillar, label: value };
                            setForm({ ...form, home: { ...form.home, pillars } });
                          }}
                        />
                        <TextField
                          label={`Feature ${index + 1} subtitle`}
                          value={pillar.sub}
                          onChange={(value) => {
                            const pillars = [...form.home.pillars];
                            pillars[index] = { ...pillar, sub: value };
                            setForm({ ...form, home: { ...form.home, pillars } });
                          }}
                        />
                      </div>
                    ))}
                    <TextField
                      label="Faculty eyebrow"
                      value={form.home.faculty_eyebrow}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, faculty_eyebrow: value } })
                      }
                    />
                    <TextField
                      label="Faculty title"
                      value={form.home.faculty_title}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, faculty_title: value } })
                      }
                    />
                    <TextField
                      label="All faculty button"
                      value={form.home.all_faculty_label}
                      onChange={(value) =>
                        setForm({ ...form, home: { ...form.home, all_faculty_label: value } })
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-panel p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Movable page blocks</h2>
                  <p className="text-sm text-muted-foreground">
                    To move any custom section, card, or notice from one page to another, change the
                    page dropdown. Order and top/bottom position are also controlled here.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={addCustomBlock}
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add block
                </Button>
              </div>

              <div className="mt-5 space-y-5">
                {form.custom_blocks.map((block, index) => (
                  <div key={block.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-semibold">Block {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Current page: {CUSTOM_PAGE_LABELS[block.page]} · {block.position}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={block.enabled}
                            onChange={(event) =>
                              updateCustomBlock(index, { enabled: event.target.checked })
                            }
                          />
                          Show
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full text-destructive"
                          onClick={() => removeCustomBlock(index)}
                        >
                          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <Label>Page</Label>
                        <select
                          className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={block.page}
                          onChange={(event) =>
                            updateCustomBlock(index, { page: event.target.value as CustomPageKey })
                          }
                        >
                          {CUSTOM_PAGE_KEYS.map((page) => (
                            <option key={page} value={page}>
                              {CUSTOM_PAGE_LABELS[page]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Position</Label>
                        <select
                          className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={block.position}
                          onChange={(event) =>
                            updateCustomBlock(index, {
                              position: event.target.value as CustomBlock["position"],
                            })
                          }
                        >
                          <option value="top">Top of page</option>
                          <option value="bottom">Bottom of page</option>
                        </select>
                      </div>
                      <div>
                        <Label>Style</Label>
                        <select
                          className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={block.style}
                          onChange={(event) =>
                            updateCustomBlock(index, {
                              style: event.target.value as CustomBlock["style"],
                            })
                          }
                        >
                          <option value="card">Card</option>
                          <option value="banner">Big banner</option>
                          <option value="notice">Notice</option>
                        </select>
                      </div>
                      <TextField
                        label="Order"
                        value={String(block.sort_order)}
                        onChange={(value) =>
                          updateCustomBlock(index, { sort_order: Number(value || index + 1) })
                        }
                      />
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <TextField
                        label="Small eyebrow text"
                        value={block.eyebrow}
                        onChange={(value) => updateCustomBlock(index, { eyebrow: value })}
                      />
                      <TextField
                        label="Title"
                        value={block.title}
                        onChange={(value) => updateCustomBlock(index, { title: value })}
                      />
                      <TextField
                        label="Button label"
                        value={block.button_label}
                        onChange={(value) => updateCustomBlock(index, { button_label: value })}
                      />
                      <TextField
                        label="Button link/path"
                        value={block.button_to}
                        placeholder="/courses or https://example.com"
                        onChange={(value) => updateCustomBlock(index, { button_to: value })}
                      />
                      <div className="lg:col-span-2">
                        <TextField
                          label="Image URL (optional)"
                          value={block.image_url}
                          placeholder="https://..."
                          onChange={(value) => updateCustomBlock(index, { image_url: value })}
                        />
                      </div>
                      <TextAreaField
                        label="Short description"
                        value={block.description}
                        onChange={(value) => updateCustomBlock(index, { description: value })}
                      />
                      <TextAreaField
                        label="Body / details"
                        value={block.body}
                        onChange={(value) => updateCustomBlock(index, { body: value })}
                      />
                    </div>
                  </div>
                ))}

                {form.custom_blocks.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No movable blocks yet. Add a block, choose page/position, then save content.
                  </div>
                )}
              </div>
            </section>

            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Support/contact details</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <TextField
                    label="Form title"
                    value={form.support.form_title}
                    onChange={(value) =>
                      setForm({ ...form, support: { ...form.support, form_title: value } })
                    }
                  />
                  <TextField
                    label="Submit button label"
                    value={form.support.submit_label}
                    onChange={(value) =>
                      setForm({ ...form, support: { ...form.support, submit_label: value } })
                    }
                  />
                  <TextField
                    label="FAQ title"
                    value={form.support.faq_title}
                    onChange={(value) =>
                      setForm({ ...form, support: { ...form.support, faq_title: value } })
                    }
                  />
                </div>
                <div className="space-y-4">
                  {form.support.contacts.map((contact, index) => (
                    <div key={index} className="grid gap-2 sm:grid-cols-2">
                      <TextField
                        label={`Contact ${index + 1} label`}
                        value={contact.label}
                        onChange={(value) => {
                          const contacts = [...form.support.contacts];
                          contacts[index] = { ...contact, label: value };
                          setForm({ ...form, support: { ...form.support, contacts } });
                        }}
                      />
                      <TextField
                        label={`Contact ${index + 1} value`}
                        value={contact.value}
                        onChange={(value) => {
                          const contacts = [...form.support.contacts];
                          contacts[index] = { ...contact, value };
                          setForm({ ...form, support: { ...form.support, contacts } });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Footer columns</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                {form.footer.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="rounded-2xl border p-4">
                    <TextField
                      label={`Column ${columnIndex + 1} title`}
                      value={column.title}
                      onChange={(value) => {
                        const columns = [...form.footer.columns];
                        columns[columnIndex] = { ...column, title: value };
                        setForm({ ...form, footer: { ...form.footer, columns } });
                      }}
                    />
                    <div className="mt-4 space-y-3">
                      {column.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="rounded-xl bg-muted/50 p-3">
                          <TextField
                            label={`Link ${linkIndex + 1} label`}
                            value={link.label}
                            onChange={(value) => {
                              const columns = [...form.footer.columns];
                              const links = [...column.links];
                              links[linkIndex] = { ...link, label: value };
                              columns[columnIndex] = { ...column, links };
                              setForm({ ...form, footer: { ...form.footer, columns } });
                            }}
                          />
                          <div className="mt-3">
                            <TextField
                              label="Link path"
                              value={link.to}
                              onChange={(value) => {
                                const columns = [...form.footer.columns];
                                const links = [...column.links];
                                links[linkIndex] = { ...link, to: value };
                                columns[columnIndex] = { ...column, links };
                                setForm({ ...form, footer: { ...form.footer, columns } });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-panel p-5">
              <h2 className="text-lg font-bold">Test/result extra text</h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <TextField
                    label="Available tests title"
                    value={form.test_series.available_tests_title}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        test_series: { ...form.test_series, available_tests_title: value },
                      })
                    }
                  />
                  <TextField
                    label="Instructions title"
                    value={form.test_series.instructions_title}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        test_series: { ...form.test_series, instructions_title: value },
                      })
                    }
                  />
                  <TextAreaField
                    label="Instructions note"
                    value={form.test_series.note}
                    onChange={(value) =>
                      setForm({ ...form, test_series: { ...form.test_series, note: value } })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <TextAreaField
                    label="Results quote"
                    value={form.results.quote}
                    onChange={(value) =>
                      setForm({ ...form, results: { ...form.results, quote: value } })
                    }
                  />
                  <TextField
                    label="Results quote by"
                    value={form.results.quote_by}
                    onChange={(value) =>
                      setForm({ ...form, results: { ...form.results, quote_by: value } })
                    }
                  />
                </div>
              </div>
            </section>

            <section className="surface-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Save website content</h2>
                <p className="text-sm text-muted-foreground">
                  These values are stored in Supabase and update the frontend without code changes.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setForm(DEFAULT_WEBSITE_CONTENT)}
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Reset form
                </Button>
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
                  Save content
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
