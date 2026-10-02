import defaultLogo from "@/assets/kkcc-logo.jpg.asset.json";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useBranding } from "./branding-provider";

export function LogoMark({ className }: { className?: string }) {
  const branding = useBranding();
  const src = branding.logo_url.trim() || defaultLogo.url;
  const alt = branding.logo_alt.trim() || `${branding.short_name || "KKCC"} logo`;

  return (
    <img
      src={src}
      alt={alt}
      width={512}
      height={512}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className={cn(
        "h-10 w-auto rounded-xl object-contain shadow-[0_0_22px_color-mix(in_oklab,var(--accent)_35%,transparent)] ring-1 ring-primary/25",
        className,
      )}
    />
  );
}

export function Logo({
  className,
  showText = true,
  compact = false,
}: {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}) {
  const branding = useBranding();
  const appName = branding.app_name.trim();
  const shortName = branding.short_name.trim();
  const shouldShowText = showText && branding.show_logo_text && (appName || shortName);
  const label = [shortName, appName].filter(Boolean).join(" — ") || "Home";

  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label={label}>
      <LogoMark className={compact ? "h-8" : "h-10"} />
      {shouldShowText && (
        <span className="flex min-w-0 flex-col leading-tight">
          {shortName && (
            <span className="font-display text-sm font-black tracking-tight text-gradient-brand neon-text">
              {shortName}
            </span>
          )}
          {appName && (
            <span className="truncate text-[11px] font-medium text-muted-foreground group-hover:text-accent">
              {appName}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
