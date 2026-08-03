import { CountryData } from "@/constants/settings";
import { ColumnDef } from "@tanstack/react-table";

export const countriesColumns: ColumnDef<CountryData>[] = [
  {
    accessorKey: "id",
    header: "S.no",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "countryName",
    header: "Country Name",
  },
  {
    accessorKey: "addedOn",
    header: "Added On",
    cell: ({ row }) => {
      const date = new Date(row.original.addedOn);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
];
