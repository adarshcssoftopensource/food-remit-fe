import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CountryManagerData } from "@/feature/private/country-management/types/country-manager";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";

type CountryManagerColumnsConfig = {
  onView: (manager: CountryManagerData) => void;
  onEdit: (manager: CountryManagerData) => void;
  onToggleStatus: (id: string, checked: boolean) => void;
  onImageClick?: (image: string) => void;
};

export function getCountryManagerColumns({
  onView,
  onEdit,
  onToggleStatus,
  onImageClick,
}: CountryManagerColumnsConfig): ColumnDef<CountryManagerData>[] {
  return [
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
        <span className="text-sm text-slate-700">{`${row.original.phoneCode} ${row.original.phoneNumber}`}</span>
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => onView(row.original)}>
            <Eye size={20} />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => onEdit(row.original)}>
            <Pencil size={20} />
          </Button>
          <Switch
            checked={row.original.status === "Active"}
            onCheckedChange={(checked) => onToggleStatus(row.original.id, checked)}
          />
        </div>
      ),
    },
  ];
}
