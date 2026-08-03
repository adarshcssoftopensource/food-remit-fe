import { ProcessingFeeData } from "@/constants/settings";
import { ColumnDef } from "@tanstack/react-table";
import { EditProcessingFeeDialog } from "../components/edit-processing-fee-dialog";

export const processingFeeColumns: ColumnDef<ProcessingFeeData>[] = [
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
    accessorKey: "processingFee",
    header: "Processing Fee",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const data: ProcessingFeeData = row.original;
      return (
        <EditProcessingFeeDialog
          countryId={data.id}
          countryName={data.countryName}
          currentFee={data.processingFee}
        />
      );
    },
  },
];
