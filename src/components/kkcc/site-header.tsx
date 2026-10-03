import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useAuthUser } from "@/hooks/use-auth-user";
import { displayNameFromUser } from "@/lib/auth";
import { getMy23KaatWallet } from "@/lib/coins.functions";
import { cn } from "@/lib/utils";
import { KaatCoin } from "./kaat-coin";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useWebsiteContent } from "./website-content-provider";

const LazyGlobalSearch = lazy(() =>
  import("./global-search").then((module) => ({ default: module.GlobalSearch })),
);
import { is23KaatUnlimited } from "@/lib/coin-display";

const preloadGlobalSearch = () => void import("./global-search");

function format23KaatBalance(balance: number | null) {
  if (balance === null) return "—";
  // Admins read as unlimited, which the database expresses as a very large
  // number. Showing "2B" in the header would be nonsense.
  if (is23KaatUnlimited(balance)) return "∞";
  return new Intl.NumberFormat("en-IN", {
    notation: balance >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(balance);
}

function Header23KaatWallet({
  authed,
  userId,
  onNavigate,
}: {
  authed: boolean;
  userId: string | undefined;
  onNavigate?: () => void;
}) {
  const qc = useQueryClient();
  const { data: balance = null } = useQuery<number | null>({
    queryKey: ["my-23kaat-wallet-balance", userId],
    enabled: Boolean(authed && userId),
    staleTime: 2 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 0,
    queryFn: async () => {
      try {
        const wallet = await getMy23KaatWallet();
        return wallet.balance;
      } catch {
        return null;
      }
    },
  });

  useEffect(() => {
    if (!authed || !userId) return;
    const onRefresh = () => {
      void qc.invalidateQueries({ queryKey: ["my-23kaat-wallet-balance", userId] });
    };
    window.addEventListener("kkcc:23kaat-refresh", onRefresh);
    return () => {
      window.removeEventListener("kkcc:23kaat-refresh", onRefresh);
    };
  }, [authed, userId, qc]);

  return (
    <Link
      to={authed ? "/coins" : "/login"}
      onClick={onNavigate}
      className="group relative inline-flex h-9 shrink-0 items-center overflow-hidden rounded-full border border-primary/25 bg-card/75 px-2.5 text-xs font-black text-foreground shadow-soft transition hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={
        authed ? `${format23KaatBalance(balance)} 23KAAT balance` : "Login to view 23KAAT balance"
      }
      title={authed ? `${format23KaatBalance(balance)} 23KAAT` : "23KAAT wallet"}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(24,244,214,0.22),transparent_34%),linear-gradient(135deg,rgba(56,232,255,0.13),rgba(245,215,142,0.1))] opacity-80 transition group-hover:opacity-100" />
      <span className="relative flex items-center gap-1.5">
        <KaatCoin size="sm" />
        <span className="leading-none">
          <span className="block text-sm font-black text-gradient-brand neon-text">
            {authed ? format23KaatBalance(balance) : "Wallet"}
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
            coins
          </span>
        </span>
      </span>
    </Link>
  );
}

const NAV_ITEMS = [
  { key: "home", to: "/" },
  { key: "courses", to: "/courses" },
  { key: "classes", to: "/classes" },
  { key: "test_series", to: "/test-series" },
  { key: "study_material", to: "/study-material" },
  { key: "faculty", to: "/faculty" },
  { key: "results", to: "/results" },
  { key: "support", to: "/support" },
] as const;

export function SiteHeader() {
  const content = useWebsiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { configured, user, setUser } = useAuthUser();

  const scrolledRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrolled = () => {
      scrollRafRef.current = null;
      const nextScrolled = window.scrollY > 12;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    };

    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRafRef.current !== null) window.cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        preloadGlobalSearch();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const signOut = async () => {
    if (!configured) return;
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    window.location.assign("/login");
  };

  const authed = !!user;
  const { isAdmin } = useAdminStatus(user);
  const name = displayNameFromUser(user);

  return (
    <>
      <header
        className={cn(
          "gpu-stable sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled ? "glass border-border shadow-soft" : "border-transparent bg-background",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center gap-4 px-4 transition-all duration-300 sm:px-6",
            scrolled ? "h-14" : "h-[72px]",
          )}
        >
          <Logo compact={scrolled} className="shrink-0" />

          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
              >
                {content.nav[item.key]}
              </Link>
            ))}
            <Link
              to="/games"
              aria-label="Open Kit 2 Coins Quiz Zone"
              title="Play Kit 2 Coins Quiz now"
              className="group relative ml-1 inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full border border-primary/25 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_15%,transparent),color-mix(in_oklab,var(--accent)_10%,transparent))] px-3 text-sm font-black text-foreground shadow-[0_0_22px_color-mix(in_oklab,var(--primary)_16%,transparent)] transition-all hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_25%,transparent)] data-[status=active]:border-primary data-[status=active]:bg-primary/15"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
              <Gamepad2 className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <span className="text-gradient-brand">Kit 2 Quiz</span>
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-primary">
                Play
              </span>
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <div className="flex items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1 shadow-soft">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Search"
                className="h-9 rounded-full px-2.5"
                onMouseEnter={preloadGlobalSearch}
                onFocus={preloadGlobalSearch}
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden text-xs font-semibold text-muted-foreground xl:inline">
                  Search
                </span>
              </Button>
              <Header23KaatWallet authed={authed} userId={user?.id} />
            </div>
            <ThemeToggle className="hidden sm:inline-flex" />
            {authed ? (
              <>
                {isAdmin && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="hidden rounded-full lg:inline-flex"
                  >
                    <Link to="/admin">
                      <ShieldCheck className="mr-1.5 h-4 w-4" /> {content.nav.admin}
                    </Link>
                  </Button>
                )}
                <Button asChild size="sm" className="hidden rounded-full lg:inline-flex">
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-1.5 h-4 w-4" /> {content.nav.dashboard}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:inline-flex"
                  onClick={signOut}
                >
                  <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
                  <Link to="/login">{content.nav.login}</Link>
                </Button>
                <Button asChild size="sm" className="hidden rounded-full lg:inline-flex">
                  <Link to="/signup">{content.nav.signup}</Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-[86vw] max-w-sm flex-col border-l bg-background shadow-lift">
            <div className="flex items-start justify-between gap-3 border-b p-4">
              <div className="min-w-0">
                <Logo />
                {authed && (
                  <div className="mt-4 space-y-3 rounded-xl bg-muted/70 p-3">
                    <div>
                      <p className="truncate text-sm font-semibold">{name}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Header23KaatWallet
                      authed={authed}
                      userId={user?.id}
                      onNavigate={() => setMenuOpen(false)}
                    />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
              <Link
                to="/games"
                onClick={() => setMenuOpen(false)}
                aria-label="Open Kit 2 Coins Quiz Zone"
                className="relative mb-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--accent)_12%,transparent))] px-4 py-3 shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_14%,transparent)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_20%,transparent)]">
                  <Gamepad2 className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-gradient-brand">
                    Kit 2 Coins Quiz
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    60-second MCQs, rewards and weekly vouchers
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center rounded-full bg-primary/15 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="mr-1 h-3 w-3" /> Play
                </span>
              </Link>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex items-center rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
                >
                  {content.nav[item.key]}
                </Link>
              ))}

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted"
              >
                <LayoutDashboard className="h-4 w-4" /> {content.nav.dashboard}
              </Link>
              {authed && (
                <>
                  <Link
                    to="/dashboard/student"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted"
                  >
                    <Sparkles className="h-4 w-4" /> My Test Series & Validity
                  </Link>
                  <Link
                    to="/dashboard/courses"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4" /> My Courses
                  </Link>
                  <Link
                    to="/dashboard/student"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-muted"
                  >
                    <ShieldCheck className="h-4 w-4" /> Student Section
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-[15px] font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  <ShieldCheck className="h-4 w-4" /> {content.nav.admin}
                </Link>
              )}
            </nav>
            <div className="space-y-2 border-t p-4">
              <div className="flex items-center justify-between rounded-xl border px-4 py-2">
                <span className="text-sm text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              {authed ? (
                <Button variant="outline" className="w-full" onClick={signOut}>
                  <LogOut className="mr-1.5 h-4 w-4" /> Sign out
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      {content.nav.login}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      {content.nav.signup}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {searchOpen && (
        <Suspense fallback={null}>
          <LazyGlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      )}
    </>
  );
}
