"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/debounce";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { employeeColumns } from "./columns/employee-columns";
import { EmployeeDialog } from "./components/employee-dialog";
import { useGetEmployees } from "./hooks/use-get-employees";
import { ROUTES } from "@/config/routes";

export function EmployeeManagementFeature() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState("all");

  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, pagination, isLoading } = useGetEmployees({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: status === "all" ? undefined : status,
  });

  const columns = useMemo(() => employeeColumns((img) => setSelectedImage(img)), []);

  const breadcrumbs = [
    { label: "Dashboard", href: ROUTES.ADMIN.DASHBOARD },
    { label: "Employee Management" },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Employee Management"
        description="Manage your store employees here."
        breadcrumbs={breadcrumbs}
        action={
          <EmployeeDialog
            trigger={
              <Button className="rounded-full px-6">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            }
          />
        }
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search employees..."
            className="rounded-full pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-40">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v || "");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        totalPages={pagination?.totalPages || 0}
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={(page) => setPage(page)}
        onRowsPerPageChange={(limit) => setLimit(limit)}
        onSortingChange={(sorting) => {
          if (sorting.length > 0) {
            setSortBy(sorting[0].id);
            setSortOrder(sorting[0].desc ? "desc" : "asc");
          } else {
            setSortBy(undefined);
            setSortOrder(undefined);
          }
        }}
        loading={isLoading}
        manualSorting={true}
      />

      <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
