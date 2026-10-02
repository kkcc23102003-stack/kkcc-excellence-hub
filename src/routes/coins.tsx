import { createFileRoute, Link } from "@tanstack/react-router";
import { format23Kaat, is23KaatUnlimited } from "@/lib/coin-display";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { KaatCoin, KaatCoinStack } from "@/components/kkcc/kaat-coin";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { CONVERSION_SENTENCE, RUPEES_PER_23KAAT } from "@/lib/coin-conversion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthUser } from "@/hooks/use-auth-user";
import { displayNameFromUser } from "@/lib/auth";
import { getMy23KaatWallet, list23KaatCoinPackages } from "@/lib/coins.functions";
import { submitAdmissionEnquiry } from "@/lib/enquiries.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/coins")({
  head: () => ({
    meta: [
      { title: "Buy 23KAAT Coins — KKCC" },
      {
        name: "description",
        content:
          "Buy 23KAAT coin packs separately and use coins for eligible KKCC courses, batches and paid notes.",
      },
      { property: "og:title", content: "Buy 23KAAT Coins — KKCC" },
      {
        property: "og:description",
        content: "Choose a 23KAAT pack and request coin credit for your KKCC account.",
      },
    ],
  }),
  loader: async () => {
    const [packages, wallet] = await Promise.all([
      safeServerCall(() => list23KaatCoinPackages(), []),
      safeServerCall(() => getMy23KaatWallet(), { balance: 0, transactions: [], packages: [] }),
    ]);
    return { packages, wallet };
  },
  component: CoinsPage,
});

function CoinsPage() {
  return (
    <SiteLayout>
      <CoinsPageContent />
    </SiteLayout>
  );
}

function CoinsPageContent() {
  const { packages, wallet } = Route.useLoaderData();
  const { user } = useAuthUser();
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);

  const requestMutation = useMutation({
    mutationFn: (pack: (typeof packages)[number]) => {
      if (!user?.email) throw new Error("Please login first to request 23KAAT coins.");
      const totalCoins = pack.coins + pack.bonus_coins;
      return sendEnquiry({
        data: {
          name: displayNameFromUser(user) || user.email,
          email: user.email,
          phone: "",
          class_level: "",
          interest: `${pack.title} — ${totalCoins} 23KAAT`,
          source: "23kaat_coin_pack",
          message: `I want to buy the ${pack.title}: ${totalCoins} 23KAAT coins for ₹${pack.price}. Please share payment steps and credit coins to my KKCC account after payment.`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Coin pack request sent", {
        description: "The KKCC team will confirm payment and credit 23KAAT coins to your account.",
      });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <>
      <section className="relative overflow-hidden border-b bg-surface">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <Badge className="rounded-full border-primary/30 bg-primary/10 text-primary">
              <KaatCoin size="xs" className="mr-1.5" /> 23KAAT Wallet
            </Badge>
            <h1 className="neon-text mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Buy coins once. Use them across KKCC.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Students can buy 23KAAT separately and use coins for eligible paid courses, batches
              and standalone notes. Special coin-price offers may also appear from time to time.
            </p>
            <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary">
              <KaatCoin size="xs" /> 1 23KAAT = ₹{RUPEES_PER_23KAAT}
              <span className="font-semibold text-muted-foreground">
                · earn them free in the quiz: {CONVERSION_SENTENCE}
              </span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to="/courses">
                  Browse courses <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/study-material">Browse notes</Link>
              </Button>
            </div>
          </div>

          <div className="surface-panel relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 opacity-70">
              <KaatCoinStack className="scale-150" />
            </div>
            <p className="relative text-sm text-muted-foreground">Current balance</p>
            <p className="relative mt-2 text-5xl font-black text-gradient-brand neon-text">
              {format23Kaat(wallet.balance)}
            </p>
            <p className="relative mt-1 font-semibold">
              23KAAT coins
              {is23KaatUnlimited(wallet.balance)
                ? " · admin account"
                : ` · worth ₹${wallet.balance * RUPEES_PER_23KAAT}`}
            </p>
            <div className="relative mt-5 rounded-2xl border bg-background/65 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
              Coin balance is server-side. Students cannot edit it from browser/dev tools.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Coin packs
            </p>
            <h2 className="mt-2 text-2xl font-bold">Buy 23KAAT without selecting a course</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a pack, send a request, complete the guided payment, and coins will be credited
              to your wallet.
            </p>
          </div>
          {!user && (
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/login" search={{ redirectTo: "/coins" }}>
                Login to request coins
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {packages.map((pack) => {
            const totalCoins = pack.coins + pack.bonus_coins;
            const loading = requestMutation.isPending;
            return (
              <article key={pack.id} className="surface-panel relative overflow-hidden p-5">
                <div className="pointer-events-none absolute -right-5 -top-5 opacity-45">
                  <KaatCoin size="xl" />
                </div>
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{pack.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{pack.description}</p>
                  </div>
                  {pack.bonus_coins > 0 && (
                    <Badge className="rounded-full">+{pack.bonus_coins} bonus</Badge>
                  )}
                </div>
                <p className="relative mt-5 flex items-center gap-2 text-3xl font-black text-primary">
                  <KaatCoin size="md" /> {totalCoins}
                </p>
                <p className="relative mt-1 text-sm text-muted-foreground">
                  coins for ₹{pack.price}
                </p>
                {user ? (
                  <Button
                    className="relative mt-5 w-full rounded-full"
                    disabled={loading}
                    onClick={() => requestMutation.mutate(pack)}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Request this pack
                  </Button>
                ) : (
                  <Button asChild className="relative mt-5 w-full rounded-full">
                    <Link to="/login" search={{ redirectTo: "/coins" }}>
                      Login to buy
                    </Link>
                  </Button>
                )}
              </article>
            );
          })}
        </div>

        {!packages.length && (
          <div className="surface-panel mt-7 p-8 text-center text-sm text-muted-foreground">
            Coin packs will appear after the 23KAAT SQL migration is run in Supabase.
          </div>
        )}
      </section>
    </>
  );
}
