import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Link as LinkIcon } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function BusinessOverviewCard({ lead }: { lead: PartnerLeadData }) {
  const website = lead.website || (lead as unknown as { websiteOrSocial?: string }).websiteOrSocial;
  const href = website
    ? website.startsWith("http://") || website.startsWith("https://")
      ? website
      : `https://${website}`
    : null;

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-5 w-5 text-emerald-600" />
          Business Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Business Type
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.businessType}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Locations Count
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.locationsCount}</dd>
          </div>
          {lead.additionalInfo?.match(/Business Account:\s*(Yes|No)/i) && (
            <div className="col-span-2 sm:col-span-1">
              <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Business Bank Account
              </dt>
              <dd className="text-sm font-semibold text-slate-900">
                {lead.additionalInfo.match(/Business Account:\s*(Yes|No)/i)?.[1] || "N/A"}
              </dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Website / Social
            </dt>
            <dd>
              {website && href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  {website}
                </a>
              ) : (
                <span className="text-sm font-medium text-slate-400 italic">Not provided</span>
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
