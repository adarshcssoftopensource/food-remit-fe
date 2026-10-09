import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Store, Truck, XCircle } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function OperationalPreferencesCard({
  lead,
  storeSameDayDelivery,
  storeOrderProcessingTime,
  storePerishableProducts,
  storeRefrigeratedProducts,
  storeFrozenProducts,
  hideFulfillmentAndScreening = false,
}: {
  lead?: PartnerLeadData | null;
  storeSameDayDelivery?: boolean | null;
  storeOrderProcessingTime?: string | null;
  storePerishableProducts?: boolean | null;
  storeRefrigeratedProducts?: boolean | null;
  storeFrozenProducts?: boolean | null;
  hideFulfillmentAndScreening?: boolean;
}) {
  const offersSameDay =
    storeSameDayDelivery !== undefined && storeSameDayDelivery !== null
      ? storeSameDayDelivery === true
      : lead?.sameDayDelivery === true;
  const processingTime =
    storeOrderProcessingTime !== undefined && storeOrderProcessingTime !== null
      ? storeOrderProcessingTime
      : lead?.orderProcessingTime;

  const carriesPerishable =
    storePerishableProducts !== undefined && storePerishableProducts !== null
      ? storePerishableProducts === true
      : lead?.perishableProducts === true;
  const carriesRefrigerated =
    storeRefrigeratedProducts !== undefined && storeRefrigeratedProducts !== null
      ? storeRefrigeratedProducts === true
      : lead?.refrigeratedProducts === true;
  const carriesFrozen =
    storeFrozenProducts !== undefined && storeFrozenProducts !== null
      ? storeFrozenProducts === true
      : lead?.frozenProducts === true;

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-4 py-3.5 sm:px-6 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Store className="h-5 w-5 text-emerald-600" />
          Operational Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {!hideFulfillmentAndScreening && (
            <>
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
                      {offersSameDay ? (
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
                        {offersSameDay && processingTime ? processingTime : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div>
                <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Product Screening
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Perishable Products", value: carriesPerishable },
                    { label: "Refrigerated Products", value: carriesRefrigerated },
                    { label: "Frozen Products", value: carriesFrozen },
                  ].map((q) => (
                    <div
                      key={q.label}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5"
                    >
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        {q.label}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5">
                        {q.value ? (
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
            </>
          )}

          {lead && (
            <>
              {!hideFulfillmentAndScreening && <Separator className="bg-slate-100" />}
              <div>
                <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Work Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lead.workPreferences && lead.workPreferences.length > 0 ? (
                    lead.workPreferences.map((pref) => (
                      <Badge
                        key={pref}
                        variant="secondary"
                        className="border-emerald-200/60 bg-emerald-50 px-3 py-1 font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        {pref}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-400">None selected</span>
                  )}
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div>
                <h4 className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Inventory Management
                </h4>
                <p className="text-sm font-semibold text-slate-900">
                  {lead.inventoryManagement || "Not specified"}
                </p>
              </div>
              <Separator className="bg-slate-100" />
              <div>
                <h4 className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Languages Spoken
                </h4>
                <p className="text-sm font-semibold text-slate-900">
                  {lead.languages && lead.languages.length > 0
                    ? lead.languages.join(", ")
                    : "Not specified"}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
