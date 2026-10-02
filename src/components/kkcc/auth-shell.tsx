import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "./logo";
import { BRAND } from "@/data/kkcc";
import { useUiText } from "./ui-text-provider";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const uiText = useUiText();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink p-12 text-ink-foreground lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark className="h-11" />
          <span className="font-display text-sm font-bold">{BRAND.short}</span>
        </Link>
        <div>
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight">
            {uiText.auth.side_heading}
          </h2>
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">
            {uiText.auth.side_description || BRAND.tagline}
          </p>
        </div>
        <p className="text-xs text-ink-foreground/50">{BRAND.name}</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark className="h-10" />
            <span className="font-display text-sm font-bold">{BRAND.short}</span>
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
