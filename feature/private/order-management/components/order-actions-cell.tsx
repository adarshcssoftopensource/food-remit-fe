"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDeleteOrder } from "../hooks/use-delete-order";
import { OrderData } from "../types/order.types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useProfile } from "@/components/providers/profile-provider";
import { AssignEmployeeDialog } from "./assign-employee-dialog";

interface OrderActionsCellProps {
  order: OrderData;
}

export function OrderActionsCell({ order }: OrderActionsCellProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder(order.id);
  const { profile } = useProfile();

  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";

  const handleDelete = async () => {
    try {
      await deleteOrder();
      setDeleteOpen(false);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      {isStoreManager && !order.assignedEmployeeId && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            onClick={() => setAssignOpen(true)}
            title="Assign to employee"
          >
            <UserPlus className="size-4" />
          </Button>
          {assignOpen && (
            <AssignEmployeeDialog open={assignOpen} onOpenChange={setAssignOpen} order={order} />
          )}
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => {
          router.push(`${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}/${order.id}`);
        }}
        title="View order"
      >
        <Eye className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        onClick={() => setDeleteOpen(true)}
        disabled={isDeleting}
        title="Delete order"
      >
        <Trash2 className="size-4" />
      </Button>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Order"
        description={`Are you sure you want to delete order ? This action cannot be undone.`}
        confirmLabel="Delete Order"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
