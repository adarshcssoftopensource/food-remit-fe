import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function OperationalPreferencesCard({ lead }: { lead: PartnerLeadData }) {
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
        </div>
      </CardContent>
    </Card>
  );
}
