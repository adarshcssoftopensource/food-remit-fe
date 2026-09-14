import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Store, XCircle } from "lucide-react";
import { useMemo } from "react";
import { PartnerLeadData } from "../../types/partner-lead.types";

const WEEK_DAYS = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
] as const;

export function OperationalPreferencesCard({ lead }: { lead: PartnerLeadData }) {
  // Normalize daysOpen to a set of lowercased strings for case-insensitive matching
  const openDaysSet = useMemo(() => {
    const rawDays = Array.isArray(lead.daysOpen) ? lead.daysOpen : [];
    return new Set(rawDays.map((d) => String(d).trim().toLowerCase()));
  }, [lead.daysOpen]);

  const totalOpenCount = useMemo(() => {
    return WEEK_DAYS.filter(
      (day) => openDaysSet.has(day.full.toLowerCase()) || openDaysSet.has(day.short.toLowerCase()),
    ).length;
  }, [openDaysSet]);

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Store className="h-5 w-5 text-emerald-600" />
          Operational Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Work Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {lead.workPreferences.length > 0 ? (
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Languages Spoken
              </h4>
              <p className="text-sm font-semibold text-slate-900">
                {lead.languages?.length > 0 ? lead.languages.join(", ") : "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Hours of Operation
              </h4>
              <p className="text-sm font-semibold text-slate-900">
                {lead.hoursOfOperation || "Not specified"}
              </p>
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Days Open (Weekly Schedule)
              </h4>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {totalOpenCount === 7 ? "Open All 7 Days" : `${totalOpenCount} / 7 Days Open`}
              </span>
            </div>

            {/* Series-wise 7-day weekly schedule grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
              {WEEK_DAYS.map((day) => {
                const isOpen =
                  openDaysSet.has(day.full.toLowerCase()) ||
                  openDaysSet.has(day.short.toLowerCase());

                return (
                  <div
                    key={day.full}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      isOpen
                        ? "border-emerald-200/80 bg-emerald-50/70 text-emerald-950 shadow-xs"
                        : "border-slate-200/60 bg-slate-50/50 text-slate-400 opacity-60"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        isOpen ? "text-slate-900" : "text-slate-400 line-through"
                      }`}
                    >
                      {day.full}
                    </span>
                    <div className="mt-2 flex items-center gap-1">
                      {isOpen ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-[11px] font-bold text-emerald-700">Open</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[11px] font-medium text-slate-400">Closed</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
