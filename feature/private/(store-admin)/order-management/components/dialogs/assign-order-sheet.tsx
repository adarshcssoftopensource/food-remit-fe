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
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useGetEmployees } from "@/feature/private/(store-admin)/employee-management/hooks/use-get-employees";
import { useAssignOrder } from "@/feature/private/(store-admin)/employee-management/hooks/use-assign-order";
import { useMemo, useState } from "react";
import { OrderData } from "../../types/order.types";
import { useGetOrders } from "../../hooks/use-get-orders";
import { toast } from "sonner";
import {
  AssignEmployeeList,
  AssignOrderSummary,
  AssignSubmitButton,
} from "./assign-order-sheet-parts";

interface AssignOrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData | null;
}

export function AssignOrderSheet({ open, onOpenChange, order }: AssignOrderSheetProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [busyConfirmOpen, setBusyConfirmOpen] = useState(false);

  const { data: employees, isLoading } = useGetEmployees({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const { data: processingRes } = useGetOrders(
    { page: 1, limit: 100, workflow: "processing" },
    open,
  );

  const { data: assignedRes } = useGetOrders({ page: 1, limit: 100, workflow: "assigned" }, open);

  const busyCountByEmployee = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of [...(processingRes?.data || []), ...(assignedRes?.data || [])]) {
      if (o.assignedEmployeeId) {
        map.set(o.assignedEmployeeId, (map.get(o.assignedEmployeeId) || 0) + 1);
      }
    }
    return map;
  }, [processingRes?.data, assignedRes?.data]);

  const selectedEmployee = useMemo(
    () => (employees || []).find((e) => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );
  const selectedBusyCount = selectedEmployeeId
    ? busyCountByEmployee.get(selectedEmployeeId) || 0
    : 0;
  const selectedName = selectedEmployee
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim()
    : "this employee";

  const { mutateAsync: assignOrder, isPending } = useAssignOrder(selectedEmployeeId || "");

  const runAssign = async () => {
    if (!selectedEmployeeId || !order) return;
    try {
      await assignOrder([order.id]);
      toast.success("Order assigned successfully!");
      setBusyConfirmOpen(false);
      onOpenChange(false);
      setSelectedEmployeeId(null);
    } catch (err: any) {
      const msg = String(err?.response?.data?.message || err?.message || "");
      if (/already started|started by/i.test(msg)) {
        toast.error(msg || "Order has already been started by another employee");
      }
      // other errors toasted in hook
    }
  };

  const handleAssignClick = () => {
    if (!selectedEmployeeId || !order) return;
    if (selectedBusyCount > 0) {
      setBusyConfirmOpen(true);
      return;
    }
    void runAssign();
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) {
            setSelectedEmployeeId(null);
            setBusyConfirmOpen(false);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="border-b border-slate-100 dark:border-slate-800">
            <SheetTitle className="text-lg font-bold">Assign Order</SheetTitle>
            <SheetDescription>
              Manager-only — assigning moves this order to Assigned. The employee then taps Start
              Order.
            </SheetDescription>
          </SheetHeader>

          {order && (
            <div className="space-y-4 px-4">
              <AssignOrderSummary order={order} />

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Select an Employee
                </p>
                <AssignEmployeeList
                  employees={employees}
                  isLoading={isLoading}
                  busyCountByEmployee={busyCountByEmployee}
                  selectedEmployeeId={selectedEmployeeId}
                  onSelect={setSelectedEmployeeId}
                />
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                Assigning changes status from Pending to Assigned and shows the designated employee
                on the order. It moves to Processing when the employee starts it.
              </p>
            </div>
          )}

          <SheetFooter className="border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
              Cancel
            </Button>
            <AssignSubmitButton
              order={order}
              selectedEmployeeId={selectedEmployeeId}
              isPending={isPending}
              onClick={handleAssignClick}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={busyConfirmOpen}
        onOpenChange={setBusyConfirmOpen}
        title={`${selectedName} is already handling ${selectedBusyCount} order${
          selectedBusyCount === 1 ? "" : "s"
        }. Do you still want to assign the order to the selected employee?`}
        description="There is no assignment limit. You can still assign additional orders to a busy employee if required."
        confirmLabel="Yes, Assign"
        cancelLabel="No"
        variant="default"
        isLoading={isPending}
        onConfirm={runAssign}
      />
    </>
  );
}
