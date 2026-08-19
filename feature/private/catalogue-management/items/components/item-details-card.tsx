import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { Barcode, Building2, Calendar, Clock, Layers, MapPin, Percent, Scale } from "lucide-react";
import { InfoCard } from "./info-card";

interface ItemDetailsCardProps {
  item: any;
}

export function ItemDetailsCard({ item }: ItemDetailsCardProps) {
  return (
    <Card className="flex flex-col rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <div className="bg-primary h-4 w-1.5 rounded-full" />
          Information Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-3">
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
            icon={<Barcode className="h-4 w-4" />}
            label="UPC Code"
            value={item.upcCode || "N/A"}
          />
          <InfoCard
            icon={<Scale className="h-4 w-4" />}
            label="Base Quantity"
            value={item.baseQuantity && item.unit ? `${item.baseQuantity} ${item.unit}` : "N/A"}
          />
          <InfoCard
            icon={<Percent className="h-4 w-4" />}
            label="Discount"
            value={
              item.discountAvailability
                ? item.discountPercentage
                  ? `${item.discountPercentage}%`
                  : "Available"
                : "Not Available"
            }
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
      </CardContent>
    </Card>
  );
}
