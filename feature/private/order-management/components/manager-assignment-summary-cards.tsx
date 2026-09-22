"use client";

import { CheckCircle2, Clock3, UserCheck, Users } from "lucide-react";
import { WorkflowCounts } from "../hooks/use-workflow-counts";
import { OrderSectionKey } from "@/constants/order-management";
import { cn } from "@/lib/utils";

interface ManagerAssignmentSummaryCardsProps {
  counts?: WorkflowCounts;
  activeTab: OrderSectionKey;
  onSelect: (tab: OrderSectionKey) => void;
}

export function ManagerAssignmentSummaryCards({
  counts,
  activeTab,
  onSelect,
}: ManagerAssignmentSummaryCardsProps) {
  const cards = [
    {
      key: "pending" as const,
      label: "Unassigned Orders",
      description: "Waiting to be assigned",
      value: counts?.unassigned ?? counts?.pending ?? 0,
      icon: Clock3,
      accent: "text-amber-700",
      iconBg: "bg-amber-50 text-amber-600",
      selectable: true,
    },
    {
      key: "processing" as const,
      label: "Assigned Orders",
      description: "Currently being prepared",
      value: counts?.assigned ?? counts?.processing ?? 0,
      icon: CheckCircle2,
      accent: "text-blue-700",
      iconBg: "bg-blue-50 text-blue-600",
      selectable: true,
    },
    {
      key: null,
      label: "Available Employees",
      description: "No active Processing orders",
      value: counts?.availableEmployees ?? 0,
      icon: UserCheck,
      accent: "text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600",
      selectable: false,
    },
    {
      key: null,
      label: "Busy Employees",
      description: "Have 1+ Processing orders",
      value: counts?.busyEmployees ?? 0,
      icon: Users,
      accent: "text-orange-700",
      iconBg: "bg-orange-50 text-orange-600",
      selectable: false,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = card.key !== null && activeTab === card.key;
        const content = (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {card.label}
                </p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", card.accent)}>
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{card.description}</p>
              </div>
              <div className={cn("rounded-xl p-2.5", card.iconBg)}>
                <Icon className="size-5" />
              </div>
            </div>
          </>
        );

        if (card.selectable && card.key) {
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onSelect(card.key!)}
              className={cn(
                "rounded-2xl border bg-white p-4 text-left shadow-xs transition-all dark:bg-slate-900",
                isActive
                  ? "border-emerald-400 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800",
              )}
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
