"use client";

import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { maskOrderReferenceParts } from "../utils/mask-order-reference";

type MaskedReferenceBadgeProps = {
  reference?: string | null;
  className?: string;
  size?: "sm" | "md";
};

/** Employee-facing masked order reference — last 4 visible, rest obscured. */
export function MaskedReferenceBadge({
  reference,
  className,
  size = "sm",
}: MaskedReferenceBadgeProps) {
  const { hidden, visible, empty } = maskOrderReferenceParts(reference);

  if (empty) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200/90 bg-linear-to-r from-slate-50 to-white shadow-sm dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-900",
        size === "sm" ? "px-2.5 py-1.5" : "px-3 py-2",
        className,
      )}
      title="Only the last 4 characters are visible for security"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <Shield className="size-3.5" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Reference</p>
        <p
          className={cn(
            "flex items-baseline gap-0.5 font-mono font-semibold tabular-nums",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {hidden ? (
            <span className="tracking-[0.18em] text-slate-400 select-none dark:text-slate-500">
              {hidden}
            </span>
          ) : null}
          <span className="tracking-wide text-emerald-700 dark:text-emerald-400">{visible}</span>
        </p>
      </div>
    </div>
  );
}
