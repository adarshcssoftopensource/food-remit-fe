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
import { PackageOpen, Scale } from "lucide-react";
import type { ItemData, ItemOptionData } from "../types/item.types";

type ItemOptionsCardProps = {
  item: ItemData;
};

export function ItemOptionsCard({ item }: ItemOptionsCardProps) {
  const options = Array.isArray(item.options) ? item.options : [];

  if (options.length === 0) return null;

  return (
    <Card className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
            <div className="bg-primary h-4 w-1.5 rounded-full" />
            Pack / Size Options
          </CardTitle>
          <Badge variant="secondary" className="rounded-lg font-medium">
            {options.length} {options.length === 1 ? "option" : "options"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/50">
                <TableHead>Item ID</TableHead>
                <TableHead>Option Name</TableHead>
                <TableHead>UPC / Barcode</TableHead>
                <TableHead>Quantity per Pack</TableHead>
                <TableHead>Net Weight</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((row: ItemOptionData, index: number) => {
                return (
                  <TableRow key={row.id || index}>
                    <TableCell>
                      <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.itemNumber || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                        <PackageOpen className="size-4 shrink-0 text-slate-400" />
                        <span>{row.optionName || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600 dark:text-slate-300">
                        {row.upcCode || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600 dark:text-slate-300">
                        {row.quantityPerPack !== null && row.quantityPerPack !== undefined
                          ? row.quantityPerPack
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        {row.netWeight !== null && row.netWeight !== undefined ? (
                          <>
                            <Scale className="size-3.5 shrink-0 text-slate-400" />
                            <span>
                              {row.netWeight} {row.weightUnit || ""}
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600 dark:text-slate-300">
                        {row.stockQuantity !== null && row.stockQuantity !== undefined
                          ? row.stockQuantity
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Number(row.price).toLocaleString()}
                      </span>
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
