"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { useDebounce } from "@/lib/debounce";
import { getInitials } from "@/lib/get-initials";
import { cn } from "@/lib/utils";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUnassignOrder } from "./hooks/use-assign-order";
import { useGetEmployee } from "./hooks/use-get-employee";
import { useGetEmployeeOrders } from "./hooks/use-get-employee-orders";
import { map } from "@/constants/employee-management";

interface EmployeeViewPageProps {
  id: string;
}

export function EmployeeViewPage({ id }: EmployeeViewPageProps) {
  const router = useRouter();
  const { data: employee, isLoading: empLoading } = useGetEmployee(id);
  const [assignedPage, setAssignedPage] = useState(1);
  const [assignedSearch, setAssignedSearch] = useState("");
  const debouncedAssignedSearch = useDebounce(assignedSearch, 500);
  const [assignedSorting, setAssignedSorting] = useState<SortingState>([]);

  const { data: assignedOrdersData, isLoading: assignedOrdersLoading } = useGetEmployeeOrders({
    employeeId: id,
    page: assignedPage,
    limit: 10,
    search: debouncedAssignedSearch || undefined,
    sortBy: assignedSorting[0]?.id,
    sortOrder: assignedSorting[0]?.desc ? "desc" : "asc",
  });

  const { mutateAsync: unassignOrder, isPending: isUnassigning } = useUnassignOrder(id);

  const handleUnassign = async (orderId: string) => {
    await unassignOrder(orderId);
  };

  const statusBadge = (status: number) => {
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

  const assignedOrderColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Ref No",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.refrenceNumber || row.original.id.substring(0, 8).toUpperCase()}
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
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <XCircle className="mr-1.5 size-3.5" />
          )}
          Unassign
        </Button>
      ),
    },
  ];

  if (empLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-slate-200 bg-white/50 px-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <User className="size-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee not found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The employee you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`.trim() || "N/A";
  const initials = getInitials(fullName);
  const isActive = employee.accountStatus === "ACTIVE";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Employee Details"
          description="View and manage employee information and assigned orders"
        />
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="w-full rounded-xl bg-white sm:w-auto dark:bg-slate-900"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Employees
        </Button>
      </div>

      {/* Employee Profile Card */}
      <Card className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              {employee.image ? (
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
                      {employee.countryCode ? `${employee.countryCode} ` : ""}
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
          <div className="relative mb-4">
            <svg
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={assignedSearch}
              onChange={(e) => {
                setAssignedSearch(e.target.value);
                setAssignedPage(1);
              }}
              placeholder="Search by order ID or sender / receiver name…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-4 pl-9 text-sm text-slate-800 placeholder-slate-400 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
            />
          </div>
          <DataTable
            columns={assignedOrderColumns}
            data={assignedOrdersData?.data ?? []}
            loading={assignedOrdersLoading}
            currentPage={assignedPage}
            totalPages={assignedOrdersData?.pagination?.totalPages ?? 1}
            rowsPerPage={10}
            onPageChange={setAssignedPage}
            onRowsPerPageChange={() => {}}
            onSortingChange={setAssignedSorting}
            manualSorting
            manualFiltering
          />
        </CardContent>
      </Card>
    </div>
  );
}
