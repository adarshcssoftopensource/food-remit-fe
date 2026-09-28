import { getCurrencySymbol } from "@/lib/utils/currency";
import { ColumnDef } from "@tanstack/react-table";
import { EditProcessingFeeDialog } from "../components/edit-processing-fee-dialog";
import { ProcessingFeeItem } from "../hooks/use-get-processing-fees";

export const processingFeeColumns: ColumnDef<ProcessingFeeItem>[] = [
  {
    accessorKey: "id",
    header: "S.no",
    cell: ({ row, table }) =>
      table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1,
  },
  {
    accessorKey: "countryName",
    header: "Country Name",
  },
  {
    accessorKey: "processingFee",
    header: "Processing Fee",
    cell: ({ row }) => {
      const fee = row.original.processingFee || "0.00";
      const symbol = getCurrencySymbol(row.original.currencySymbol, row.original.currency);
      return (
        <span className="font-semibold text-slate-800">
          {symbol} {fee}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const data: ProcessingFeeItem = row.original;
      return (
        <EditProcessingFeeDialog
          countryId={data.id}
          countryName={data.countryName}
          currentFee={data.processingFee || "0.00"}
          currencySymbol={data.currencySymbol}
          currencyCode={data.currency}
        />
      );
    },
  },
];
