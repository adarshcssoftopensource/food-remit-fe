"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUnassignOrder } from "./hooks/use-assign-order";
import { useGetEmployee } from "./hooks/use-get-employee";
import { useGetEmployeeOrders } from "./hooks/use-get-employee-orders";
import { EmployeeNotFound } from "./components/employee-not-found";
import { EmployeeOrdersTable } from "./components/employee-orders-table";
import { EmployeeProfileCard } from "./components/employee-profile-card";
import { EmployeeViewSkeleton } from "./components/employee-view-skeleton";

interface EmployeeViewPageProps {
  id: string;
}

export function EmployeeViewPage({ id }: EmployeeViewPageProps) {
  const router = useRouter();

  const { data: employee, isLoading: empLoading } = useGetEmployee(id);

  const [assignedPage, setAssignedPage] = useState(1);
  const [assignedSearch, setAssignedSearch] = useState("");
  const [assignedSorting, setAssignedSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebounce(assignedSearch, 500);

  const { data: assignedOrdersData, isLoading: assignedOrdersLoading } = useGetEmployeeOrders({
    employeeId: id,
    page: assignedPage,
    limit: 10,
    search: debouncedSearch || undefined,
    sortBy: assignedSorting[0]?.id,
    sortOrder: assignedSorting[0]?.desc ? "desc" : "asc",
  });

  const { mutateAsync: unassignOrder, isPending: isUnassigning } = useUnassignOrder(id);

  const handleSearchChange = (value: string) => {
    setAssignedSearch(value);
    setAssignedPage(1);
  };

  if (empLoading) return <EmployeeViewSkeleton />;
  if (!employee) return <EmployeeNotFound onBack={() => router.back()} />;

  const totalOrders = assignedOrdersData?.pagination?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
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

      {/* Profile Card */}
      <EmployeeProfileCard employee={employee} totalOrders={totalOrders} />

      {/* Assigned Orders */}
      <EmployeeOrdersTable
        employeeName={employee.firstName}
        data={assignedOrdersData?.data ?? []}
        isLoading={assignedOrdersLoading}
        totalOrders={totalOrders}
        currentPage={assignedPage}
        totalPages={assignedOrdersData?.pagination?.totalPages ?? 1}
        search={assignedSearch}
        isUnassigning={isUnassigning}
        onSearchChange={handleSearchChange}
        onPageChange={setAssignedPage}
        onSortingChange={setAssignedSorting}
        onUnassign={(orderId) => unassignOrder(orderId)}
      />
    </div>
  );
}
