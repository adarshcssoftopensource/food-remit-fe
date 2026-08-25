import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { Building2, Calendar, Clock, Layers, MapPin, Scale, ScanLine } from "lucide-react";
import Image from "next/image";
import type { ItemData } from "../types/item.types";
import { InfoCard } from "./info-card";

interface ItemDetailsCardProps {
  item: ItemData;
}

export function ItemDetailsCard({ item }: ItemDetailsCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="shrink-0 border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <div className="bg-primary h-4 w-1.5 rounded-full" />
          Information Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <InfoCard
            icon={<MapPin className="h-4 w-4" />}
            label="Country"
            value={item.country?.name || "Unknown"}
          />
          <InfoCard
            icon={<Building2 className="h-4 w-4" />}
            label="Department"
            value={item.department?.departmentName || "None"}
          />
          <InfoCard
            icon={<Layers className="h-4 w-4" />}
            label="Category"
            value={item.category?.categoryName || "None"}
          />
          <InfoCard
            icon={<Scale className="h-4 w-4" />}
            label="Base Quantity"
            value={item.baseQuantity && item.unit ? `${item.baseQuantity} ${item.unit}` : "N/A"}
          />
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Added On"
            value={formatDate(item.createdAt)}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4" />}
            label="Modified On"
            value={formatDate(item.updatedAt)}
          />
        </div>

        <div className="mt-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <ScanLine className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Barcode</p>
              <p className="text-[10px] text-slate-500">Food Remit app scan only</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center p-4 sm:p-5">
            <div className="flex w-full max-w-md items-center justify-center rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-200">
              {item.barcodeImage ? (
                <Image
                  src={item.barcodeImage}
                  alt="Product barcode"
                  height={40}
                  width={40}
                  className="h-20 w-full object-contain sm:h-24"
                />
              ) : (
                <p className="text-xs text-slate-400">Barcode unavailable</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
