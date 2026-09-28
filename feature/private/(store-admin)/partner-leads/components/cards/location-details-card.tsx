import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Calendar, CheckCircle2, AlertTriangle, Store, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PartnerLeadData } from "../../types/partner-lead.types";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function LocationDetailsCard({ lead }: { lead: PartnerLeadData }) {
  const cleanedLocations = useMemo(() => {
    if (!lead.locations || !Array.isArray(lead.locations)) return [];

    const list: Array<{
      address: string;
      daysOpen: string[];
      hoursOfOperation: string;
      phone?: string;
      storePhoneNumber?: string;
      dailySchedule?: { day: string; isOpen: boolean; openTime: string; closeTime: string }[];
    }> = [];

    lead.locations.forEach((loc: unknown) => {
      if (typeof loc === "object" && loc !== null && "address" in loc) {
        list.push(loc as (typeof list)[number]);
      } else if (typeof loc === "string") {
        try {
          const parsed = JSON.parse(loc);
          if (typeof parsed === "object" && parsed !== null && "address" in parsed) {
            list.push(parsed as (typeof list)[number]);
          } else if (Array.isArray(parsed)) {
            parsed.forEach((p) => {
              if (typeof p === "object" && p !== null && "address" in p) {
                list.push(p as (typeof list)[number]);
              }
            });
          }
        } catch {
          // Fallback if it's just a string address
          if (loc.trim()) {
            list.push({ address: loc.trim(), daysOpen: [], hoursOfOperation: "" });
          }
        }
      }
    });

    return list;
  }, [lead.locations]);

  return (
    <Card className="@container overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Location Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 @md:grid-cols-3">
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Country
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.country || "N/A"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              State / Province
            </dt>
            <dd className="text-sm font-semibold text-slate-900">
              {lead.stateProvince ||
                (lead as unknown as { stateProvinceRegion?: string }).stateProvinceRegion ||
                "N/A"}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">City</dt>
            <dd className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
              <span>{lead.businessCity || "N/A"}</span>
              {lead.cityCoverage &&
                (!lead.cityCoverage.cityExists ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-amber-800">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    City Not in System
                  </span>
                ) : lead.cityCoverage.hasCityManager && lead.cityCoverage.cityManager ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-emerald-700">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    CM: {lead.cityCoverage.cityManager.name}
                  </span>
                ) : null)}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Zip Code
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.zipCode || "N/A"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Currency
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.currency || "N/A"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Locations Count
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.locationsCount ?? 1}</dd>
          </div>
        </dl>

        {cleanedLocations.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Store className="h-3.5 w-3.5 text-emerald-600" />
                Store Addresses
              </h4>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {cleanedLocations.length} {cleanedLocations.length === 1 ? "Location" : "Locations"}
              </span>
            </div>

            <div className="space-y-4">
              {cleanedLocations.map((loc, idx) => {
                // Compute open count from dailySchedule or daysOpen
                const scheduleItems =
                  loc.dailySchedule && loc.dailySchedule.length > 0 ? loc.dailySchedule : null;

                const openDaysList = scheduleItems
                  ? scheduleItems.filter((d) => d.isOpen).map((d) => d.day)
                  : loc.daysOpen || [];

                const openDaysCount = openDaysList.length;
                const storePhone =
                  loc.storePhoneNumber || loc.phone || (idx === 0 ? lead.storePhoneNumber : null);

                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all hover:border-slate-300 sm:p-5"
                  >
                    {/* Location Header */}
                    <div className="flex flex-col gap-2.5 @md:flex-row @md:items-start @md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs ring-1 ring-emerald-500/20">
                          <MapPin className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Store #{idx + 1}
                          </span>
                          <p className="mt-0.5 text-sm leading-snug font-bold text-slate-900">
                            {loc.address}
                          </p>
                          {storePhone && (
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                              <Phone className="h-3 w-3 text-emerald-600" />
                              <span>Store Phone: {storePhone}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {loc.hoursOfOperation && (
                        <div className="shrink-0 self-start @md:self-auto">
                          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold whitespace-nowrap text-emerald-800">
                            <Clock className="h-3 w-3 shrink-0 text-emerald-600" />
                            <span className="truncate">{loc.hoursOfOperation}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Operational Schedule Box */}
                    {(scheduleItems || loc.daysOpen?.length > 0 || loc.hoursOfOperation) && (
                      <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3.5 @md:p-4">
                        {/* Subheader */}
                        <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                              Weekly Operating Hours
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-100/70 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {openDaysCount} of 7 Days Active
                          </span>
                        </div>

                        {/* Visual 7-day pill strip */}
                        <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                          {ALL_DAYS.map((day) => {
                            const isOpen = openDaysList.includes(day);
                            return (
                              <span
                                key={day}
                                className={cn(
                                  "flex h-7 min-w-10 items-center justify-center rounded-lg px-2 text-xs font-bold tracking-wider uppercase transition-all",
                                  isOpen
                                    ? "border border-emerald-300 bg-emerald-600 text-white shadow-2xs"
                                    : "line-through/none border border-slate-200/80 bg-white text-slate-400 opacity-60",
                                )}
                              >
                                {day.slice(0, 3)}
                              </span>
                            );
                          })}
                        </div>

                        {/* Daily breakdown (2-column grid) */}
                        {scheduleItems && scheduleItems.length > 0 ? (
                          <div className="grid grid-cols-1 gap-1.5 @md:grid-cols-2">
                            {scheduleItems.map((ds) => {
                              const isOpen = ds.isOpen;
                              return (
                                <div
                                  key={ds.day}
                                  className={cn(
                                    "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all",
                                    isOpen
                                      ? "border-emerald-200/60 bg-white text-slate-900 shadow-2xs"
                                      : "border-slate-200/50 bg-slate-100/60 text-slate-400",
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "h-2 w-2 rounded-full",
                                        isOpen ? "bg-emerald-500" : "bg-slate-300",
                                      )}
                                    />
                                    <span
                                      className={cn(
                                        "font-semibold",
                                        isOpen ? "text-slate-800" : "text-slate-400",
                                      )}
                                    >
                                      {ds.day}
                                    </span>
                                  </div>

                                  <div>
                                    {isOpen ? (
                                      <span className="inline-flex min-w-0 items-center gap-1 rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 font-semibold whitespace-nowrap text-slate-800">
                                        <Clock className="h-3 w-3 shrink-0 text-emerald-600" />
                                        <span className="truncate">
                                          {ds.openTime} – {ds.closeTime}
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium text-slate-400">
                                        Closed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Fallback if no daily schedule items */
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs">
                            <Clock className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-slate-700">
                              {loc.hoursOfOperation || "Hours not specified"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
