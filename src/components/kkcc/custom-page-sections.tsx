import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWebsiteContent } from "./website-content-provider";
import type { CustomPageKey } from "@/lib/website-content.functions";

type CustomBlock = ReturnType<typeof useWebsiteContent>["custom_blocks"][number];

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function CustomBlockButton({ block }: { block: CustomBlock }) {
  const to = block.button_to.trim();
  const label = block.button_label.trim();
  if (!to || !label) return null;

  if (isExternalUrl(to)) {
    return (
      <Button asChild className="mt-5 rounded-full">
        <a href={to} target="_blank" rel="noopener noreferrer">
          {label} <ArrowRight className="ml-1.5 h-4 w-4" />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild className="mt-5 rounded-full">
      <Link to={to}>
        {label} <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </Button>
  );
}

function CustomBlockCard({ block }: { block: CustomBlock }) {
  const isBanner = block.style === "banner";
  const isNotice = block.style === "notice";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border bg-card shadow-sm",
        isBanner && "bg-ink text-ink-foreground",
        isNotice && "border-primary/30 bg-primary/5",
      )}
    >
      {block.image_url.trim() && (
        <img
          src={block.image_url.trim()}
          alt=""
          className="h-48 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className={cn("p-6", isBanner && "sm:p-8")}>
        {block.eyebrow.trim() && (
          <p
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary",
              isBanner && "text-ink-foreground/70",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" /> {block.eyebrow.trim()}
          </p>
        )}
        {block.title.trim() && (
          <h2 className={cn("mt-3 text-xl font-bold sm:text-2xl", isBanner && "sm:text-3xl")}>
            {block.title.trim()}
          </h2>
        )}
        {block.description.trim() && (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed text-muted-foreground",
              isBanner && "text-ink-foreground/75",
            )}
          >
            {block.description.trim()}
          </p>
        )}
        {block.body.trim() && (
          <p
            className={cn(
              "mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
              isBanner && "text-ink-foreground/75",
            )}
          >
            {block.body.trim()}
          </p>
        )}
        <CustomBlockButton block={block} />
      </div>
    </article>
  );
}

export function CustomPageSections({
  page,
  position = "bottom",
}: {
  page: CustomPageKey;
  position?: "top" | "bottom";
}) {
  const content = useWebsiteContent();
  const blocks = content.custom_blocks
    .filter((block) => block.enabled && block.page === page && block.position === position)
    .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));

  if (blocks.length === 0) return null;

  const hasBanner = blocks.some((block) => block.style === "banner");

  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className={cn("grid gap-5", !hasBanner && "md:grid-cols-2")}>
        {blocks.map((block) => (
          <CustomBlockCard key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}
