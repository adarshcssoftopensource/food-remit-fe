"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Package,
  CheckCircle2,
  Clock,
  Loader2,
  ShoppingBag,
  UserCheck,
  XCircle,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/common/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date";
import { useGetEmployee } from "./hooks/use-get-employee";
import { useGetEmployeeOrders } from "./hooks/use-get-employee-orders";
import { useAssignOrder, useUnassignOrder } from "./hooks/use-assign-order";
import { useGetOrders } from "@/feature/private/order-management/hooks/use-get-orders";
import { OrderData } from "@/feature/private/order-management/types/order.types";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EmployeeViewPageProps {
  id: string;
}

export function EmployeeViewPage({ id }: EmployeeViewPageProps) {
  const router = useRouter();
  const { data: employee, isLoading: empLoading } = useGetEmployee(id);
  const [assignPage, setAssignPage] = useState(1);
  const [assignedPage, setAssignedPage] = useState(1);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  const { data: storeOrders, isLoading: storeOrdersLoading } = useGetOrders(
    { page: assignPage, limit: 10 },
    true,
  );

  const { data: assignedOrdersData, isLoading: assignedOrdersLoading } = useGetEmployeeOrders({
    employeeId: id,
    page: assignedPage,
    limit: 10,
  });

  const { mutateAsync: assignOrder, isPending: isAssigning } = useAssignOrder(id);
  const { mutateAsync: unassignOrder, isPending: isUnassigning } = useUnassignOrder(id);

  const handleAssign = async (orderId: string) => {
    setAssigningOrderId(orderId);
    try {
      await assignOrder(orderId);
    } finally {
      setAssigningOrderId(null);
      setIsAssignDialogOpen(false);
    }
  };

  const handleUnassign = async (orderId: string) => {
    await unassignOrder(orderId);
  };

  const statusBadge = (status: number) => {
    const map: Record<number, { label: string; cls: string }> = {
      0: {
        label: "Declined",
        cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
      },
      1: {
        label: "Pending",
        cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
      },
      2: {
        label: "Preparing",
        cls: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400",
      },
      5: {
        label: "Sent",
        cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
      },
      6: {
        label: "Completed",
        cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      },
      7: {
        label: "Cancelled",
        cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
      },
    };
    const s = map[status] ?? {
      label: "Unknown",
      cls: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
          s.cls,
        )}
      >
        <span className="size-1.5 rounded-full bg-current opacity-70" />
        {s.label}
      </span>
    );
  };

  const storeOrderColumns: ColumnDef<OrderData>[] = [
    {
      accessorKey: "id",
      header: "Ref No",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.id.substring(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => <span className="text-xs">{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "userName",
      header: "Sender",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {row.original.userName || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "recieverName",
      header: "Receiver",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {row.original.recieverName || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {row.original.price || "0.00 USD"}
        </span>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.orderStatus),
    },
    {
      id: "assign",
      header: "Action",
      cell: ({ row }) => {
        const isLoading = assigningOrderId === row.original.id && isAssigning;
        return (
          <Button
            size="sm"
            className="h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700"
            onClick={() => {
              setAssigningOrderId(row.original.id);
              setIsAssignDialogOpen(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <>
                <UserCheck className="mr-1.5 size-3.5" />
                Assign
              </>
            )}
          </Button>
        );
      },
    },
  ];

  const assignedOrderColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Ref No",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.id.substring(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => <span className="text-xs">{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.orderStatus),
    },
    {
      id: "unassign",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          onClick={() => handleUnassign(row.original.id)}
          disabled={isUnassigning}
        >
          {isUnassigning ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <XCircle className="mr-1.5 size-3.5" />
              Unassign
            </>
          )}
        </Button>
      ),
    },
  ];

  if (empLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <User className="size-12 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-600">Employee Not Found</h2>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = getInitials(fullName);
  const isActive = employee.accountStatus === "ACTIVE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Employee Details"
          description="Manage this employee and assign store orders"
        />
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
      </div>

      {/* Employee Profile Card */}
      <Card className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        {/* Gradient header strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              {employee.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={employee.image}
                  alt={fullName}
                  className="size-24 rounded-2xl object-cover shadow-xl ring-4 ring-emerald-500/20"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-3xl font-black text-white shadow-xl ring-4 ring-emerald-500/20">
                  {initials}
                </div>
              )}
              <span
                className={cn(
                  "absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-slate-900",
                  isActive ? "bg-emerald-500" : "bg-slate-400",
                )}
              >
                <span className="size-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {fullName}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  {isActive ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                  {employee.accountStatus || "ACTIVE"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/40">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Mail className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Email
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {employee.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/40">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                    <Phone className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Phone
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {employee.countryCode ? `+${employee.countryCode} ` : ""}
                      {employee.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {employee.city && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-2.5 dark:bg-slate-800/40">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                      <MapPin className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Location
                      </p>
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {[employee.city, employee.state].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:w-40 sm:grid-cols-1">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 text-center dark:from-emerald-950/30 dark:to-teal-950/30">
                <Package className="mx-auto mb-1 size-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {assignedOrdersData?.pagination?.total ?? 0}
                </p>
                <p className="text-[10px] font-bold tracking-wide text-emerald-600/70 uppercase dark:text-emerald-500">
                  Assigned
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center dark:from-blue-950/30 dark:to-indigo-950/30">
                <ShoppingBag className="mx-auto mb-1 size-5 text-blue-600 dark:text-blue-400" />
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
                  {storeOrders?.pagination?.total ?? 0}
                </p>
                <p className="text-[10px] font-bold tracking-wide text-blue-600/70 uppercase dark:text-blue-500">
                  Store Orders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Orders */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
            Orders Assigned to {employee.firstName}
            <Badge
              variant="outline"
              className="ml-auto rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              {assignedOrdersData?.pagination?.total ?? 0} orders
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={assignedOrderColumns}
            data={assignedOrdersData?.data ?? []}
            loading={assignedOrdersLoading}
            currentPage={assignedPage}
            totalPages={assignedOrdersData?.pagination?.totalPages ?? 1}
            rowsPerPage={10}
            onPageChange={setAssignedPage}
            onRowsPerPageChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Store Orders to Assign */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ShoppingBag className="size-4" />
            </div>
            Store Orders — Assign to {employee.firstName}
            <Badge
              variant="outline"
              className="ml-auto rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-400"
            >
              {storeOrders?.pagination?.total ?? 0} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={storeOrderColumns}
            data={storeOrders?.data ?? []}
            loading={storeOrdersLoading}
            currentPage={assignPage}
            totalPages={storeOrders?.pagination?.totalPages ?? 1}
            rowsPerPage={10}
            onPageChange={setAssignPage}
            onRowsPerPageChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Assign Confirmation Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-white/70 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/95">
          {/* Dialog decorative gradient top bar */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg shadow-emerald-600/30">
                <UserCheck className="size-7 text-white" />
              </div>
              <button
                onClick={() => setIsAssignDialogOpen(false)}
                className="flex size-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="size-4" />
              </button>
            </div>

            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Assign Order to Employee
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                You are about to assign this order to{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {fullName}
                </span>
                . They will see this order in their My Orders dashboard.
              </DialogDescription>
            </DialogHeader>

            {/* Employee preview */}
            <div className="my-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-base font-black text-white shadow-sm">
                {initials}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{fullName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{employee.email}</p>
              </div>
              <div className="ml-auto">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Employee
                </span>
              </div>
            </div>

            {/* Order ref preview */}
            {assigningOrderId && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Package className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Order Reference
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    #{assigningOrderId.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <Calendar className="size-3" />
                  Pending
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-11 flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700"
                onClick={() => assigningOrderId && handleAssign(assigningOrderId)}
                disabled={isAssigning}
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Assigning…
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 size-4" />
                    Confirm Assign
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
