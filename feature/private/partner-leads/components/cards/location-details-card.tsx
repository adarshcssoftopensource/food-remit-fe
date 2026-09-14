import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function LocationDetailsCard({ lead }: { lead: PartnerLeadData }) {
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

        {lead.locations && lead.locations.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h4 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Addresses
            </h4>
            <ul className="space-y-2">
              {lead.locations.map((loc, idx) => (
                <li key={idx} className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {loc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
