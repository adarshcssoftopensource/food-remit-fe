import { ColumnDef } from "@tanstack/react-table";
import { CityActionsCell } from "../components/city-actions-cell";
import type { CityData } from "../types/settings.types";

export const citiesColumns: ColumnDef<CityData>[] = [
  {
    accessorKey: "countryName",
    header: "Country Name",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.countryName || "—"}</span>
    ),
  },
  {
    accessorKey: "cityName",
    header: "City Name",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900">
        {row.original.cityName || row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "addedOn",
    header: "Added On",
    cell: ({ row }) => {
      if (!row.original.addedOn) return "—";
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
    cell: ({ row }) => <CityActionsCell city={row.original} />,
    enableSorting: false,
  },
];
