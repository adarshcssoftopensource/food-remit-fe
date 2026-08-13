import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CategoryData } from "../types/category.types";
import { CategoryActionsCell } from "../components/category-actions-cell";
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

function CategoryNameCell({ row }: { row: { original: CategoryData } }) {
  const name = row.original.categoryName;
  const icon = row.original.categoryIcon;

  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100">
        {icon ? (
          <Image src={icon} alt={name} className="h-6 w-6 object-contain" height={40} width={40} />
        ) : (
          <span className="text-primary font-bold">{name.charAt(0)}</span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{name}</span>
      </div>
    </div>
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
      cell: ({ row }) => <CategoryNameCell row={row} />,
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
