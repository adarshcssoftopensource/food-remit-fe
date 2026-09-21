"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
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
  const isRequested = order.orderType === 2;
  const canAssign =
    isStoreManager && !order.assignedEmployeeId && (!isRequested || order.orderStatus === 8);

  const handleDelete = async () => {
    try {
      await deleteOrder();
      setDeleteOpen(false);
    } catch {}
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "Assign Employee",
      icon: <UserPlus className="size-4" />,
      onClick: () => setAssignOpen(true),
      hidden: !canAssign,
    },
    {
      label: "View Order",
      icon: <Eye className="size-4" />,
      onClick: () => {
        router.push(`${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}/${order.id}`);
      },
    },
    {
      label: "Delete Order",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <DataTableRowActions items={actionItems} />

      {assignOpen && (
        <AssignEmployeeDialog open={assignOpen} onOpenChange={setAssignOpen} orders={[order]} />
      )}

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
