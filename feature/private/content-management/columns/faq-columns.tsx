import { Button } from "@/components/ui/button";
import type { FaqData } from "@/constants/content-management";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

type FaqColumnsConfig = {
  onEdit: (faq: FaqData) => void;
};

export function getFaqColumns({ onEdit }: FaqColumnsConfig): ColumnDef<FaqData>[] {
  return [
    {
      id: "sno",
      header: "S.no",
      cell: ({ row }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-md text-sm font-medium text-slate-800">
          {row.original.question}
        </span>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-lg text-sm text-slate-600">{row.original.answer}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"

            onClick={() => onEdit(row.original)}
          >
            <Pencil size={20} />
          </Button>
        </div>
      ),
    },
  ];
}
