import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CityManagerData } from "@/feature/private/city-management/types/city-manager";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

type CityManagerColumnsConfig = {
  onView: (manager: CityManagerData) => void;
  onEdit: (manager: CityManagerData) => void;
  onToggleStatus: (id: string, checked: boolean) => void;
  onDelete: (manager: CityManagerData) => void;
  onImageClick?: (image: string) => void;
};

export function getCityManagerColumns({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onImageClick,
}: CityManagerColumnsConfig): ColumnDef<CityManagerData>[] {
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
            type="profile"
            onImageClick={onImageClick}
            enableZoom={!!onImageClick}
          />
        );
      },
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.countryName}</span>,
    },
    {
      id: "phone",
      header: "Phone",
      accessorFn: (row) => `${row.phoneCode}${row.phoneNumber}`,
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {`${row.original.phoneCode} ${row.original.phoneNumber}`}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => <span className="text-sm text-blue-600">{row.original.email}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => (
        <span className="text-xs whitespace-nowrap text-slate-600">
          {formatDate(row.original.createdAt)}
        </span>
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full text-slate-500"
            onClick={() => onView(row.original)}
            title="View manager"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full text-slate-500"
            onClick={() => onEdit(row.original)}
            title="Edit manager"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            onClick={() => onDelete(row.original)}
            title="Delete manager"
          >
            <Trash2 className="size-4" />
          </Button>
          <Switch
            checked={row.original.status === "Active"}
            onCheckedChange={(checked) => onToggleStatus(row.original.id, checked)}
            className="data-[state=checked]:bg-emerald-500"
            title={row.original.status === "Active" ? "Active" : "Inactive"}
          />
        </div>
      ),
    },
  ];
}
