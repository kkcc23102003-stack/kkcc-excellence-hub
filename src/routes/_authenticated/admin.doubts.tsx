import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { adminDeleteDoubt, adminListDoubts, adminReplyDoubt } from "@/lib/doubts.functions";
import type { StudentDoubtRow } from "@/integrations/supabase/db";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/doubts")({
  head: () => ({
    meta: [
      { title: "Admin — Doubt Inbox | KKCC" },
      { name: "description", content: "Reply to student doubts from KKCC admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDoubts,
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

function AdminDoubts() {
  const qc = useQueryClient();
  const load = useServerFn(adminListDoubts);
  const reply = useServerFn(adminReplyDoubt);
  const remove = useServerFn(adminDeleteDoubt);
  const query = useQuery({
    queryKey: ["admin", "doubts"],
    queryFn: () => load(),
    throwOnError: true,
  });

  const replyMutation = useMutation({
    mutationFn: (input: { id: string; admin_reply: string; status: "answered" | "closed" }) =>
      reply({ data: input }),
    onSuccess: () => {
      toast.success("Reply sent to student");
      void qc.invalidateQueries({ queryKey: ["admin", "doubts"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Doubt deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "doubts"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const profiles = new Map((query.data?.profiles ?? []).map((profile) => [profile.id, profile]));
  const courses = new Map((query.data?.courses ?? []).map((course) => [course.id, course]));
  const doubts = query.data?.doubts ?? [];
  const openCount = doubts.filter((doubt) => doubt.status === "open").length;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Doubt inbox"
        description="Reply to students' academic doubts from here. As soon as a reply is saved, the student receives a personal in-app notification."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/enquiries">Enquiries</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/dashboard/doubts">Student view</Link>
          </Button>
        </div>

        <div className="surface-panel mb-6 flex flex-wrap items-center gap-3 p-5">
          <HelpCircle className="h-5 w-5 text-primary" />
          <p className="font-semibold">{openCount} open doubts</p>
          <p className="text-sm text-muted-foreground">
            High-priority doubts will show with a red badge. After you answer, the status will
            change to answered.
          </p>
        </div>

        <div className="space-y-4">
          {query.isLoading && <div className="surface-panel p-6">Loading doubts...</div>}
          {doubts.map((doubt) => (
            <DoubtCard
              key={doubt.id}
              doubt={doubt}
              studentName={
                profiles.get(doubt.user_id)?.full_name ||
                profiles.get(doubt.user_id)?.email ||
                "Student"
              }
              studentEmail={profiles.get(doubt.user_id)?.email || doubt.user_id}
              courseTitle={
                doubt.course_id
                  ? courses.get(doubt.course_id)?.title || "Selected course"
                  : "General"
              }
              isSaving={replyMutation.isPending}
              isDeleting={deleteMutation.isPending}
              onReply={(admin_reply, status) =>
                replyMutation.mutate({ id: doubt.id, admin_reply, status })
              }
              onDelete={() => {
                if (confirm("Delete this doubt?")) deleteMutation.mutate(doubt.id);
              }}
            />
          ))}
          {!query.isLoading && doubts.length === 0 && (
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
              No student doubts yet.
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function DoubtCard({
  doubt,
  studentName,
  studentEmail,
  courseTitle,
  isSaving,
  isDeleting,
  onReply,
  onDelete,
}: {
  doubt: StudentDoubtRow;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  isSaving: boolean;
  isDeleting: boolean;
  onReply: (adminReply: string, status: "answered" | "closed") => void;
  onDelete: () => void;
}) {
  const [reply, setReply] = useState(doubt.admin_reply);
  const [status, setStatus] = useState<"answered" | "closed">(
    doubt.status === "closed" ? "closed" : "answered",
  );

  return (
    <article className="surface-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={doubt.status === "answered" ? "default" : "secondary"}>
              {doubt.status}
            </Badge>
            <Badge variant={doubt.priority === "high" ? "destructive" : "outline"}>
              {doubt.priority}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {courseTitle} · {doubt.subject}
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold">{doubt.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {studentName} · {studentEmail} · {new Date(doubt.created_at).toLocaleString()}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{doubt.message}</p>
          {doubt.attachment_url && (
            <a
              href={doubt.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Open attachment
            </a>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-destructive"
          disabled={isDeleting}
          onClick={onDelete}
          aria-label="Delete doubt"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl border bg-muted/30 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-sm font-medium">Faculty reply</label>
            <Textarea
              className="mt-1.5 min-h-28"
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Write answer/explanation for the student..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm md:w-36"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option value="answered">Answered</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <Button
          className="rounded-full"
          disabled={isSaving || reply.trim().length < 2}
          onClick={() => onReply(reply, status)}
        >
          {isSaving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-1.5 h-4 w-4" />
          )}
          Send answer
        </Button>
      </div>
    </article>
  );
}
