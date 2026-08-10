import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function renderHeader<TData, TValue>(
  column: Column<TData, TValue>,
  renderedHeader: React.ReactNode,
) {
  const headerLabel =
    typeof column.columnDef.header === "string" ? column.columnDef.header : renderedHeader;

  if (!column.getCanSort()) {
    return renderedHeader;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-0 font-semibold text-slate-700 hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerLabel}
      <ArrowUpDown className="ml-2 size-3.5 text-slate-400" />
    </Button>
  );
}
