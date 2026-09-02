import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import {
  Building2,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Scale,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import type { ItemData } from "../types/item.types";
import { InfoCard } from "./info-card";

interface ItemDetailsCardProps {
  item: ItemData;
}

export function ItemDetailsCard({ item }: ItemDetailsCardProps) {
  const codeVal = item.barcodeValue || item.upcCode || item.id;

  return (
    <Card className="flex h-full flex-col rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="shrink-0 border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <div className="h-4 w-1.5 rounded-full bg-orange-500" />
          Information Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-5 p-5">
        {/* Top Info Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoCard
            icon={<MapPin className="h-4 w-4 text-orange-500" />}
            label="Country"
            value={item.country?.name || "Unknown"}
          />
          <InfoCard
            icon={<Building2 className="h-4 w-4 text-blue-500" />}
            label="Department"
            value={item.department?.departmentName || "None"}
          />
          <InfoCard
            icon={<Layers className="h-4 w-4 text-purple-500" />}
            label="Category"
            value={item.category?.categoryName || "None"}
          />
          <InfoCard
            icon={<Scale className="h-4 w-4 text-emerald-500" />}
            label="Base Quantity"
            value={item.baseQuantity && item.unit ? `${item.baseQuantity} ${item.unit}` : "N/A"}
          />
          <InfoCard
            icon={<Calendar className="h-4 w-4 text-slate-400" />}
            label="Added On"
            value={formatDate(item.createdAt)}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4 text-slate-400" />}
            label="Modified On"
            value={formatDate(item.updatedAt)}
          />
        </div>

        {/* Bottom QR Code Digital Verification Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-slate-50/70 to-orange-50/30 p-4 sm:p-5 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-900/40">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* Left QR Code Container */}
            <div className="relative flex shrink-0 flex-col items-center justify-center rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-slate-800">
              {item.qrCodeImage || item.barcodeImage ? (
                <Image
                  src={item.qrCodeImage || item.barcodeImage!}
                  alt="Product QR code"
                  height={120}
                  width={120}
                  className="size-28 rounded-md object-contain sm:size-32"
                />
              ) : (
                <div className="flex size-28 items-center justify-center text-xs text-slate-400">
                  QR Unavailable
                </div>
              )}
            </div>

            {/* Right Details & Info */}
            <div className="flex min-w-0 flex-1 flex-col space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  Scanner Verified
                </span>
                {item.upcCode && (
                  <span className="inline-flex items-center rounded-full bg-slate-200/70 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    UPC: {item.upcCode}
                  </span>
                )}
              </div>

              <div>
                <h4 className="flex items-center justify-center gap-2 text-sm font-extrabold text-slate-900 sm:justify-start dark:text-white">
                  <QrCode className="size-4 text-orange-500" />
                  <span>Item Digital QR Code</span>
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Scan this QR code with the Food Remit Mobile App to quickly verify product details
                  and order stock.
                </p>
              </div>

              <div className="pt-1">
                <span className="inline-block rounded-lg border border-slate-200/60 bg-white/80 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  Code: {codeVal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
