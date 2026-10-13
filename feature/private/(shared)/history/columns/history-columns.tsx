import { StatusBadge } from "@/components/common/status-badge";
import { CopyButton } from "@/components/common/copy-button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatTime } from "@/lib/date";
import { getStatusColor } from "@/constants/partner-leads";

import { HistoryEntityType } from "../hooks/use-get-history-data";
import { HistoryEntityActionsCell } from "../components/history-entity-actions-cell";
import { withDeletedByColumn } from "@/feature/private/(shared)/recycle-bin/components/deleted-by-columns";

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
    cell: ({ row }) => {
      const phone =
        `${row.original.storeCountryCode || ""} ${row.original.storePhoneNumber || ""}`.trim();
      return (
        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span>{phone || "N/A"}</span>
          {phone && phone !== "N/A" ? (
            <CopyButton
              value={phone}
              label="Contact"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          ) : null}
        </div>
      );
    },
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
          <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(date)}</span>
          <span className="text-[11px] text-slate-400">{formatTime(date)}</span>
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
      <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>{row.original.referenceNumber}</span>
        <CopyButton
          value={row.original.referenceNumber}
          label="Reference Number"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
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
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span>{data.businessEmail}</span>
            <CopyButton
              value={data.businessEmail}
              label="Email"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
        <span>{row.original.phoneNumber || "N/A"}</span>
        {row.original.phoneNumber && row.original.phoneNumber !== "N/A" ? (
          <CopyButton
            value={row.original.phoneNumber}
            label="Phone"
            className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          />
        ) : null}
      </div>
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
          <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(date)}</span>
          <span className="text-[11px] text-slate-400">{formatTime(date)}</span>
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
  "partner-leads": withDeletedByColumn(historyPartnerLeadsColumns, true),
  stores: withDeletedByColumn(historyStoresColumns, true),
};
