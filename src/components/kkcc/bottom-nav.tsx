import { Link } from "@tanstack/react-router";
import { FileText, Gamepad2, Home, Library, PlayCircle, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", to: "/", icon: Home, exact: true, ariaLabel: undefined },
  { label: "Courses", to: "/courses", icon: Library, exact: false, ariaLabel: undefined },
  { label: "Learn", to: "/learn", icon: PlayCircle, exact: false, ariaLabel: undefined },
  {
    label: "Notes",
    to: "/dashboard/materials",
    icon: FileText,
    exact: false,
    ariaLabel: undefined,
  },
  { label: "Tests", to: "/test-series", icon: FileCheck2, exact: false, ariaLabel: undefined },
  { label: "Quiz", to: "/games", icon: Gamepad2, exact: false, ariaLabel: "Kit 2 Coins Quiz" },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary mobile"
      className="glass gpu-stable fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-6">
        {ITEMS.map(({ label, to, icon: Icon, exact, ariaLabel }) => {
          const isQuiz = label === "Quiz";
          return (
            <li key={label}>
              <Link
                to={to}
                activeOptions={{ exact }}
                aria-label={ariaLabel ?? label}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors active:scale-95 data-[status=active]:text-primary",
                  isQuiz && "font-black",
                )}
              >
                {isQuiz ? (
                  <span className="grid h-6 w-6 place-items-center rounded-xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_25%,transparent),color-mix(in_oklab,var(--accent)_20%,transparent))] text-primary shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_22%,transparent)]">
                    <Icon className="h-4 w-4" />
                  </span>
                ) : (
                  <Icon className="h-[18px] w-[18px]" />
                )}
                <span className={cn("truncate", isQuiz && "text-gradient-brand")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
