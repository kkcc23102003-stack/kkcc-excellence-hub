import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { listMyNotifications, markNotificationRead } from "@/lib/notifications.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — KKCC Dashboard" },
      {
        name: "description",
        content: "Updates on new lectures, tests and study material from KKCC.",
      },
      { property: "og:title", content: "Notifications — KKCC" },
      { property: "og:description", content: "Stay updated with KKCC announcements." },
    ],
  }),
  component: NotificationsPage,
});

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  action_label: string;
  action_url: string;
  time: string;
  unread: boolean;
};

function NotificationsPage() {
  const qc = useQueryClient();
  const load = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);

  const query = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => load(),
    retry: false,
  });

  const liveItems: NotificationItem[] = (query.data ?? []).map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    priority: notification.priority,
    action_label: notification.action_label,
    action_url: notification.action_url,
    time: new Date(notification.created_at).toLocaleString(),
    unread: !notification.is_read,
  }));

  const items = liveItems;
  const unread = items.filter((n) => n.unread).length;

  const markMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!liveItems.length) return;
      await Promise.all(ids.map((id) => markRead({ data: { id } })));
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["dashboard", "notifications"] }),
  });

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {query.isLoading ? "Loading updates..." : `${unread} unread updates`}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 rounded-full"
          disabled={markMutation.isPending || unread === 0 || !liveItems.length}
          onClick={() => markMutation.mutate(liveItems.filter((n) => n.unread).map((n) => n.id))}
        >
          {markMutation.isPending ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="mr-1.5 h-4 w-4" />
          )}
          Mark all read
        </Button>
      </div>

      {query.error && (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {friendlyError(query.error)}
        </div>
      )}

      <ul className="mt-8 space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className={cn(
              "surface-panel flex gap-4 p-5",
              n.unread && "border-primary/30 bg-primary/[0.04]",
              n.priority === "high" && "border-destructive/40",
            )}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {n.type}
                </Badge>
                {n.priority === "high" && (
                  <Badge variant="destructive" className="rounded-full text-[10px]">
                    Important
                  </Badge>
                )}
                {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="mt-1.5 text-sm font-medium">{n.title}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{n.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{n.time}</span>
                {n.action_url && (
                  <Button asChild size="sm" variant="outline" className="h-8 rounded-full">
                    <a href={n.action_url}>{n.action_label || "Open"}</a>
                  </Button>
                )}
                {liveItems.length > 0 && n.unread && (
                  <button
                    className="text-primary hover:underline"
                    disabled={markMutation.isPending}
                    onClick={() => markMutation.mutate([n.id])}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!query.isLoading && items.length === 0 && (
        <div className="surface-panel mt-8 p-8 text-center text-sm text-muted-foreground">
          No notifications yet. KKCC announcements and learning updates will appear here.
        </div>
      )}
    </div>
  );
}
