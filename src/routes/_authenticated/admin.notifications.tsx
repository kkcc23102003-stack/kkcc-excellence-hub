import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, Loader2, Plus, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { adminListCourses } from "@/lib/admin.functions";
import {
  adminListNotifications,
  deleteNotification,
  saveNotification,
} from "@/lib/notifications.functions";
import type { NotificationRow } from "@/integrations/supabase/db";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Admin — Notifications | KKCC" },
      {
        name: "description",
        content: "Send in-app notifications and announcements to KKCC students.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminNotifications,
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

type FormState = {
  id?: string;
  title: string;
  message: string;
  type: string;
  audience: "all" | "students" | "admins" | "course" | "user";
  course_id: string;
  target_user_id: string;
  priority: "low" | "normal" | "high";
  action_label: string;
  action_url: string;
  is_published: boolean;
  send_at: string;
  expires_at: string;
};

function blankForm(): FormState {
  return {
    title: "",
    message: "",
    type: "announcement",
    audience: "all",
    course_id: "",
    target_user_id: "",
    priority: "normal",
    action_label: "",
    action_url: "",
    is_published: true,
    send_at: "",
    expires_at: "",
  };
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function formFromRow(row: NotificationRow): FormState {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type || "announcement",
    audience: row.audience,
    course_id: row.course_id ?? "",
    target_user_id: row.target_user_id ?? "",
    priority: row.priority,
    action_label: row.action_label,
    action_url: row.action_url,
    is_published: row.is_published,
    send_at: toDateTimeLocal(row.send_at),
    expires_at: toDateTimeLocal(row.expires_at),
  };
}

function AdminNotifications() {
  const qc = useQueryClient();
  const loadNotifications = useServerFn(adminListNotifications);
  const loadCourses = useServerFn(adminListCourses);
  const save = useServerFn(saveNotification);
  const remove = useServerFn(deleteNotification);
  const [form, setForm] = useState<FormState>(blankForm());

  const notificationsQuery = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: () => loadNotifications(),
    throwOnError: true,
  });
  const coursesQuery = useQuery({
    queryKey: ["admin", "courses", "notification-picker"],
    queryFn: () => loadCourses(),
    throwOnError: true,
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: form.id,
          title: form.title,
          message: form.message,
          type: form.type,
          audience: form.audience,
          course_id: form.audience === "course" ? form.course_id || null : null,
          target_user_id: form.audience === "user" ? form.target_user_id || null : null,
          priority: form.priority,
          action_label: form.action_label,
          action_url: form.action_url,
          is_published: form.is_published,
          send_at: fromDateTimeLocal(form.send_at),
          expires_at: fromDateTimeLocal(form.expires_at),
        },
      }),
    onSuccess: () => {
      toast.success(
        form.is_published ? "Notification sent/published" : "Notification saved as draft",
      );
      setForm(blankForm());
      void qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Notification deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const notifications = notificationsQuery.data ?? [];
  const courses = coursesQuery.data ?? [];

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Send notifications"
        description="Send live in-app notifications/announcements to student dashboards. The audience can be all users, students, admins, or students enrolled in a selected course."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
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
            <Link to="/admin/coupons">Coupons</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/dashboard/notifications">Student view</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            className="surface-panel space-y-5 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate();
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <BellRing className="h-5 w-5 text-primary" />
                  {form.id ? "Edit notification" : "Create notification"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  If Publish is on, the notification will appear on the student dashboard
                  immediately.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setForm(blankForm())}
              >
                <Plus className="mr-1.5 h-4 w-4" /> New
              </Button>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                className="mt-1.5"
                value={form.title}
                maxLength={160}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Example: Class 10 test starts tomorrow"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                className="mt-1.5 min-h-32"
                value={form.message}
                maxLength={4000}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Write the full notification message..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Type</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="announcement">Announcement</option>
                  <option value="test">Test</option>
                  <option value="lecture">Lecture</option>
                  <option value="payment">Payment</option>
                  <option value="result">Result</option>
                </select>
              </div>
              <div>
                <Label>Audience</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.audience}
                  onChange={(event) =>
                    setForm({ ...form, audience: event.target.value as FormState["audience"] })
                  }
                >
                  <option value="all">All users</option>
                  <option value="students">Students</option>
                  <option value="admins">Admins</option>
                  <option value="course">Selected course students</option>
                  <option value="user">Single user ID</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value as FormState["priority"] })
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {form.audience === "course" && (
              <div>
                <Label>Course</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.course_id}
                  onChange={(event) => setForm({ ...form, course_id: event.target.value })}
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form.audience === "user" && (
              <div>
                <Label>Target user ID</Label>
                <Input
                  className="mt-1.5"
                  value={form.target_user_id}
                  onChange={(event) => setForm({ ...form, target_user_id: event.target.value })}
                  placeholder="Supabase auth user UUID"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Personal notifications are used automatically for doubt replies; this field is
                  advanced/manual.
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Button label (optional)</Label>
                <Input
                  className="mt-1.5"
                  value={form.action_label}
                  onChange={(event) => setForm({ ...form, action_label: event.target.value })}
                  placeholder="Open test"
                />
              </div>
              <div>
                <Label>Button link (optional)</Label>
                <Input
                  className="mt-1.5"
                  value={form.action_url}
                  onChange={(event) => setForm({ ...form, action_url: event.target.value })}
                  placeholder="/test-series"
                />
              </div>
              <div>
                <Label>Schedule time (optional)</Label>
                <Input
                  className="mt-1.5"
                  type="datetime-local"
                  value={form.send_at}
                  onChange={(event) => setForm({ ...form, send_at: event.target.value })}
                />
              </div>
              <div>
                <Label>Expiry time (optional)</Label>
                <Input
                  className="mt-1.5"
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) => setForm({ ...form, expires_at: event.target.value })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) => setForm({ ...form, is_published: event.target.checked })}
              />
              Publish / send notification
            </label>

            <Button
              className="w-full rounded-full"
              disabled={saveMutation.isPending || !form.title.trim() || !form.message.trim()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : form.is_published ? (
                <Send className="mr-1.5 h-4 w-4" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              {form.is_published ? "Send notification" : "Save draft"}
            </Button>
          </form>

          <div className="space-y-4">
            {notificationsQuery.isLoading && <div className="surface-panel p-6">Loading...</div>}
            {notifications.map((notification) => (
              <article key={notification.id} className="surface-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant={notification.is_published ? "default" : "secondary"}>
                        {notification.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{notification.audience}</Badge>
                      <Badge variant={notification.priority === "high" ? "destructive" : "outline"}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    {(notification.action_label || notification.action_url) && (
                      <p className="mt-2 text-xs text-primary">
                        Action: {notification.action_label || "Open"} →{" "}
                        {notification.action_url || "No link"}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Created {new Date(notification.created_at).toLocaleString()} · Type{" "}
                      {notification.type}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setForm(formFromRow(notification))}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (confirm("Delete this notification?"))
                          deleteMutation.mutate(notification.id);
                      }}
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            {!notificationsQuery.isLoading && notifications.length === 0 && (
              <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
                No notifications yet. Create the first announcement from the form.
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
