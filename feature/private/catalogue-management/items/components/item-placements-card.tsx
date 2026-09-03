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
import { resolveCurrencyDisplay } from "@/lib/currency";
import { Banknote, MapPin } from "lucide-react";
import type { ItemData, ItemPlacementData } from "../types/item.types";

type ItemPlacementsCardProps = {
  item: ItemData;
};

function formatPrice(row: ItemPlacementData) {
  const meta = resolveCurrencyDisplay({
    currency: row.currency,
    countryName: row.country?.name,
  });
  const symbol = row.currency || meta.code || row.currencySymbol;
  const code = row.currencySymbol || meta.symbol || row.currency;
  const amount = Number(row.price);
  const priceText = Number.isFinite(amount) ? amount.toLocaleString() : "-";

  return { symbol, code, priceText };
}

export function ItemPlacementsCard({ item }: ItemPlacementsCardProps) {
  const placements = Array.isArray(item.placements) ? item.placements : [];

  return (
    <Card className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
            <div className="bg-primary h-4 w-1.5 rounded-full" />
            Country Pricing
          </CardTitle>
          <Badge variant="secondary" className="rounded-lg font-medium">
            {placements.length} {placements.length === 1 ? "placement" : "placements"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {placements.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
            <Banknote className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No country prices yet
            </p>
            <p className="text-xs text-slate-400">
              Edit this item to add country, department, category and price rows.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/50">
                  <TableHead>Country</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((row, index) => {
                  const { symbol, code, priceText } = formatPrice(row);
                  return (
                    <TableRow
                      key={
                        row.id || `${row.countryId}-${row.departmentId}-${row.categoryId}-${index}`
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                          <MapPin className="size-3.5 shrink-0 text-slate-400" />
                          <span>{row.country?.name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {symbol} {priceText}
                          </span>
                          {code && code !== symbol ? (
                            <Badge
                              variant="outline"
                              className="rounded-md text-[10px] font-semibold"
                            >
                              {code}
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {row.department?.displayName || row.department?.departmentName || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {row.category?.categoryName || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
