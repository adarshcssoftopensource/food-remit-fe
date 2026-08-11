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
            <dd className="text-sm font-semibold text-slate-900">{lead.stateProvince || "N/A"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">City</dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.businessCity || "N/A"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
