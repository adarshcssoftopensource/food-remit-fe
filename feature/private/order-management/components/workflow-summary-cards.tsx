"use client";

import { CheckCircle2, Clock3, Package, RefreshCw } from "lucide-react";
import { WorkflowCounts } from "../hooks/use-workflow-counts";
import { OrderSectionKey } from "@/constants/order-management";
import { cn } from "@/lib/utils";

interface WorkflowSummaryCardsProps {
  counts?: WorkflowCounts;
  activeTab: OrderSectionKey;
  onSelect: (tab: OrderSectionKey) => void;
}

const CARDS: {
  key: OrderSectionKey;
  label: string;
  description: string;
  icon: typeof Package;
  countKey: keyof WorkflowCounts;
  accent: string;
  iconBg: string;
}[] = [
  {
    key: "all",
    label: "Total Orders",
    description: "All active store orders",
    icon: Package,
    countKey: "all",
    accent: "text-slate-700",
    iconBg: "bg-slate-100 text-slate-600",
  },
  {
    key: "pending",
    label: "Pending",
    description: "Ready to be started",
    icon: Clock3,
    countKey: "pending",
    accent: "text-amber-700",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    key: "processing",
    label: "Processing",
    description: "Being prepared by employees",
    icon: RefreshCw,
    countKey: "processing",
    accent: "text-blue-700",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    key: "completed",
    label: "Picked Up",
    description: "Waiting for Close or Abandon",
    icon: CheckCircle2,
    countKey: "completed",
    accent: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
];

export function WorkflowSummaryCards({ counts, activeTab, onSelect }: WorkflowSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.key;
        const value = counts?.[card.countKey] ?? 0;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            className={cn(
              "rounded-2xl border bg-white p-4 text-left shadow-xs transition-all dark:bg-slate-900",
              isActive
                ? "border-emerald-400 ring-2 ring-emerald-500/20"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-800",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {card.label}
                </p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", card.accent)}>{value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.description}</p>
              </div>
              <div className={cn("rounded-xl p-2.5", card.iconBg)}>
                <Icon className="size-5" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
