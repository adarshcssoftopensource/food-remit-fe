import { StatusBadge } from "@/components/common/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { getStatusColor } from "@/constants/partner.leads";
import { HistoryEntityType } from "../hooks/use-get-history-data";
import { HistoryEntityActionsCell } from "../components/history-entity-actions-cell";

// Helper to create checkbox column
const createSelectColumn = (): ColumnDef<any> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
});

// Helper to create S.No column
const createSNoColumn = (): ColumnDef<any> => ({
  id: "sno",
  header: "S.No",
  cell: ({ row, table }) => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    return pageIndex * pageSize + row.index + 1;
  },
  enableSorting: false,
  enableHiding: false,
});

// STORES COLUMNS
export const historyStoresColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "storeName",
    header: "Store Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900 capitalize dark:text-white">
          {row.original.storeName}
        </p>
        <p className="max-w-xs truncate text-xs text-slate-400">{row.original.storeAddress}</p>
      </div>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country / City",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {row.original.countryName || "N/A"}{" "}
        {row.original.cityName ? `/ ${row.original.cityName}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {`${row.original.storeCountryCode || ""} ${row.original.storePhoneNumber || ""}`.trim() ||
          "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "storeStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        activeLabel="ACTIVE"
        displayLabel={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    accessorKey: "addedOn",
    header: "Date Added",
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.addedOn ? new Date(row.original.addedOn) : null;
      if (!date || isNaN(date.getTime())) {
        return <span className="text-xs text-slate-400">N/A</span>;
      }
      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {format(date, "MMM dd, yyyy")}
          </span>
          <span className="text-[11px] text-slate-400">{format(date, "hh:mm a")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <HistoryEntityActionsCell
        entityType="stores"
        entity={row.original}
        entityNameField="storeName"
      />
    ),
  },
];

// PARTNER LEADS COLUMNS
export const historyPartnerLeadsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
        {row.original.referenceNumber}
      </span>
    ),
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900 capitalize dark:text-white">
          {row.original.businessName}
        </p>
        <p className="max-w-xs truncate text-xs text-slate-400">
          {row.original.businessType || "N/A"}{" "}
          {row.original.businessCity ? `• ${row.original.businessCity}` : ""}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {data.firstName} {data.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{data.businessEmail}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {row.original.phoneNumber || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Applied",
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
      if (!date || isNaN(date.getTime())) {
        return <span className="text-xs text-slate-400">N/A</span>;
      }
      return (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {format(date, "MMM dd, yyyy")}
          </span>
          <span className="text-[11px] text-slate-400">{format(date, "hh:mm a")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      return (
        <span
          className={`focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getStatusColor(status)}`}
        >
          {status?.replace(/_/g, " ") || "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <HistoryEntityActionsCell
        entityType="partner-leads"
        entity={row.original}
        entityNameField="businessName"
      />
    ),
  },
];

export const HISTORY_COLUMNS_BY_ENTITY: Record<HistoryEntityType, ColumnDef<any>[]> = {
  "partner-leads": historyPartnerLeadsColumns,
  stores: historyStoresColumns,
};
