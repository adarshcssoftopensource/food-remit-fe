import { ColumnDef } from "@tanstack/react-table";
import { CountryActionsCell } from "../components/country-actions-cell";
import type { CountryData } from "../types/settings.types";

export const countriesColumns: ColumnDef<CountryData>[] = [
  {
    accessorKey: "id",
    header: "S.no",
    cell: ({ row }) => row.index + 1,
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
      if (!row.original.addedOn) return "-";
      const date = new Date(row.original.addedOn);
      if (isNaN(date.getTime())) return row.original.addedOn;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CountryActionsCell country={row.original} />,
  },
];
