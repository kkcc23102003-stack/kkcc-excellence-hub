import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Sparkles,
  ClipboardList,
  FileText,
  Database,
  BrainCircuit,
  Users,
  KeyRound,
  HelpCircle,
  MessageSquarePlus,
  Bell,
  CreditCard,
  TicketPercent,
  Gift,
  ShieldAlert,
  Palette,
  LayoutTemplate,
  Type,
  Code2,
  Share2,
  HardDrive,
  ShieldCheck,
  Search,
  Compass,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AdminCategory =
  "All" | "Courses & Content" | "Students & Access" | "Payments & Rewards" | "Website & System";

type AdminToolItem = {
  to: string;
  label: string;
  hint: string;
  category: Exclude<AdminCategory, "All">;
  icon: typeof BookOpen;
  badge?: string;
};

export const ADMIN_TOOLS: AdminToolItem[] = [
  {
    to: "/admin",
    label: "Course Manager",
    hint: "Create, edit & publish courses, lectures and chapters",
    category: "Courses & Content",
    icon: BookOpen,
  },
  {
    to: "/admin/syllabus",
    label: "Syllabus Auto Builder",
    hint: "Paste syllabus → Subject, Chapter & Topic tree + 1-click tests",
    category: "Courses & Content",
    icon: Sparkles,
    badge: "New",
  },
  {
    to: "/admin/tests",
    label: "Test Builder & Questions",
    hint: "Write MCQs, set timers, syllabus tags & chapterwise tests",
    category: "Courses & Content",
    icon: ClipboardList,
  },
  {
    to: "/admin/materials",
    label: "Study Material & Notes",
    hint: "Upload PDFs or link Google Drive notes, PYQs & formula sheets",
    category: "Courses & Content",
    icon: FileText,
  },
  {
    to: "/admin/exam-bank",
    label: "Exam Bank & Syllabus",
    hint: "Inspect built-in exam templates, subjects & chapter coverage",
    category: "Courses & Content",
    icon: Database,
  },
  {
    to: "/admin/ai-question-engine",
    label: "AI Question Engine",
    hint: "Research & verify high-yield practice questions",
    category: "Courses & Content",
    icon: BrainCircuit,
  },
  {
    to: "/admin/students",
    label: "Student Access",
    hint: "Grant or revoke course, test & series access, or block accounts",
    category: "Students & Access",
    icon: Users,
  },
  {
    to: "/admin/offline-access",
    label: "Offline Access",
    hint: "Pre-activate access by student Gmail after UPI/cash payment",
    category: "Students & Access",
    icon: KeyRound,
  },
  {
    to: "/admin/doubts",
    label: "Doubts Inbox",
    hint: "Read student subject doubts and send direct answers",
    category: "Students & Access",
    icon: HelpCircle,
  },
  {
    to: "/admin/enquiries",
    label: "Admission Enquiries",
    hint: "Lead CRM for website enquiries, coin requests & follow-ups",
    category: "Students & Access",
    icon: MessageSquarePlus,
  },
  {
    to: "/admin/notifications",
    label: "Notifications",
    hint: "Broadcast announcements or send personal alerts to students",
    category: "Students & Access",
    icon: Bell,
  },
  {
    to: "/admin/payments",
    label: "Payments & Razorpay",
    hint: "Switch between offline UPI/Cash mode and live Razorpay checkout",
    category: "Payments & Rewards",
    icon: CreditCard,
  },
  {
    to: "/admin/coupons",
    label: "Coupons & Discounts",
    hint: "Create promo codes up to 100% off with usage & expiry limits",
    category: "Payments & Rewards",
    icon: TicketPercent,
  },
  {
    to: "/admin/vouchers",
    label: "Amazon / Flipkart Rewards",
    hint: "Manage monthly Kit 2 Coins reward vouchers & student claims",
    category: "Payments & Rewards",
    icon: Gift,
  },
  {
    to: "/admin/users",
    label: "Admin Team Users",
    hint: "Grant or remove admin privileges for trusted KKCC staff",
    category: "Payments & Rewards",
    icon: ShieldAlert,
  },
  {
    to: "/admin/branding",
    label: "Branding & Theme",
    hint: "Customize app name, logo, hero highlights & color palette",
    category: "Website & System",
    icon: Palette,
  },
  {
    to: "/admin/content",
    label: "Website Content",
    hint: "Edit navigation menus, page headers, contact info & custom blocks",
    category: "Website & System",
    icon: LayoutTemplate,
  },
  {
    to: "/admin/text-manager",
    label: "Hybrid Text Manager",
    hint: "Safely override student-facing labels and dashboard copy",
    category: "Website & System",
    icon: Type,
  },
  {
    to: "/admin/app-builder",
    label: "App Builder (HTML/CSS/JS)",
    hint: "Inject live custom HTML sections, CSS styles or JS scripts",
    category: "Website & System",
    icon: Code2,
  },
  {
    to: "/admin/settings",
    label: "Social & App Links",
    hint: "Manage YouTube, Telegram, WhatsApp, Instagram & footer links",
    category: "Website & System",
    icon: Share2,
  },
  {
    to: "/admin/storage",
    label: "Storage Provider",
    hint: "Configure Supabase Storage, Cloudflare R2, AWS S3 or Backblaze B2",
    category: "Website & System",
    icon: HardDrive,
  },
  {
    to: "/admin/security",
    label: "Security & App Controls",
    hint: "Content protection, feature switches, Kit 2 Coins caps & health",
    category: "Website & System",
    icon: ShieldCheck,
  },
];

const CATEGORIES: AdminCategory[] = [
  "All",
  "Courses & Content",
  "Students & Access",
  "Payments & Rewards",
  "Website & System",
];

export function AdminCommandBar({ compact = false }: { compact?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [category, setCategory] = useState<AdminCategory>("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(!compact);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADMIN_TOOLS.filter((tool) => {
      if (category !== "All" && tool.category !== category) return false;
      if (!q) return true;
      return (
        tool.label.toLowerCase().includes(q) ||
        tool.hint.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    });
  }, [category, search]);

  return (
    <div className="surface-panel mb-6 p-4 sm:p-5" data-testid="admin-command-bar">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">KKCC Admin Command Center</h2>
              <Badge variant="secondary" className="rounded-full text-[10px]">
                {ADMIN_TOOLS.length} Modules
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Jump to any course, syllabus, test, student, payment or website control in one click.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!expanded) setExpanded(true);
              }}
              placeholder="Search admin tools..."
              className="h-9 rounded-full pl-8 text-xs"
            />
          </div>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:border-primary/50 hover:text-primary"
            >
              {expanded ? "Compact view" : "Show all 22 tools"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              if (!expanded) setExpanded(true);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              category === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {expanded ? (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => {
            const Icon = tool.icon;
            const isActive =
              tool.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(tool.to);
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={cn(
                  "group flex items-start gap-3 rounded-2xl border p-3 transition-all",
                  isActive
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "bg-background/60 hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {tool.label}
                    </span>
                    {tool.badge && (
                      <Badge className="h-4 rounded-full px-1.5 text-[9px]">{tool.badge}</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    {tool.hint}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filtered.map((tool) => {
            const isActive =
              tool.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(tool.to);
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background/70 text-foreground hover:border-primary/50 hover:text-primary",
                )}
              >
                <tool.icon className="h-3.5 w-3.5" />
                {tool.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
