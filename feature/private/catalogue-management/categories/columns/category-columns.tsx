import { CatalogueStatus, CategoryData } from "@/constants/catalogue-management";
import { ColumnDef } from "@tanstack/react-table";
import { Tag } from "lucide-react";
import Image from "next/image";
import { CategoryActionsCell } from "../components/category-actions-cell";

function StatusBadge({ status }: { status: CatalogueStatus }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {status}
    </span>
  );
}

function CategoryNameCell({ row }: { row: { original: CategoryData } }) {
  const { name, icon } = row.original;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-slate-50">
        {icon ? (
          <Image src={icon} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tag className="h-5 w-5 text-slate-300" />
          </div>
        )}
      </div>
      <span className="max-w-25 truncate text-center text-xs font-medium text-slate-700">
        {name}
      </span>
    </div>
  );
}

export function getCategoryColumns(
  onEdit: (cat: CategoryData) => void,
  onView: (cat: CategoryData) => void,
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
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => <CategoryNameCell row={row} />,
    },
    {
      accessorKey: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-primary text-sm font-medium">{row.original.departmentName}</span>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      enableSorting: true,
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.country}</span>,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => <span className="text-primary text-sm">{row.original.city}</span>,
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.createdBy}</span>,
    },
    {
      accessorKey: "createdOn",
      header: "Created On",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">{row.original.createdOn}</span>
      ),
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
