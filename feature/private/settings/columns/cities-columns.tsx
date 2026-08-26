import { ColumnDef } from "@tanstack/react-table";
import { CityActionsCell } from "../components/city-actions-cell";
import type { CityData } from "../types/settings.types";
import { formatDate } from "@/lib/date";

export const citiesColumns: ColumnDef<CityData>[] = [
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
      return formatDate(row.original.addedOn);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CityActionsCell city={row.original} />,
    enableSorting: false,
  },
];
