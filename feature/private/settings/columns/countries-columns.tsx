import { ColumnDef } from "@tanstack/react-table";
import { CountryActionsCell } from "../components/country-actions-cell";
import type { CountryData } from "../types/settings.types";
import { formatDate } from "@/lib/date";

export const countriesColumns: ColumnDef<CountryData>[] = [
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
