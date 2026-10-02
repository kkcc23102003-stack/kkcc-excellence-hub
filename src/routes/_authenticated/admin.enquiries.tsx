import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  adminDeleteEnquiry,
  adminListEnquiries,
  adminUpdateEnquiry,
} from "@/lib/enquiries.functions";
import type { AdmissionEnquiryRow } from "@/integrations/supabase/db";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Admin — Admission Enquiries | KKCC" },
      { name: "description", content: "Manage public admission and batch enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminEnquiries,
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

function AdminEnquiries() {
  const qc = useQueryClient();
  const load = useServerFn(adminListEnquiries);
  const update = useServerFn(adminUpdateEnquiry);
  const remove = useServerFn(adminDeleteEnquiry);

  const query = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => load(),
    throwOnError: true,
  });

  const updateMutation = useMutation({
    mutationFn: (input: {
      id: string;
      status: "new" | "contacted" | "admitted" | "closed" | "spam";
      priority: "low" | "normal" | "high";
      admin_note: string;
      mark_contacted: boolean;
    }) => update({ data: input }),
    onSuccess: () => {
      toast.success("Enquiry updated");
      void qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Enquiry deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const enquiries = query.data ?? [];
  const newCount = enquiries.filter((item) => item.status === "new").length;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Admission enquiries"
        description="Manage leads from the website support/admission form here. Track follow-up notes, status, and priority."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/doubts">Doubts</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/support">Public form</Link>
          </Button>
        </div>

        <div className="surface-panel mb-6 flex flex-wrap items-center gap-3 p-5">
          <Inbox className="h-5 w-5 text-primary" />
          <p className="font-semibold">{newCount} new enquiries</p>
          <p className="text-sm text-muted-foreground">
            After phone/WhatsApp follow-up, you can set the status to contacted, admitted, or
            closed.
          </p>
        </div>

        <div className="space-y-4">
          {query.isLoading && <div className="surface-panel p-6">Loading enquiries...</div>}
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              isSaving={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
              onUpdate={(input) => updateMutation.mutate({ id: enquiry.id, ...input })}
              onDelete={() => {
                if (confirm("Delete this enquiry?")) deleteMutation.mutate(enquiry.id);
              }}
            />
          ))}
          {!query.isLoading && enquiries.length === 0 && (
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
              No enquiries yet. Public support form submissions will appear here.
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function EnquiryCard({
  enquiry,
  isSaving,
  isDeleting,
  onUpdate,
  onDelete,
}: {
  enquiry: AdmissionEnquiryRow;
  isSaving: boolean;
  isDeleting: boolean;
  onUpdate: (input: {
    status: AdmissionEnquiryRow["status"];
    priority: AdmissionEnquiryRow["priority"];
    admin_note: string;
    mark_contacted: boolean;
  }) => void;
  onDelete: () => void;
}) {
  const [status, setStatus] = useState(enquiry.status);
  const [priority, setPriority] = useState(enquiry.priority);
  const [note, setNote] = useState(enquiry.admin_note);
  const [markContacted, setMarkContacted] = useState(false);

  return (
    <article className="surface-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status === "new" ? "default" : "secondary"}>{status}</Badge>
            <Badge variant={priority === "high" ? "destructive" : "outline"}>{priority}</Badge>
            <span className="text-xs text-muted-foreground">{enquiry.source}</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold">{enquiry.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {enquiry.email}
            {enquiry.phone ? ` · ${enquiry.phone}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {enquiry.class_level || "Class not shared"} ·{" "}
            {enquiry.interest || "Interest not shared"} ·{" "}
            {new Date(enquiry.created_at).toLocaleString()}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
            {enquiry.message}
          </p>
          {enquiry.last_contacted_at && (
            <p className="mt-2 text-xs text-primary">
              Last contacted: {new Date(enquiry.last_contacted_at).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-destructive"
          disabled={isDeleting}
          onClick={onDelete}
          aria-label="Delete enquiry"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 rounded-2xl border bg-muted/30 p-4">
        <div className="grid gap-3 md:grid-cols-[160px_160px_1fr]">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="admitted">Admitted</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={priority}
              onChange={(event) => setPriority(event.target.value as typeof priority)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Admin follow-up note</label>
            <Textarea
              className="mt-1.5 min-h-20"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Call notes, fee discussion, batch preference..."
            />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={markContacted}
            onChange={(event) => setMarkContacted(event.target.checked)}
          />
          Mark contacted now
        </label>
        <Button
          className="mt-3 rounded-full"
          disabled={isSaving}
          onClick={() =>
            onUpdate({ status, priority, admin_note: note, mark_contacted: markContacted })
          }
        >
          {isSaving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}
          Save lead
        </Button>
      </div>
    </article>
  );
}
