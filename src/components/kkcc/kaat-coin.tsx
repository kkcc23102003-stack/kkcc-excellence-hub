import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-5 w-5 text-[7px]",
  sm: "h-6 w-6 text-[8px]",
  md: "h-8 w-8 text-[10px]",
  lg: "h-11 w-11 text-xs",
  xl: "h-16 w-16 text-sm",
} as const;

type KaatCoinSize = keyof typeof sizeClasses;

export function KaatCoin({ className, size = "md" }: { className?: string; size?: KaatCoinSize }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full align-middle font-black tracking-tight text-[#2d1b00] shadow-[0_0_18px_rgba(245,215,142,0.4),0_0_30px_rgba(24,244,214,0.2)]",
        sizeClasses[size],
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,#7c4a02,#f5d78e,#fff8d6,#18f4d6,#38e8ff,#f5d78e,#7c4a02)]" />
      <span className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_32%_24%,#fff8d6_0%,#f5d78e_26%,#c98718_58%,#5c3500_100%)] shadow-[inset_0_2px_5px_rgba(255,255,255,0.55),inset_0_-4px_8px_rgba(45,27,0,0.38)]" />
      <span className="absolute inset-[18%] rounded-full border border-white/45 bg-[radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.55),transparent_34%)]" />
      <span className="absolute inset-[4%] rounded-full border border-[#fff8d6]/75 opacity-80" />
      <span className="absolute inset-[29%] rounded-full border border-[#2d1b00]/20" />
      <span className="relative -mt-px leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
        K
      </span>
    </span>
  );
}

export function KaatCoinStack({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-block h-12 w-14", className)}>
      <KaatCoin size="lg" className="absolute bottom-0 left-0 rotate-[-10deg]" />
      <KaatCoin size="lg" className="absolute right-0 top-0 rotate-[8deg]" />
    </span>
  );
}
