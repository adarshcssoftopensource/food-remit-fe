import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, FileText } from "lucide-react";
import type { ItemData } from "../types/item.types";

interface ItemInfoSectionProps {
  item: ItemData;
}

export function ItemInfoSection({ item }: ItemInfoSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(item.productInfo || item.productInfoImageUrl) && (
        <Card className="rounded-2xl border-0 bg-linear-to-br from-blue-50 to-white shadow-lg shadow-blue-100/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-none">
          <CardHeader className="border-b border-blue-100/50 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {item.productInfo && (
              <div className="mb-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {item.productInfo}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Nutrition Info Card */}
      {(item.nutritionInfo || item.nutritionInfoImageUrl) && (
        <Card className="rounded-2xl border-0 bg-linear-to-br from-green-50 to-white shadow-lg shadow-green-100/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-none">
          <CardHeader className="border-b border-green-100/50 px-6 py-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white">
                <Apple className="h-4 w-4" />
              </div>
              Nutrition Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {item.nutritionInfo && (
              <div className="mb-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {item.nutritionInfo}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
