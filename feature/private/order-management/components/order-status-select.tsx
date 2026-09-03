"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";

export const ORDER_STATUS_OPTIONS = [
  {
    value: 2,
    label: "Processing",
    description: "Order is being processed",
    color: "text-sky-700 bg-sky-50 border-sky-200",
    dot: "bg-sky-500",
  },
  {
    value: 3,
    label: "Partial Order",
    description: "Order partially fulfilled",
    color: "text-violet-700 bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
  },
  {
    value: 5,
    label: "Sent / Delivered",
    description: "Order sent to recipient",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    value: 6,
    label: "Completed",
    description: "Order fully completed & paid",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    value: 7,
    label: "Cancelled",
    description: "Order cancelled — item availability will be disabled",
    color: "text-red-700 bg-red-50 border-red-200",
    dot: "bg-red-500",
    disablesItem: true,
  },
] as const;

const STATUS_DISPLAY: Record<number, { label: string; color: string; dot: string }> = {
  0: {
    label: "Declined",
    color: "text-red-700 bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  1: {
    label: "Pending",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  2: {
    label: "Processing",
    color: "text-sky-700 bg-sky-50 border-sky-200",
    dot: "bg-sky-500",
  },
  3: {
    label: "Partial Order",
    color: "text-violet-700 bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
  },
  5: {
    label: "Sent / Delivered",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  6: {
    label: "Completed",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  7: {
    label: "Cancelled",
    color: "text-red-700 bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  8: {
    label: "Paid",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: number;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const display = STATUS_DISPLAY[currentStatus] ?? STATUS_DISPLAY[1];

  const handleSelect = (value: number) => {
    if (value === currentStatus) {
      setIsOpen(false);
      return;
    }
    updateStatus({ orderId, orderStatus: value });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <button
          disabled={isPending}
          className={cn(
            "inline-flex min-w-32.5 cursor-pointer items-center justify-between gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:opacity-80 focus:ring-2 focus:ring-offset-1 focus:outline-none",
            display.color,
            isPending && "pointer-events-none opacity-70",
          )}
        >
          <span className="flex items-center gap-1.5">
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <span className={cn("size-1.5 rounded-full", display.dot)} />
            )}
            {display.label}
          </span>
          <ChevronDown
            className={cn("size-3 shrink-0 transition-transform", isOpen && "rotate-180")}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 rounded-2xl border-slate-100 p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        {ORDER_STATUS_OPTIONS.map((opt) => {
          const isActive = opt.value === currentStatus;
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => handleSelect(opt.value)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors outline-none hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-800 dark:focus:bg-slate-800",
                isActive && "bg-slate-50 dark:bg-slate-800",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border",
                  opt.color,
                )}
              >
                <span className={cn("size-2 rounded-full", opt.dot)} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300",
                  )}
                >
                  {opt.label}
                  {isActive && (
                    <span className="ml-1.5 text-[10px] font-normal text-slate-400">(current)</span>
                  )}
                </p>
                <p className="truncate text-[10px] text-slate-400">{opt.description}</p>
              </div>
              {"disablesItem" in opt && opt.disablesItem && (
                <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-red-600 uppercase">
                  disables item
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
