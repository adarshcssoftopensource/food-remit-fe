import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, FileText, Image as ImageIcon, Landmark, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface StoreCrmDetailsProps {
  partnerLead: any;
}

export function StoreCrmDetails({ partnerLead }: StoreCrmDetailsProps) {
  if (!partnerLead) return null;

  const locations = partnerLead.locations || [];
  const bankVerifications = partnerLead.bankVerifications || [];
  const kycVerifications = partnerLead.kycVerifications || [];
  const additionalDocuments = partnerLead.additionalDocuments || [];

  const bankData = bankVerifications.length > 0 ? bankVerifications[0] : partnerLead.bankData;
  const kycData = kycVerifications.length > 0 ? kycVerifications[0] : partnerLead.kycData;

  const mediaUrls = kycData?.mediaUrls || {};

  return (
    <div className="mt-6 space-y-6">
      {locations.length > 0 && (
        <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
          <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <MapPin className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                  Store Locations & Timings
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  Operating locations registered during onboarding
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {locations.map((loc: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {loc.address}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="size-4" />
                    <span>
                      {loc.daysOpen?.join(", ")} • {loc.hoursOfOperation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {bankData && (
        <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
          <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Landmark className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                  Bank Details
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  Verified bank account information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Bank Name
                </div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {bankData.institutionName || bankData.bankName || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Account Name
                </div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {bankData.accountName || bankData.businessName || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Account Number
                </div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {bankData.accountMask
                    ? `•••• ${bankData.accountMask}`
                    : bankData.bankAccountNumber
                      ? `•••• ${String(bankData.bankAccountNumber).slice(-4)}`
                      : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mediaUrls && Object.keys(mediaUrls).length > 0 && (
        <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
          <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                  KYC Documents
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  Identity verification images
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {["front", "back", "face"].map((type) => {
                if (!mediaUrls[type]) return null;
                return (
                  <div key={type} className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 capitalize dark:text-slate-300">
                      ID {type}
                    </span>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                      <Image src={mediaUrls[type]} alt={type} fill className="object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {additionalDocuments.length > 0 && (
        <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
          <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <FileText className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                  Additional Documents
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  Extra files provided during onboarding
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {additionalDocuments.map((doc: any, idx: number) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <FileText className="size-5 text-slate-500" />
                  </div>
                  <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                    {doc.name || `Document ${idx + 1}`}
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
