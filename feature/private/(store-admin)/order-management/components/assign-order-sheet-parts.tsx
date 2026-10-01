"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Employee } from "@/feature/private/(store-admin)/employee-management/types/employee-management";
import { getInitials } from "@/lib/get-initials";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { OrderData } from "../types/order.types";
import { ORDER_STATUS } from "../utils/order-workflow";

export function AssignOrderSummary({ order }: { order: OrderData }) {
  const itemCount =
    order?.items?.reduce((s, i) => s + (i.quantity || 0), 0) || order?.items?.length || 0;
  const ref = order?.refrenceNumber || order?.id?.substring(0, 8).toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-semibold">#{ref}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          Paid
        </span>
      </div>
      <p className="mt-2 font-medium text-slate-900 dark:text-white">
        {order.recieverName || order.userName || "Customer"}
      </p>
      <p className="text-xs text-slate-500">
        {order.storeName || "Store"} · {itemCount} items · {order.price || "—"}
      </p>
    </div>
  );
}

interface AssignEmployeeListProps {
  employees: Employee[] | undefined;
  isLoading: boolean;
  busyCountByEmployee: Map<string, number>;
  selectedEmployeeId: string | null;
  onSelect: (id: string) => void;
}

export function AssignEmployeeList({
  employees,
  isLoading,
  busyCountByEmployee,
  selectedEmployeeId,
  onSelect,
}: AssignEmployeeListProps) {
  return (
    <ScrollArea className="h-[min(50vh,360px)] rounded-xl border border-slate-200 p-2 dark:border-slate-800">
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="space-y-1.5 px-1">
          {(employees || []).map((emp) => {
            const name = `${emp.firstName} ${emp.lastName}`.trim();
            const busy = busyCountByEmployee.get(emp.id) || 0;
            const selected = selectedEmployeeId === emp.id;
            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => onSelect(emp.id)}
                className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-transparent bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-emerald-500" : "border-slate-300"
                  }`}
                >
                  {selected && <span className="size-2 rounded-full bg-emerald-500" />}
                </span>
                {emp.image ? (
                  <Image
                    src={emp.image}
                    height={40}
                    width={40}
                    alt=""
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {getInitials(name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span
                      className={`size-1.5 rounded-full ${
                        busy > 0 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                    {busy > 0
                      ? `Busy — ${busy} order${busy === 1 ? "" : "s"} in progress`
                      : "Available"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
}

interface AssignSubmitButtonProps {
  order: OrderData | null;
  selectedEmployeeId: string | null;
  isPending: boolean;
  onClick: () => void;
}

export function AssignSubmitButton({
  order,
  selectedEmployeeId,
  isPending,
  onClick,
}: AssignSubmitButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={!selectedEmployeeId || isPending || order?.orderStatus !== ORDER_STATUS.PAID}
      className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Assigning…
        </>
      ) : (
        "Assign to Employee"
      )}
    </Button>
  );
}
