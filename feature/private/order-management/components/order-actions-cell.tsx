"use client";

import { Button } from "@/components/ui/button";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { CheckCircle2, Eye, Loader2, Play, Trash2, UserPlus, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteOrder } from "../hooks/use-delete-order";
import { useAcceptOrder, useRejectOrder, useStartOrder } from "../hooks/use-order-lifecycle";
import { OrderData } from "../types/order.types";
import { isAcceptedRequest, isPendingOrder, isRequestedOrder } from "../utils/order-workflow";
import { getOrderActorRole } from "../utils/order-roles";
import { AssignOrderSheet } from "./assign-order-sheet";
import { StartOrderConfirmDialog } from "./start-order-confirm-dialog";

interface OrderActionsCellProps {
  order: OrderData;
}

export function OrderActionsCell({ order }: OrderActionsCellProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder(order.id);
  const { mutateAsync: startOrder, isPending: isStarting } = useStartOrder();
  const { mutateAsync: acceptOrder, isPending: isAccepting } = useAcceptOrder();
  const { mutateAsync: rejectOrder, isPending: isRejecting } = useRejectOrder();

  const { isEmployee, canAssign: roleCanAssign, canRespondToRequest } = getOrderActorRole(profile);
  const pending = isPendingOrder(order);
  const canStart = pending && isEmployee;
  const canAssign = pending && roleCanAssign;
  const canAccept = canRespondToRequest && isRequestedOrder(order);
  const canReject = canRespondToRequest && (isRequestedOrder(order) || isAcceptedRequest(order));
  const detailPath = isEmployee
    ? ROUTES.ADMIN.MY_ORDER_DETAIL(order.id)
    : `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}/${order.id}`;

  const orderRef = order.refrenceNumber || order.id.substring(0, 8).toUpperCase();
  const customerName = order.recieverName || order.userName || "the customer";

  const handleStart = async () => {
    try {
      await startOrder(order.id);
      setStartOpen(false);
      router.push(detailPath);
    } catch {
      /* toast in hook */
    }
  };

  const handleAccept = async () => {
    try {
      await acceptOrder(order.id);
    } catch {}
  };

  const handleReject = async () => {
    try {
      await rejectOrder(order.id);
      setRejectOpen(false);
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteOrder();
      setDeleteOpen(false);
    } catch {}
  };

  const showStart = canStart;
  const showAssignPrimary = canAssign;

  const menuItems: DataTableRowActionItem[] = [
    {
      label: "View Order",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(detailPath),
    },
    {
      label: "Accept Request",
      icon: <CheckCircle2 className="size-4" />,
      onClick: () => void handleAccept(),
      hidden: !canAccept,
      disabled: isAccepting,
    },
    {
      label: "Reject Request",
      icon: <XCircle className="size-4" />,
      onClick: () => setRejectOpen(true),
      variant: "destructive",
      hidden: !canReject,
      disabled: isRejecting,
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
    <div className="flex w-full items-center justify-start gap-2">
      <DataTableRowActions items={menuItems} />

      {canAccept && (
        <Button
          size="sm"
          className="h-8 rounded-lg bg-teal-600 px-3 text-xs font-semibold text-white hover:bg-teal-700"
          onClick={() => void handleAccept()}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-1.5 size-3.5" />
          )}
          Accept
        </Button>
      )}

      {canReject && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50"
          onClick={() => setRejectOpen(true)}
          disabled={isRejecting}
        >
          <XCircle className="mr-1.5 size-3.5" />
          Reject
        </Button>
      )}

      {showStart && (
        <Button
          size="sm"
          className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={() => setStartOpen(true)}
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

      <AssignOrderSheet open={assignOpen} onOpenChange={setAssignOpen} order={order} />

      <StartOrderConfirmDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        orderRef={orderRef}
        customerName={customerName}
        isLoading={isStarting}
        onConfirm={handleStart}
      />

      <ConfirmationDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject Request"
        description={`Reject food request #${orderRef}? It will stay in Requested with Rejected status.`}
        confirmLabel="Reject Request"
        onConfirm={handleReject}
        isLoading={isRejecting}
        variant="destructive"
      />

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
