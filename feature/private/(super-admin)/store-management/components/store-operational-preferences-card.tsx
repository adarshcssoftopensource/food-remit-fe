import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import type { StoreData } from "../types/store-management";

export function StoreOperationalPreferencesCard({ store }: { store: StoreData }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          <PackageCheck className="h-5 w-5 text-emerald-600" />
          Operational Product & Fulfillment Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
              Product Screening
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Perishable Products", value: store.perishableProducts === true },
                { label: "Refrigerated Products", value: store.refrigeratedProducts === true },
                { label: "Frozen Products", value: store.frozenProducts === true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5"
                >
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {item.label}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    {item.value ? (
                      <Badge className="border-emerald-200 bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-rose-200 bg-rose-50/80 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                        No
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              Fulfillment / Operations
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Same-Day Delivery
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  {store.sameDayDelivery ? (
                    <Badge className="border-emerald-200 bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-rose-200 bg-rose-50/80 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                      No
                    </Badge>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Processing Time
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    {store.sameDayDelivery && store.orderProcessingTime
                      ? store.orderProcessingTime
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
