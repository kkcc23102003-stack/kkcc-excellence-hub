import { createFileRoute } from "@tanstack/react-router";
import { Download, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — KKCC Excellence Hub" },
      {
        name: "description",
        content:
          "Download the KKCC Excellence Hub website ZIP, SQL cleaner and one combined SQL setup file.",
      },
    ],
  }),
  component: DownloadsPage,
});

const DOWNLOADS = [
  {
    title: "Legacy SQL downloads retired",
    description:
      "Educational questions and learning content are bundled with the application. Legacy Supabase schema, cleaner and AI-question SQL files are no longer distributed from the public website.",
    href: null,
    button: "Retired",
    icon: ShieldCheck,
    sha256: null,
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
              Public SQL exports are retired. Student authentication, profiles and access records use
              Supabase only where required; educational content stays in the application data layer.
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

                    </div>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-bold text-muted-foreground">
                      {button}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 rounded-3xl border border-accent/25 bg-accent/10 p-5 text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">Current data boundary</p>
              <p className="mt-2">
                Questions, question-bank templates, tests and educational learning content are not
                distributed as Supabase SQL. Student accounts, authentication and access grants remain
                supported through the application’s protected Supabase layer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
