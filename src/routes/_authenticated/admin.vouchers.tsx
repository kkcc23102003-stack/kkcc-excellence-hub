import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Gift, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { adminListRewardVouchers, adminSaveRewardVoucher } from "@/lib/vouchers.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/_authenticated/admin/vouchers")({
  component: AdminVouchersPage,
});

function AdminVouchersPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListRewardVouchers);
  const save = useServerFn(adminSaveRewardVoucher);
  const query = useQuery({
    queryKey: ["admin", "reward-vouchers"],
    queryFn: () => safeServerCall(() => list(), []),
  });
  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof adminSaveRewardVoucher>[0]) => save(data),
    onSuccess: () => {
      toast.success("Reward option saved");
      void qc.invalidateQueries({ queryKey: ["admin", "reward-vouchers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Flipkart & Amazon reward cards"
        description="Manage the reward options shown after the monthly Kit 2 Coins target. This controls availability and daily quota; voucher fulfilment remains a centre-side process."
      />
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap justify-end gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin">Back to admin</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/exam-bank">Exam bank</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(query.data ?? []).map((item) => (
            <VoucherEditor
              key={item.id}
              item={item}
              onSave={(next) => mutation.mutate({ data: next } as never)}
              saving={mutation.isPending}
            />
          ))}
        </div>
        {!query.isLoading && !(query.data ?? []).length && (
          <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
            Reward types are not installed yet. Apply the reward-vouchers Supabase migration first.
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function VoucherEditor({
  item,
  onSave,
  saving,
}: {
  item: {
    id: string;
    label: string;
    value_inr: number;
    daily_quota: number | null;
    is_active: boolean;
    sort_order: number;
  };
  onSave: (data: {
    id: string;
    label: string;
    value_inr: number;
    daily_quota: number | null;
    is_active: boolean;
    sort_order: number;
  }) => void;
  saving: boolean;
}) {
  const [label, setLabel] = useState(item.label);
  const [value, setValue] = useState(String(item.value_inr));
  const [quota, setQuota] = useState(item.daily_quota == null ? "" : String(item.daily_quota));
  const [active, setActive] = useState(item.is_active);
  const [order, setOrder] = useState(String(item.sort_order));
  return (
    <article className="surface-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Gift className="h-5 w-5" />
        </span>
        <Badge variant={active ? "default" : "secondary"} className="rounded-full">
          {item.id}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3">
        <label className="text-xs font-bold text-muted-foreground">
          Label
          <Input value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-bold text-muted-foreground">
            Value ₹
            <Input
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="text-xs font-bold text-muted-foreground">
            Daily quota
            <Input
              inputMode="numeric"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              placeholder="Unlimited"
              className="mt-1"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-bold text-muted-foreground">
            Sort order
            <Input
              inputMode="numeric"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="mt-1"
            />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm font-semibold">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />{" "}
            Active
          </label>
        </div>
        <Button
          disabled={saving}
          className="rounded-full"
          onClick={() =>
            onSave({
              id: item.id,
              label: label.trim(),
              value_inr: Number(value) || 0,
              daily_quota: quota.trim() === "" ? null : Number(quota),
              is_active: active,
              sort_order: Number(order) || 0,
            })
          }
        >
          {saving ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-4 w-4" />
          )}{" "}
          Save reward option
        </Button>
      </div>
    </article>
  );
}
