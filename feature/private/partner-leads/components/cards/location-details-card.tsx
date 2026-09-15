import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function LocationDetailsCard({ lead }: { lead: PartnerLeadData }) {
  const cleanedLocations = useMemo(() => {
    if (!lead.locations || !Array.isArray(lead.locations)) return [];

    const list: Array<{ address: string; daysOpen: string[]; hoursOfOperation: string }> = [];

    lead.locations.forEach((loc: any) => {
      if (typeof loc === "object" && loc !== null && "address" in loc) {
        list.push(loc);
      } else if (typeof loc === "string") {
        try {
          const parsed = JSON.parse(loc);
          if (typeof parsed === "object" && parsed !== null && "address" in parsed) {
            list.push(parsed);
          } else if (Array.isArray(parsed)) {
            parsed.forEach((p) => {
              if (typeof p === "object" && p !== null && "address" in p) list.push(p);
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
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Location Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <dl className="grid grid-cols-3 gap-x-4 gap-y-6">
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Country
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.country}</dd>
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
            <dd className="text-sm font-semibold text-slate-900">{lead.businessCity || "N/A"}</dd>
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
            <dd className="text-sm font-semibold text-slate-900">{lead.locationsCount}</dd>
          </div>
        </dl>

        {cleanedLocations.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Addresses
              </h4>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {cleanedLocations.length} {cleanedLocations.length === 1 ? "Location" : "Locations"}
              </span>
            </div>
            <ul className="space-y-4">
              {cleanedLocations.map((loc, idx) => (
                <li
                  key={idx}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 text-sm text-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 flex-1 font-medium">{loc.address}</span>
                  </div>

                  {(loc.daysOpen?.length > 0 || loc.hoursOfOperation) && (
                    <div className="ml-9 grid grid-cols-2 gap-4 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                      <div>
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Days Open
                        </span>
                        <span className="font-semibold text-slate-700">
                          {loc.daysOpen?.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {loc.daysOpen
                                .slice()
                                .sort((a, b) => {
                                  const days = [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                  ];
                                  return days.indexOf(a) - days.indexOf(b);
                                })
                                .map((day) => (
                                  <span
                                    key={day}
                                    className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset"
                                  >
                                    {day.slice(0, 3)}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Hours
                        </span>
                        <span className="font-semibold text-slate-700">
                          {loc.hoursOfOperation || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
