import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function LocationDetailsCard({ lead }: { lead: PartnerLeadData }) {
  const cleanedLocations = useMemo(() => {
    if (!lead.locations || !Array.isArray(lead.locations)) return [];
    const list: string[] = [];
    lead.locations.forEach((loc) => {
      if (typeof loc === "string") {
        const trimmed = loc.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              parsed.forEach((p) => {
                if (p && String(p).trim()) list.push(String(p).trim());
              });
              return;
            }
          } catch {}
        }
        if (trimmed) list.push(trimmed);
      }
    });
    return Array.from(new Set(list));
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
            <ul className="space-y-2">
              {cleanedLocations.map((loc, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 text-sm text-slate-800"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 flex-1 font-medium">{loc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
