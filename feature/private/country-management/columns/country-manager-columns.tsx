import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CountryManagerData } from "@/constants/country-manager";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";

type CountryManagerColumnsConfig = {
  onView: (manager: CountryManagerData) => void;
  onEdit: (manager: CountryManagerData) => void;
  onToggleStatus: (id: string, checked: boolean) => void;
};

function StatusBadge({ status }: { status: CountryManagerData["status"] }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
      />
      {status}
    </span>
  );
}

export function getCountryManagerColumns({
  onView,
  onEdit,
  onToggleStatus,
}: CountryManagerColumnsConfig): ColumnDef<CountryManagerData>[] {
  return [
    {
      accessorKey: "userId",
      header: "S.no",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "name",
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`.trim(),
      cell: ({ row }) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`.trim();
        const initials = fullName
          .split(" ")
          .map((word) => word[0]?.toUpperCase())
          .slice(0, 2)
          .join("");
        return (
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-slate-800">{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "assignedCountry",
      header: "Assigned Country",
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
        <span className="text-sm text-slate-700">{`+${row.original.phoneCode} ${row.original.phoneNumber}`}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600">
          {new Date(row.original.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
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
            variant="ghost"
            size="icon-sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => onView(row.original)}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-amber-600 hover:bg-amber-50"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="size-4" />
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
