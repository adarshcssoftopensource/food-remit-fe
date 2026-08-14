import { ColumnDef } from "@tanstack/react-table";
import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { DepartmentActionsCell } from "../components/department-actions-cell";
import { DepartmentData } from "../types/department.types";
import { formatDate } from "@/lib/date";

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function getDepartmentColumns(
  onEdit: (dept: DepartmentData) => void,
  onView: (dept: DepartmentData) => void,
): ColumnDef<DepartmentData>[] {
  return [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Department Name",
      cell: ({ row }) => (
        <ImageNameCell
          name={row.original.departmentName}
          image={row.original.departmentIcon}
          type="logo"
        />
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-primary text-sm font-medium">
          {row.original.country?.name || "-"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      enableSorting: true,
      cell: ({ row }) => {
        const date = formatDate(row.original.createdAt);
        return <span className="font-mono text-xs text-slate-500">{date}</span>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated On",
      enableSorting: true,
      cell: ({ row }) => {
        const date = formatDate(row.original.updatedAt);
        return <span className="font-mono text-xs text-slate-500">{date}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DepartmentActionsCell department={row.original} onEdit={onEdit} onView={onView} />
      ),
    },
  ];
}
