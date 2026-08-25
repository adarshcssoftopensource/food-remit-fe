import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { FaqData } from "../types";

type FaqColumnsConfig = {
  onEdit: (faq: FaqData) => void;
  onDelete: (faq: FaqData) => void;
};

export function getFaqColumns({ onEdit, onDelete }: FaqColumnsConfig): ColumnDef<FaqData>[] {
  return [
    {
      id: "sno",
      header: "S.no",
      enableSorting: false,
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
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            className="border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => onEdit(row.original)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
}
