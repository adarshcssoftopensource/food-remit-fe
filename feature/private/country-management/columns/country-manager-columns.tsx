import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { StatusBadge } from "@/components/common/status-badge";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { Switch } from "@/components/ui/switch";
import type { CountryManagerData } from "@/feature/private/country-management/types/country-manager";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

type CountryManagerColumnsConfig = {
  onView: (manager: CountryManagerData) => void;
  onEdit: (manager: CountryManagerData) => void;
  onToggleStatus: (id: string, checked: boolean) => void;
  onDelete: (manager: CountryManagerData) => void;
  onImageClick?: (image: string) => void;
};

export function getCountryManagerColumns({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onImageClick,
}: CountryManagerColumnsConfig): ColumnDef<CountryManagerData>[] {
  return [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;

        return pageIndex * pageSize + row.index + 1;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`.trim(),
      cell: ({ row }) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`.trim();
        return (
          <ImageNameCell
            name={fullName}
            image={row.original.image}
            type="logo"
            onImageClick={onImageClick}
            enableZoom={!!onImageClick}
          />
        );
      },
    },
    {
      accessorKey: "assignedCountry",
      header: "Assigned Country",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.assignCountryName}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => <span className="text-sm text-blue-600">{row.original.email}</span>,
    },
    {
      id: "phone",
      header: "Phone",
      accessorFn: (row) => `${row.phoneCode}${row.phoneNumber}`,
      cell: ({ row }) => (
        <PhoneDisplay
          countryCode={row.original.phoneCode}
          phoneNumber={row.original.phoneNumber}
          emptyLabel="-"
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const actionItems: DataTableRowActionItem[] = [
          {
            label: "View Manager",
            icon: <Eye className="size-4" />,
            onClick: () => onView(row.original),
          },
          {
            label: "Edit Manager",
            icon: <Pencil className="size-4" />,
            onClick: () => onEdit(row.original),
          },
          {
            label: "Delete Manager",
            icon: <Trash2 className="size-4" />,
            onClick: () => onDelete(row.original),
            variant: "destructive",
          },
        ];

        return (
          <div className="flex items-center gap-2">
            <DataTableRowActions items={actionItems} />
            <Switch
              checked={row.original.status === "Active"}
              onCheckedChange={(checked) => onToggleStatus(row.original.id, checked)}
              className="data-[state=checked]:bg-emerald-500"
              title={row.original.status === "Active" ? "Active" : "Inactive"}
            />
          </div>
        );
      },
    },
  ];
}
