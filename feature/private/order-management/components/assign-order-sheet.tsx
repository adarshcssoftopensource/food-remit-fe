"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetEmployees } from "@/feature/private/employee-management/hooks/use-get-employees";
import { useAssignOrder } from "@/feature/private/employee-management/hooks/use-assign-order";
import { getInitials } from "@/lib/get-initials";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { OrderData } from "../types/order.types";
import { useGetOrders } from "../hooks/use-get-orders";
import { ORDER_STATUS } from "../utils/order-workflow";
import Image from "next/image";

interface AssignOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData | null;
}

export function AssignOrderSheet({ open, onOpenChange, order }: AssignOrderSheetProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const { data: employees, isLoading } = useGetEmployees({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  // Busy = has Processing orders
  const { data: processingRes } = useGetOrders(
    { page: 1, limit: 100, workflow: "processing" },
    open,
  );

  const busyCountByEmployee = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of processingRes?.data || []) {
      if (o.assignedEmployeeId) {
        map.set(o.assignedEmployeeId, (map.get(o.assignedEmployeeId) || 0) + 1);
      }
    }
    return map;
  }, [processingRes?.data]);

  const { mutateAsync: assignOrder, isPending } = useAssignOrder(selectedEmployeeId || "");

  const handleAssign = async () => {
    if (!selectedEmployeeId || !order) return;
    try {
      await assignOrder([order.id]);
      onOpenChange(false);
      setSelectedEmployeeId(null);
    } catch {
      // toast handled in hook
    }
  };

  const itemCount =
    order?.items?.reduce((s, i) => s + (i.quantity || 0), 0) || order?.items?.length || 0;
  const ref = order?.refrenceNumber || order?.id?.substring(0, 8).toUpperCase();

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setSelectedEmployeeId(null);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-slate-100 dark:border-slate-800">
          <SheetTitle className="text-lg font-bold">Assign Order</SheetTitle>
          <SheetDescription>
            Manager-only — assigning moves this order to Processing.
          </SheetDescription>
        </SheetHeader>

        {order && (
          <div className="space-y-4 px-4">
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

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                Select an Employee
              </p>
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
                          onClick={() => setSelectedEmployeeId(emp.id)}
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
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Assigning changes status from Pending to Processing and shows the designated employee
              on the order.
            </p>
          </div>
        )}

        <SheetFooter className="border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
