"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
  Play,
  Undo2,
} from "lucide-react";

type ActionVariant = "start" | "complete" | "close" | "abandon";

interface OrderLifecycleActionCardProps {
  variant: ActionVariant;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<
  ActionVariant,
  {
    wrap: string;
    iconWrap: string;
    title: string;
    btn: string;
    Icon: typeof Play;
  }
> = {
  start: {
    wrap: "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-white",
    iconWrap: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-950",
    btn: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20",
    Icon: Play,
  },
  complete: {
    wrap: "border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-white",
    iconWrap: "bg-teal-100 text-teal-700",
    title: "text-teal-950",
    btn: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20",
    Icon: CheckCircle2,
  },
  close: {
    wrap: "border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-white to-white ring-1 ring-emerald-100",
    iconWrap: "bg-emerald-600 text-white shadow-md shadow-emerald-600/25",
    title: "text-emerald-950",
    btn: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25",
    Icon: PackageCheck,
  },
  abandon: {
    wrap: "border-red-200/90 bg-gradient-to-br from-red-50 via-orange-50/40 to-white",
    iconWrap: "bg-red-100 text-red-700",
    title: "text-red-950",
    btn: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    Icon: Undo2,
  },
};

export function OrderLifecycleActionCard({
  variant,
  title,
  description,
  onClick,
  disabled,
  loading,
  className,
}: OrderLifecycleActionCardProps) {
  const style = VARIANT_STYLES[variant];
  const Icon = style.Icon;

  return (
    <div
      className={cn("overflow-hidden rounded-2xl border p-3.5 shadow-xs", style.wrap, className)}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            style.iconWrap,
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-bold tracking-tight", style.title)}>{title}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        className={cn(
          "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60",
          style.btn,
        )}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
        {title}
      </button>
    </div>
  );
}

export function OrderLifecycleActionsHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
      <span>{children}</span>
    </div>
  );
}

export function OrderWaitingBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
      <Clock3 className="size-3" />
      {label}
    </div>
  );
}
