import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { Badge } from "@/components/ui/badge";
import { getPlainText } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, HelpCircle, Pencil, ShoppingBag, Store, Trash2, User } from "lucide-react";
import { FAQ_SUPPORTED_LANGUAGES, type FaqCategoryKey, type FaqData } from "../types";

type FaqColumnsConfig = {
  onEdit: (faq: FaqData) => void;
  onDelete: (faq: FaqData) => void;
};

const CATEGORY_STYLES: Record<
  FaqCategoryKey,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    text: string;
    border: string;
  }
> = {
  order: {
    label: "Order",
    icon: ShoppingBag,
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  payments: {
    label: "Payments",
    icon: CreditCard,
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  account: {
    label: "Account",
    icon: User,
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  pickup: {
    label: "Pickup",
    icon: Store,
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  general: {
    label: "General",
    icon: HelpCircle,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

export function getFaqColumns({ onEdit, onDelete }: FaqColumnsConfig): ColumnDef<FaqData>[] {
  return [
    {
      id: "sno",
      header: "S.no",
      enableSorting: false,
      cell: ({ row, table }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "categoryKey",
      header: "Category",
      cell: ({ row }) => {
        const catKey = (row.original.categoryKey || "general").toLowerCase() as FaqCategoryKey;
        const style = CATEGORY_STYLES[catKey] || CATEGORY_STYLES.general;
        const Icon = style.icon;

        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs",
              style.bg,
            )}
          >
            <Icon className="size-3.5" />
            <span>{style.label}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="space-y-1">
          <span className="line-clamp-2 max-w-md text-sm font-semibold text-slate-800">
            {getPlainText(row.original.question)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <TruncatedTextCell
          text={getPlainText(row.original.answer)}
          maxWords={22}
          className="line-clamp-2 max-w-md text-sm text-slate-600"
        />
      ),
    },
    {
      id: "languages",
      header: "Translations",
      enableSorting: false,
      cell: ({ row }) => {
        const qTrans = row.original.questionTranslations || {};
        const aTrans = row.original.answerTranslations || {};

        return (
          <div className="flex items-center gap-1">
            {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
              const hasQ = Boolean(
                qTrans[lang.code]?.trim() || (lang.code === "en" && row.original.question),
              );
              const hasA = Boolean(
                aTrans[lang.code]?.trim() || (lang.code === "en" && row.original.answer),
              );
              const isFilled = hasQ && hasA;

              return (
                <span
                  key={lang.code}
                  title={`${lang.label}: ${isFilled ? "Available" : "Missing"}`}
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-md text-[10px] font-bold uppercase transition-colors",
                    isFilled
                      ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300"
                      : "bg-slate-100 text-slate-400 opacity-60",
                  )}
                >
                  {lang.code}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const actionItems: DataTableRowActionItem[] = [
          {
            label: "Edit FAQ",
            icon: <Pencil className="size-4" />,
            onClick: () => onEdit(row.original),
          },
          {
            label: "Delete FAQ",
            icon: <Trash2 className="size-4" />,
            onClick: () => onDelete(row.original),
            variant: "destructive",
          },
        ];

        return (
          <div className="flex items-center gap-1.5">
            <DataTableRowActions items={actionItems} />
          </div>
        );
      },
    },
  ];
}
