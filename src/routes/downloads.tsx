import { createFileRoute } from "@tanstack/react-router";
import { Download, FileArchive } from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — KKCC Excellence Hub" },
      {
        name: "description",
        content: "Download the repaired KKCC Excellence Hub website source ZIP.",
      },
    ],
  }),
  component: DownloadsPage,
});

const DOWNLOADS = [
  {
    title: "KKCC Excellence Hub Website ZIP",
    description: "Complete repaired source archive for the existing website app.",
    href: "/downloads/kkcc-excellence-hub.zip",
    button: "Download ZIP",
    icon: FileArchive,
    sha256: "SHA-256 checksum: /downloads/kkcc-excellence-hub.zip.sha256",
  },
] as const;

function DownloadsPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="surface-panel p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Download className="h-3.5 w-3.5" /> Server Downloads
            </div>
            <h1 className="neon-text mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              KKCC Excellence Hub Files
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Download the repaired website source ZIP directly from this server page.
            </p>

            <div className="mt-8 grid gap-5">
              {DOWNLOADS.map(({ title, description, href, button, icon: Icon, sha256 }) => (
                <article key={href} className="rounded-3xl border bg-background/65 p-5 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold">{title}</h2>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 break-all rounded-2xl bg-muted/50 p-3 font-mono text-[11px] leading-relaxed text-accent">
                        SHA-256: {sha256}
                      </p>
                    </div>
                    <a
                      href={href}
                      download
                      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_24%,transparent)] transition-colors hover:bg-primary/90"
                    >
                      <Download className="mr-2 h-4 w-4" /> {button}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
