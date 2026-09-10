"use client";

import Image from "next/image";
import { Barcode, PackageX, ZoomIn } from "lucide-react";
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
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import type { CreditUnmarkedItemsProps } from "../types/credits.types";

export function CreditUnmarkedItems({ items, currency, onImageClick }: CreditUnmarkedItemsProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <CardHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <PackageX className="size-3.5" />
            </div>
            <div>
              <CardTitle className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                Unmarked Items Requiring Refund ({items.length})
              </CardTitle>
            </div>
          </div>
          <Badge
            variant="destructive"
            className="rounded-full bg-rose-500/15 px-3 py-0.5 text-xs font-semibold text-rose-600 shadow-none hover:bg-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400"
          >
            Out of Stock
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 text-slate-500 dark:bg-slate-900/60">
              <TableRow className="border-b border-slate-100 hover:bg-transparent dark:border-slate-800">
                <TableHead className="h-10 pl-5 text-xs font-semibold">Product Details</TableHead>
                <TableHead className="h-10 text-center text-xs font-semibold">Quantity</TableHead>
                <TableHead className="h-10 text-right text-xs font-semibold">Unit Price</TableHead>
                <TableHead className="h-10 pr-5 text-right text-xs font-semibold">
                  Refund Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={item.id || idx}
                  className="border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-slate-800/80 dark:hover:bg-slate-900/40"
                >
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3.5">
                      {/* Image thumbnail with zoom overlay */}
                      <div
                        className={`group relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 shadow-2xs dark:border-slate-700/80 dark:bg-slate-800 ${
                          item.productPicture
                            ? "hover:ring-primary cursor-pointer ring-1 ring-black/5 dark:ring-white/10"
                            : ""
                        }`}
                        onClick={() => item.productPicture && onImageClick(item.productPicture)}
                        title={
                          item.productPicture ? "Click to open full-size image preview" : undefined
                        }
                      >
                        {item.productPicture ? (
                          <>
                            <Image
                              src={item.productPicture}
                              alt={item.itemName}
                              fill
                              className="object-cover transition-all duration-200 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                              <ZoomIn className="size-4 text-white drop-shadow-md" />
                            </div>
                          </>
                        ) : (
                          <div className="flex size-full items-center justify-center text-[10px] font-semibold text-slate-400">
                            N/A
                          </div>
                        )}
                      </div>

                      {/* Product Name & Barcode */}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                          {item.itemName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {item.barcode ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                              <Barcode className="size-3" />
                              {item.barcode}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              ID: {item.itemId.slice(0, 8)}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-rose-500">
                            • Out of Stock
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.quantity} {item.unit || "unit"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                    {cleanCurrencyDisplay(`${currency}${item.price.toFixed(2)}`)}
                  </TableCell>

                  <TableCell className="pr-5 text-right font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                    {cleanCurrencyDisplay(`${currency}${item.subtotal.toFixed(2)}`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
