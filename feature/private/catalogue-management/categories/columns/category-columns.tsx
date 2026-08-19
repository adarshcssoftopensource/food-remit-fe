import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryActionsCell } from "../components/category-actions-cell";
import { CategoryData } from "../types/category.types";

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

export function getCategoryColumns(
  onEdit: (dept: CategoryData) => void,
  onView: (dept: CategoryData) => void,
): ColumnDef<CategoryData>[] {
  return [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category Name",
      cell: ({ row }) => (
        <ImageNameCell
          name={row.original.categoryName}
          image={row.original.categoryIcon}
          type="logo"
        />
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-primary text-sm font-medium">
          {row.original.department?.departmentName || "-"}
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
        <CategoryActionsCell category={row.original} onEdit={onEdit} onView={onView} />
      ),
    },
  ];
}
