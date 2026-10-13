import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/common/copy-button";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { Mail, User } from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function ContactInformationCard({ lead }: { lead: PartnerLeadData }) {
  const phone = lead.phoneNumber
    ? lead.phoneNumber.startsWith("+")
      ? lead.phoneNumber
      : `+${lead.phoneNumber}`
    : "";

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-5 w-5 text-emerald-600" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Full Name
            </dt>
            <dd className="text-sm font-semibold text-slate-900">
              {lead.firstName} {lead.lastName}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Job Title
            </dt>
            <dd className="text-sm font-semibold text-slate-900">{lead.jobTitle || "N/A"}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Business Email
            </dt>
            <dd className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <a
                href={`mailto:${lead.businessEmail}`}
                className="transition-colors hover:text-emerald-600"
              >
                {lead.businessEmail}
              </a>
              <CopyButton
                value={lead.businessEmail}
                label="Email"
                className="h-4 w-4 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              />
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Phone Number
            </dt>
            <dd className="flex items-center gap-2">
              <a href={`tel:${phone}`} className="transition-colors hover:text-emerald-600">
                <PhoneDisplay value={phone} className="font-semibold" emptyLabel="N/A" />
              </a>
              {phone ? (
                <CopyButton
                  value={phone}
                  label="Phone Number"
                  className="h-4 w-4 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                />
              ) : null}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
