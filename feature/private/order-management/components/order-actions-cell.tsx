"use client";

import { Button } from "@/components/ui/button";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { Eye, Loader2, Play, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteOrder } from "../hooks/use-delete-order";
import { useStartOrder } from "../hooks/use-order-lifecycle";
import { OrderData } from "../types/order.types";
import { isPendingOrder } from "../utils/order-workflow";
import { getOrderActorRole } from "../utils/order-roles";
import { AssignOrderSheet } from "./assign-order-sheet";

interface OrderActionsCellProps {
  order: OrderData;
}

export function OrderActionsCell({ order }: OrderActionsCellProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder(order.id);
  const { mutateAsync: startOrder, isPending: isStarting } = useStartOrder();

  const { isStoreManager, isEmployee, isElevated } = getOrderActorRole(profile);
  const pending = isPendingOrder(order);
  const canStart = pending && (isEmployee || isStoreManager || isElevated);
  const canAssign = pending && (isStoreManager || isElevated);
  const detailPath = isEmployee
    ? ROUTES.ADMIN.MY_ORDER_DETAIL(order.id)
    : `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}/${order.id}`;

  const handleStart = async () => {
    try {
      await startOrder(order.id);
      router.push(detailPath);
    } catch {
      /* toast in hook */
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder();
      setDeleteOpen(false);
    } catch {}
  };

  // Primary CTA only for Start / Assign — View Order lives only under ⋮
  const showStart = canStart;
  const showAssignPrimary = canAssign && !canStart;

  const menuItems: DataTableRowActionItem[] = [
    {
      label: "View Order",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(detailPath),
    },
    {
      label: "Assign Order",
      icon: <UserPlus className="size-4" />,
      onClick: () => setAssignOpen(true),
      hidden: !canAssign || showAssignPrimary,
    },
    {
      label: "Delete Order",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
      hidden: isEmployee,
    },
  ];

  return (
    <div className="flex items-center justify-end gap-2">
      {showStart && (
        <Button
          size="sm"
          className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={handleStart}
          disabled={isStarting}
        >
          {isStarting ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Play className="mr-1.5 size-3.5 fill-current" />
          )}
          Start Order
        </Button>
      )}

      {showAssignPrimary && (
        <Button
          size="sm"
          className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={() => setAssignOpen(true)}
        >
          <UserPlus className="mr-1.5 size-3.5" />
          Assign
        </Button>
      )}

      <DataTableRowActions items={menuItems} />

      <AssignOrderSheet open={assignOpen} onOpenChange={setAssignOpen} order={order} />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        confirmLabel="Delete Order"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
