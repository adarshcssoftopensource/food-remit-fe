import { ColumnDef } from "@tanstack/react-table";
import { CountryActionsCell } from "../components/country-actions-cell";
import type { CountryData } from "../types/settings.types";
import { formatDate } from "@/lib/date";

export const countriesColumns: ColumnDef<CountryData>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country Name",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.countryName || row.original.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "addedOn",
    header: "Added On",
    cell: ({ row }) => {
      return formatDate(row.original.addedOn);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CountryActionsCell country={row.original} />,
  },
];
