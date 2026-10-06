import { TestRetentionPanel } from "@/components/kkcc/test-retention-panel";
import { StorageUsagePanel } from "@/components/kkcc/storage-usage-panel";
import { SpaceSaverPanel } from "@/components/kkcc/space-saver-panel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cloud, Database, HardDrive, KeyRound, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminStorageSettings,
  saveAdminStorageSettings,
} from "@/lib/platform-settings.functions";
import { friendlyError } from "@/lib/storage";

const PROVIDERS = [
  {
    value: "supabase",
    label: "Supabase Storage",
    hint: "Current storage. Upload PDFs, notes, thumbnails and other educational files here.",
  },
  {
    value: "cloudflare_r2",
    label: "Cloudflare R2",
    hint: "S3-compatible, good free tier and low egress.",
  },
  { value: "aws_s3", label: "AWS S3", hint: "Standard S3 bucket, region and keys." },
  { value: "backblaze_b2", label: "Backblaze B2", hint: "Use the S3-compatible endpoint/keys." },
  {
    value: "wasabi",
    label: "Wasabi / S3-compatible",
    hint: "Any compatible provider with endpoint.",
  },
  {
    value: "external_url",
    label: "External URL mode",
    hint: "Paste hosted links manually; no direct upload.",
  },
] as const;

type ProviderValue = (typeof PROVIDERS)[number]["value"];

export const Route = createFileRoute("/_authenticated/admin/storage")({
  head: () => ({
    meta: [
      { title: "Storage settings — KKCC Admin" },
      {
        name: "description",
        content:
          "Configure external storage for educational files, with Supabase reserved for students/auth/access.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStoragePage,
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

function AdminStoragePage() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminStorageSettings);
  const save = useServerFn(saveAdminStorageSettings);
  const [provider, setProvider] = useState<ProviderValue>("supabase");
  const [bucket, setBucket] = useState("course-content");
  const [region, setRegion] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [publicBaseUrl, setPublicBaseUrl] = useState("");
  const [migrationStatus, setMigrationStatus] = useState<
    "idle" | "planned" | "running" | "paused" | "complete"
  >("idle");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [applicationKeyId, setApplicationKeyId] = useState("");
  const [applicationKey, setApplicationKey] = useState("");

  const settingsQuery = useQuery({
    queryKey: ["admin", "storage"],
    queryFn: () => load(),
    retry: false,
    throwOnError: true,
  });

  useEffect(() => {
    const data = settingsQuery.data;
    if (!data) return;
    setProvider((data.provider || "supabase") as ProviderValue);
    setBucket(data.bucket || "course-content");
    setRegion(data.region || "");
    setEndpoint(data.endpoint || "");
    setPublicBaseUrl(data.public_base_url || "");
    setMigrationStatus((data.migration_status || "idle") as typeof migrationStatus);
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          provider,
          bucket,
          region,
          endpoint,
          public_base_url: publicBaseUrl,
          migration_status: migrationStatus,
          access_key_id: accessKeyId.trim() || undefined,
          secret_access_key: secretAccessKey.trim() || undefined,
          application_key_id: applicationKeyId.trim() || undefined,
          application_key: applicationKey.trim() || undefined,
        },
      }),
    onSuccess: () => {
      setAccessKeyId("");
      setSecretAccessKey("");
      setApplicationKeyId("");
      setApplicationKey("");
      toast.success("Storage settings saved");
      void qc.invalidateQueries({ queryKey: ["admin", "storage"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const useSupabase = useMutation({
    mutationFn: () =>
      save({
        data: {
          provider: "supabase",
          bucket: "course-content",
          region: "",
          endpoint: "",
          public_base_url: "",
          migration_status: "idle",
        },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "storage"] });
      toast.success("Supabase Storage selected. Existing files have not been moved.");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });
  const secrets = settingsQuery.data?.secrets;
  const external = provider !== "supabase" && provider !== "external_url";

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Storage provider"
        description="Educational files use the selected provider. Supabase Storage is the current/default provider; S3/R2 can be enabled later without changing courses, tests or notes."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/materials">Materials</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments</Link>
          </Button>
        </div>

        <div className="mb-5 rounded-xl border p-4">
          <h2 className="font-bold">Use Supabase for notes and study-material uploads</h2>
          <p className="my-2 text-sm">
            No S3 account needed. Protected buckets belong to Supabase too; keep paid content
            private. Switching provider does not migrate old files—re-upload old attachments before
            changing an already-used provider.
          </p>
          <Button
            disabled={useSupabase.isPending}
            onClick={() => {
              if (
                window.confirm(
                  "Use Supabase course-content for new uploads? Existing files are not migrated. Old files on another provider may need re-uploading.",
                )
              )
                useSupabase.mutate();
            }}
          >
            Use Supabase Storage
          </Button>
        </div>
        <TestRetentionPanel />
        <StorageUsagePanel />
        <SpaceSaverPanel />
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-5">
            <Cloud className="h-9 w-9 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Provider selection</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              PDFs, notes and thumbnails use this setting. Lecture videos stay on YouTube.
            </p>

            <div className="mt-5 space-y-3">
              {PROVIDERS.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name="provider"
                    value={item.value}
                    checked={provider === item.value}
                    onChange={() => setProvider(item.value)}
                    className="mt-1 accent-primary"
                  />
                  <span>
                    <span className="font-semibold">{item.label}</span>
                    <span className="block text-sm text-muted-foreground">{item.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <Database className="h-9 w-9 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Connection details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Leave secret fields blank to keep saved credentials. A public base URL is needed for
              external providers so students can open files.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bucket">Bucket name</Label>
                <Input
                  id="bucket"
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value)}
                  placeholder="course-content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="auto / ap-south-1 / us-east-1"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="endpoint">S3 endpoint</Label>
                <Input
                  id="endpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://ACCOUNT_ID.r2.cloudflarestorage.com"
                  disabled={!external}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="public-base">Public base URL</Label>
                <Input
                  id="public-base"
                  value={publicBaseUrl}
                  onChange={(e) => setPublicBaseUrl(e.target.value)}
                  placeholder="https://cdn.example.com/course-content"
                  disabled={provider === "supabase"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="migration-status">Migration status</Label>
                <select
                  id="migration-status"
                  value={migrationStatus}
                  onChange={(e) => setMigrationStatus(e.target.value as typeof migrationStatus)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="idle">Idle</option>
                  <option value="planned">Planned</option>
                  <option value="running">Running</option>
                  <option value="paused">Paused</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>

            {external && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="access-key">Access key ID</Label>
                  <Input
                    id="access-key"
                    type="password"
                    value={accessKeyId}
                    onChange={(e) => setAccessKeyId(e.target.value)}
                    placeholder={
                      secrets?.storage_access_key_id.configured
                        ? "Stored — leave blank"
                        : "Paste key ID"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret access key</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    value={secretAccessKey}
                    onChange={(e) => setSecretAccessKey(e.target.value)}
                    placeholder={
                      secrets?.storage_secret_access_key.configured
                        ? "Stored — leave blank"
                        : "Paste secret"
                    }
                  />
                </div>
                {provider === "backblaze_b2" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="application-key-id">B2 application key ID</Label>
                      <Input
                        id="application-key-id"
                        type="password"
                        value={applicationKeyId}
                        onChange={(e) => setApplicationKeyId(e.target.value)}
                        placeholder={
                          secrets?.storage_application_key_id.configured
                            ? "Stored — leave blank"
                            : "Optional"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="application-key">B2 application key</Label>
                      <Input
                        id="application-key"
                        type="password"
                        value={applicationKey}
                        onChange={(e) => setApplicationKey(e.target.value)}
                        placeholder={
                          secrets?.storage_application_key.configured
                            ? "Stored — leave blank"
                            : "Optional"
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary" />
                <span className="font-semibold">Data-preserving migration plan</span>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  no broken links
                </Badge>
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Keep Supabase active while copying objects to the new bucket.</li>
                <li>Record each object in the files table with old and new URLs.</li>
                <li>Switch provider only after test downloads work from the public base URL.</li>
                <li>
                  Verify every asset/ID before cutover; revoke old long-lived educational signed
                  URLs after the verified copy.
                </li>
              </ol>
            </div>

            <div className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <KeyRound className="h-4 w-4 text-primary" /> Credential status
              </div>
              <p className="mt-2 text-muted-foreground">
                Access key:{" "}
                {secrets?.storage_access_key_id.configured ? "configured" : "not configured"} ·
                Secret key:{" "}
                {secrets?.storage_secret_access_key.configured ? "configured" : "not configured"}
              </p>
            </div>

            <Button
              className="mt-5 rounded-full"
              disabled={saveMutation.isPending || settingsQuery.isLoading}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <HardDrive className="mr-1.5 h-4 w-4" />
              )}
              Save storage settings
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
