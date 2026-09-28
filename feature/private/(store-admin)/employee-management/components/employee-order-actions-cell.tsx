"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

interface EmployeeOrderActionsCellProps {
  order: {
    id: string;
    orderStatus: number;
  };
  onView: (orderId: string) => void;
  onUnassign: (orderId: string) => void;
  isUnassigning: boolean;
}

export function EmployeeOrderActionsCell({
  order,
  onView,
  onUnassign,
  isUnassigning,
}: EmployeeOrderActionsCellProps) {
  const [unassignOpen, setUnassignOpen] = useState(false);

  const handleUnassign = async () => {
    try {
      await onUnassign(order.id);
      setUnassignOpen(false);
    } catch {}
  };

  return (
    <div className="flex w-full items-center justify-start gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-300"
        onClick={() => onView(order.id)}
      >
        <Eye className="mr-1.5 size-3.5" />
        View
      </Button>
      {(order.orderStatus === 5 || order.orderStatus === 8) && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
            onClick={() => setUnassignOpen(true)}
            disabled={isUnassigning}
          >
            {isUnassigning ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <XCircle className="mr-1.5 size-3.5" />
            )}
            Unassign
          </Button>

          <ConfirmationDialog
            open={unassignOpen}
            onOpenChange={setUnassignOpen}
            title="Unassign Order"
            description="Are you sure you want to unassign this order from the employee?"
            confirmLabel="Unassign"
            onConfirm={handleUnassign}
            isLoading={isUnassigning}
            variant="destructive"
          />
        </>
      )}
    </div>
  );
}
