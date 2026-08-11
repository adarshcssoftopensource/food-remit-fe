import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function AdditionalInfoCard({ lead }: { lead: PartnerLeadData }) {
  return (
    <div className="space-y-6 md:col-span-2">
      {lead.statusRemark && (
        <Card className="overflow-hidden rounded-2xl border-blue-200 bg-blue-50/30 shadow-sm">
          <CardHeader className="border-b border-blue-100 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base text-blue-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Latest Status Remark
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
              {lead.statusRemark}
            </p>
          </CardContent>
        </Card>
      )}

      {lead.additionalInfo && (
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-amber-50/30 shadow-sm">
          <CardHeader className="border-b border-amber-100 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base text-amber-900">
              <FileText className="h-5 w-5 text-amber-600" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700">
              {lead.additionalInfo}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-900 shadow-sm">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-blue-600" />
        <p className="text-sm font-bold">
          {lead.firstName} agreed to be contacted by Food Remit regarding partnership opportunities.
        </p>
      </div>
    </div>
  );
}
