"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Globe, Pencil, Store, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/config/routes";
import { useDeleteCoupon } from "../hooks/use-delete-coupon";
import { useToggleCouponStatus } from "../hooks/use-toggle-coupon-status";
import type { CouponItem } from "../types/coupon.types";

function formatDateTime(isoString?: string) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return format(d, "MMM dd, yyyy h:mm a");
  } catch {
    return isoString;
  }
}

function StatusCell({ coupon }: { coupon: CouponItem }) {
  const toggleMutation = useToggleCouponStatus();
  const isActive = coupon.rawStatus === 1;

  const handleToggle = () => {
    toggleMutation.mutate(coupon.id);
  };

  let badgeColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
  if (coupon.status === "Inactive") {
    badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  } else if (coupon.status === "Expired") {
    badgeColor = "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300";
  } else if (coupon.status === "Scheduled") {
    badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
  }

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={toggleMutation.isPending}
        className="cursor-pointer data-[state=checked]:bg-emerald-600"
      />
      <Badge className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}>
        {coupon.status}
      </Badge>
    </div>
  );
}

function ActionCell({ coupon }: { coupon: CouponItem }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteCoupon();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(coupon.id);
    setDeleteOpen(false);
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "Edit Coupon",
      icon: <Pencil className="size-4" />,
      onClick: () => router.push(ROUTES.ADMIN.COUPONS_MANAGEMENT.EDIT(coupon.id)),
    },
    {
      label: "Delete Coupon",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: deleteMutation.isPending,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-1.5">
        <DataTableRowActions items={actionItems} />
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Coupon
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete coupon{" "}
              <strong className="text-slate-900 dark:text-white">{coupon.couponCode}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-3">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const couponColumns: ColumnDef<CouponItem>[] = [
  {
    id: "srNo",
    header: "Sr.No",
    enableSorting: false,
    cell: ({ row, table }) => (
      <span className="text-xs font-medium text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "couponCode",
    header: "Coupon Code",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {row.original.couponCode}
        </span>
        <p className="max-w-[180px] truncate text-xs font-medium text-slate-600 dark:text-slate-400">
          {row.original.couponName}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "discount",
    header: "Discount",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        {row.original.discount}% OFF
      </span>
    ),
  },
  {
    id: "scope",
    header: "Scope / Store",
    enableSorting: false,
    cell: ({ row }) => {
      const isGlobal = row.original.isGlobal;
      return (
        <div className="flex items-center gap-1.5">
          {isGlobal ? (
            <Badge className="flex items-center gap-1 rounded-lg border border-purple-200/80 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300">
              <Globe className="size-3" />
              <span>All Stores (Global)</span>
            </Badge>
          ) : (
            <Badge className="flex items-center gap-1 rounded-lg border border-blue-200/80 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
              <Store className="size-3" />
              <span className="max-w-[140px] truncate">{row.original.storeName}</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    id: "startDate",
    header: "Validity Schedule",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Calendar className="size-3 text-emerald-600" />
          <span className="text-[11px] font-medium">From:</span>
          <span className="text-[11px] font-medium">{formatDateTime(row.original.startDate)}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Calendar className="size-3 text-rose-600" />
          <span className="text-[11px] font-medium">To:</span>
          <span className="text-[11px] font-medium">{formatDateTime(row.original.endDate)}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "minOrderValue",
    id: "minOrderValue",
    header: "Min Order / Usage",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="space-y-0.5 text-xs">
        <p className="text-slate-700 dark:text-slate-300">
          Min Order: <span className="font-semibold">${row.original.minOrderValue}</span>
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Redeemed:{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row.original.redeemedCoupons}
          </span>{" "}
          / {row.original.maxUsers ?? "∞"}
        </p>
      </div>
    ),
  },
  {
    id: "createdBy",
    header: "Created By",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="space-y-0.5 text-xs">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {row.original.createdName || "Admin"}
        </p>
        <Badge variant="outline" className="text-[10px] text-slate-500">
          {row.original.createdBy}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => <StatusCell coupon={row.original} />,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <ActionCell coupon={row.original} />,
  },
];
