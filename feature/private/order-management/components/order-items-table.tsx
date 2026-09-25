"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expand, QrCode, Receipt, ShoppingBag } from "lucide-react";
import { getCurrencySymbol } from "@/lib/utils/currency";
import type { OrderDataItem } from "../types/order.types";

interface OrderItemsTableProps {
  items: OrderDataItem[];
  onImageClick: (src: string) => void;
  hideQrCode?: boolean;
}

function StockBadge({ inStock }: { inStock?: boolean }) {
  if (inStock === true)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" /> In Stock
      </span>
    );
  if (inStock === false)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
        <span className="size-1.5 rounded-full bg-rose-500" /> Out of Stock
      </span>
    );
  return <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>;
}

function ProductImageCell({
  src,
  alt,
  onImageClick,
}: {
  src?: string;
  alt: string;
  onImageClick: (src: string) => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="relative inline-block">
        <div className="flex size-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-xs dark:border-slate-700 dark:bg-slate-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="size-16 rounded-xl border border-slate-200 bg-white object-cover shadow-xs dark:border-slate-700"
        onError={() => setHasError(true)}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onImageClick(src)}
        className="absolute -top-1 -right-1 h-6 w-6 rounded-full border border-white bg-slate-900/80 p-0 text-white shadow-md hover:bg-slate-900"
      >
        <Expand className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function OrderItemsTable({ items, onImageClick, hideQrCode }: OrderItemsTableProps) {
  return (
    <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
      <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <CardTitle className="flex items-center text-base font-bold tracking-tight text-slate-900 dark:text-white">
          <ShoppingBag className="mr-2.5 size-5 text-rose-500" />
          Order Items &amp; Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:bg-slate-800/60">
                <tr>
                  <th className="px-6 py-4">Product Picture</th>
                  <th className="px-6 py-4">Product Name</th>
                  {!hideQrCode && <th className="px-6 py-4">Product QR Code</th>}
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, idx) => {
                  const priceNum = Number(item.price || 0);
                  const qtyNum = Number(item.quantity || 1);
                  const totalFormatted = (priceNum * qtyNum).toFixed(2);
                  const symbol = getCurrencySymbol(item.unit, "₹");
                  const qrCodeText = item.productBarcode || item.upcCode || item.itemId || "N/A";
                  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeText)}`;
                  const firstPicture = item.productPicture?.split(",")[0].trim();

                  return (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <ProductImageCell
                          src={firstPicture}
                          alt={item.itemName || "Product"}
                          onImageClick={onImageClick}
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <p className="text-base font-semibold">{item.itemName || "—"}</p>
                      </td>

                      {/* QR */}
                      {!hideQrCode && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="group relative inline-block">
                              <div className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={qrImageUrl}
                                  alt={`QR Code ${qrCodeText}`}
                                  className="size-10 rounded-md object-contain"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onImageClick(qrImageUrl)}
                                className="absolute -top-1 -right-1 h-6 w-6 rounded-full border border-white bg-slate-900/80 p-0 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-slate-900"
                                title="Zoom QR Code"
                              >
                                <Expand className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                <QrCode className="size-3.5 shrink-0 text-emerald-500" />
                                <span>{qrCodeText}</span>
                              </div>
                              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                Product Reference QR
                              </span>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <StockBadge inStock={item.inStock} />
                      </td>

                      {/* Unit Price */}
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {symbol}
                        {priceNum.toFixed(2)}
                      </td>

                      {/* Qty */}
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          {qtyNum}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white">
                        {symbol}
                        {totalFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-44 flex-col items-center justify-center space-y-2 text-slate-400">
            <Receipt className="size-10 opacity-20" />
            <p className="text-sm font-medium">No items attached to this order</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
