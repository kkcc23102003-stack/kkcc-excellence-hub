import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { LogoMark } from "./logo";
import { getSocialLinks } from "@/lib/settings.functions";
import { useBranding } from "./branding-provider";
import { useWebsiteContent } from "./website-content-provider";

export function SiteFooter() {
  const branding = useBranding();
  const content = useWebsiteContent();
  const shortName = branding.short_name.trim();
  const appName = branding.app_name.trim();
  const tagline = branding.tagline.trim();
  const brandLabel = shortName || appName || "KKCC";
  const load = useServerFn(getSocialLinks);
  const { data: social } = useQuery({
    queryKey: ["social-links"],
    queryFn: () => load(),
    staleTime: 5 * 60 * 1000,
  });

  const socialLinks = (social ?? [])
    .filter((link) => link.enabled && link.url.trim().length > 0)
    .map((link) => ({ key: link.id, label: link.label, href: link.url.trim() }));

  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11" />
            <div className="min-w-0">
              {shortName && <p className="font-display text-base font-bold">{shortName}</p>}
              {appName && <p className="truncate text-xs text-muted-foreground">{appName}</p>}
            </div>
          </div>
          {tagline && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
          )}
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brandLabel} on ${s.label}`}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {content.footer.columns.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {appName || brandLabel}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
