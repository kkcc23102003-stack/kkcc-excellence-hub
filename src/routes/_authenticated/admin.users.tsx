import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Loader2,
  Search,
  ShieldCheck,
  ShieldMinus,
  ShieldPlus,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminGrantRoleByEmail,
  adminListUsers,
  adminRevokeRole,
  adminSetStudentBlockStatus,
} from "@/lib/admin-users.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Admin users — KKCC Admin" },
      { name: "description", content: "Grant or remove KKCC admin panel access." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminUsersPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
});

function AdminUsersPage() {
  const qc = useQueryClient();
  const listUsers = useServerFn(adminListUsers);
  const grantByEmail = useServerFn(adminGrantRoleByEmail);
  const revokeRole = useServerFn(adminRevokeRole);
  const setBlockStatus = useServerFn(adminSetStudentBlockStatus);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => listUsers({ data: { query } }),
    retry: false,
    throwOnError: true,
  });

  const grantMutation = useMutation({
    mutationFn: (targetEmail: string) => grantByEmail({ data: { email: targetEmail } }),
    onSuccess: ({ email: grantedEmail }) => {
      setEmail("");
      toast.success(`Admin access granted to ${grantedEmail}`);
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const revokeMutation = useMutation({
    mutationFn: (userId: string) => revokeRole({ data: { user_id: userId } }),
    onSuccess: () => {
      toast.success("Admin access removed");
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const blockMutation = useMutation({
    mutationFn: (payload: { user_id: string; blocked: boolean; reason?: string }) =>
      setBlockStatus({ data: payload }),
    onSuccess: (result) => {
      toast.success(result.blocked ? "Student blocked from app" : "Student unblocked");
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const users = usersQuery.data ?? [];

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Role management"
        description="Only admins can open this page. Grant admin panel access to trusted KKCC team members after they sign up."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-5">
            <ShieldPlus className="h-8 w-8 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Grant admin access</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the email used during signup. The owner admin is protected from removal.
            </p>
            <div className="mt-5 space-y-2">
              <Label htmlFor="admin-email">User email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
              />
            </div>
            <Button
              className="mt-4 rounded-full"
              disabled={!email.trim() || grantMutation.isPending}
              onClick={() => grantMutation.mutate(email.trim())}
            >
              {grantMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-1.5 h-4 w-4" />
              )}
              Make admin
            </Button>
          </div>

          <div className="surface-panel p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Signed-up users</h2>
                <p className="text-sm text-muted-foreground">
                  Search students/team by name, email, mobile, class or target exam.
                </p>
              </div>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {usersQuery.isLoading && (
                <p className="text-sm text-muted-foreground">Loading users…</p>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border bg-background/70 p-4 shadow-sm sm:flex sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">{user.display_name}</p>
                      {user.is_admin ? (
                        <Badge className="rounded-full text-[11px]">Admin</Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full text-[11px]">
                          User
                        </Badge>
                      )}
                      {user.is_owner && (
                        <Badge variant="outline" className="rounded-full text-[11px]">
                          Owner
                        </Badge>
                      )}
                      {user.is_blocked && (
                        <Badge variant="destructive" className="rounded-full text-[11px]">
                          Blocked
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {user.email || user.id}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.mobile || "No mobile"} · {user.class_level || "No class"} ·{" "}
                      {user.target_exam || "No target"}
                    </p>
                    {user.is_blocked && user.blocked_reason && (
                      <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        {user.blocked_reason}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex shrink-0 flex-wrap gap-2 sm:mt-0 sm:justify-end">
                    {user.is_admin ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive"
                        disabled={user.is_owner || revokeMutation.isPending}
                        onClick={() => revokeMutation.mutate(user.id)}
                      >
                        <ShieldMinus className="mr-1.5 h-3.5 w-3.5" /> Remove admin
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => grantMutation.mutate(user.email)}
                          disabled={!user.email || grantMutation.isPending || user.is_blocked}
                        >
                          <ShieldPlus className="mr-1.5 h-3.5 w-3.5" /> Grant admin
                        </Button>
                        {user.is_blocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            disabled={blockMutation.isPending}
                            onClick={() =>
                              blockMutation.mutate({ user_id: user.id, blocked: false })
                            }
                          >
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full text-destructive"
                            disabled={blockMutation.isPending}
                            onClick={() => {
                              const reason = window.prompt(
                                "Reason for blocking this student from KKCC app?",
                                "Access paused by admin",
                              );
                              if (reason === null) return;
                              blockMutation.mutate({
                                user_id: user.id,
                                blocked: true,
                                reason: reason.trim() || "Access paused by admin",
                              });
                            }}
                          >
                            <Ban className="mr-1.5 h-3.5 w-3.5" /> Block app
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {!usersQuery.isLoading && !users.length && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                  No matching users. Ask the person to sign up first.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
