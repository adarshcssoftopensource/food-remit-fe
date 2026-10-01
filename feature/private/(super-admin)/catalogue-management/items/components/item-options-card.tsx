"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Hash, Star } from "lucide-react";
import type { ItemData } from "../types/item.types";
import {
  formatPackSize,
  formatPrice,
  getItemCurrencySymbol,
  getItemOptions,
} from "../utils/item-display";

type ItemOptionsCardProps = {
  item: ItemData;
};

export function ItemOptionsCard({ item }: ItemOptionsCardProps) {
  const options = getItemOptions(item);
  const currencySymbol = getItemCurrencySymbol(item);
  const showUpc = options.some((opt) => !!opt.upcCode);

  if (options.length === 0) return null;

  return (
    <Card className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
              <div className="bg-primary h-4 w-1.5 rounded-full" />
              Pack / Size &amp; Price Options
            </CardTitle>
            <p className="mt-1 pl-4.5 text-xs text-slate-500">
              The starred pack is the default — its price is the item&apos;s base price.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {item.itemNumber ? (
              <Badge variant="outline" className="gap-1 rounded-lg font-mono font-medium">
                <Hash className="size-3" />
                {item.itemNumber}
              </Badge>
            ) : null}
            <Badge variant="secondary" className="rounded-lg font-medium">
              {options.length} {options.length === 1 ? "option" : "options"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Option</TableHead>
                <TableHead>Pack size</TableHead>
                <TableHead className="text-right">Qty per pack</TableHead>
                <TableHead className="text-right">Net weight</TableHead>
                {showUpc && <TableHead>UPC / barcode</TableHead>}
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((opt, index) => {
                const isDefault = index === 0;
                const size = formatPackSize(opt);
                return (
                  <TableRow key={opt.id || index} className={cn(isDefault && "bg-primary/[0.03]")}>
                    <TableCell>
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-[11px] font-bold",
                          isDefault
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                        )}
                        title={isDefault ? "Default pack" : undefined}
                      >
                        {isDefault ? <Star className="size-3 fill-current" /> : index + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {opt.optionName || "-"}
                      </span>
                      {isDefault && options.length > 1 ? (
                        <span className="text-primary bg-primary/10 ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase">
                          Default
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {size || "-"}
                    </TableCell>
                    <TableCell className="text-right text-slate-600 tabular-nums dark:text-slate-300">
                      {opt.quantityPerPack ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-slate-600 tabular-nums dark:text-slate-300">
                      {opt.netWeight !== null && opt.netWeight !== undefined
                        ? `${opt.netWeight} ${opt.weightUnit || ""}`.trim()
                        : opt.weightUnit || "-"}
                    </TableCell>
                    {showUpc && (
                      <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-300">
                        {opt.upcCode || "-"}
                      </TableCell>
                    )}
                    <TableCell className="text-right font-semibold text-slate-900 tabular-nums dark:text-white">
                      {formatPrice(opt.price, currencySymbol)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
