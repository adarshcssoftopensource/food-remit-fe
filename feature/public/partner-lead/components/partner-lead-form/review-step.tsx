import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";

type ReviewStepProps = Pick<PartnerLeadFormState, "control" | "errors" | "getValues" | "watch">;

function getReviewSummary(getValues: PartnerLeadFormState["getValues"]) {
  const businessType = getValues("businessType");
  const otherBusinessType = getValues("otherBusinessType");
  const hasBusinessAccount = getValues("hasBusinessAccount");
  const businessCity = getValues("businessCity");
  const workPreferences = getValues("workPreferences") || [];
  const inventoryManagement = getValues("inventoryManagement");
  const websiteOrSocial = getValues("websiteOrSocial");

  return {
    businessName: getValues("businessName") || "N/A",
    businessTypeLabel:
      businessType === "Other" && otherBusinessType
        ? `Other: ${otherBusinessType}`
        : businessType || "N/A",
    bankAccountLabel:
      hasBusinessAccount !== undefined
        ? ` • Bank Account: ${hasBusinessAccount ? "Yes" : "No"}`
        : "",
    locationsCount: getValues("locationsCount") || "N/A",
    country: getValues("country") || "N/A",
    cityLabel: businessCity ? ` (${businessCity})` : "",
    firstName: getValues("firstName"),
    lastName: getValues("lastName"),
    jobTitle: getValues("jobTitle") || "Owner / Representative",
    businessEmail: getValues("businessEmail"),
    phoneNumber: getValues("phoneNumber"),
    workPreferencesLabel:
      workPreferences.length > 0 ? workPreferences.join(", ") : "None specified",
    showOperations: Boolean(inventoryManagement || websiteOrSocial),
    inventoryLabel: inventoryManagement || "Standard",
    websiteLabel: websiteOrSocial ? ` • ${websiteOrSocial}` : "",
    additionalNotes: getValues("additionalNotes"),
  };
}

export function ReviewStep({ control, errors, getValues, watch }: ReviewStepProps) {
  const summary = getReviewSummary(getValues);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <ShieldCheck className="size-5 text-emerald-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 6: Review & Complete</h2>
          <p className="text-xs text-slate-400">Confirm your details and submit interest</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Business:</span>
          <span className="min-w-0 font-semibold break-words text-slate-900 md:text-right">
            {summary.businessName} ({summary.businessTypeLabel}){summary.bankAccountLabel}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Locations &amp; Country:</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            {summary.locationsCount} • {summary.country}
            {summary.cityLabel}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Primary Contact:</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            {summary.firstName} {summary.lastName} ({summary.jobTitle})
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Contact Details:</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            {summary.businessEmail} • {summary.phoneNumber}
          </span>
        </div>
        {/* Work Preferences Review Line */}
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Partnership Interests:</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            {summary.workPreferencesLabel}
          </span>
        </div>
        {summary.showOperations && (
          <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 md:flex-row md:items-start md:justify-between md:gap-4">
            <span className="font-medium text-slate-500">Operations / Web:</span>
            <span className="text-left font-semibold break-all text-slate-900 md:text-right">
              {summary.inventoryLabel}
              {summary.websiteLabel}
            </span>
          </div>
        )}
        {summary.additionalNotes && (
          <div className="flex flex-col gap-1.5 border-b border-slate-200/60 pb-2">
            <span className="font-medium text-slate-500">Additional Notes:</span>
            <div className="max-h-28 overflow-y-auto rounded-xl border border-slate-200/80 bg-slate-50/60 p-2.5 text-xs leading-relaxed text-slate-700 italic sm:max-h-32 sm:text-sm dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
              <p className="break-words whitespace-pre-wrap">
                &quot;{summary.additionalNotes}&quot;
              </p>
            </div>
          </div>
        )}

        {/* KYC Review Line */}
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-1 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Identity Verification (KYC):</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            <KycReviewValue
              kycStatus={watch("kycStatus")}
              veriffSessionId={watch("veriffSessionId")}
            />
          </span>
        </div>

        {/* Bank Verification Review Line */}
        <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-1 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Bank Account (Plaid):</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            <BankReviewValue
              bankStatus={watch("bankStatus")}
              bankInstitutionName={watch("bankInstitutionName")}
              bankAccountMask={watch("bankAccountMask")}
            />
          </span>
        </div>

        {/* Supporting Documents Review Line */}
        <div className="flex flex-col gap-1 pb-1 md:flex-row md:items-start md:justify-between md:gap-4">
          <span className="font-medium text-slate-500">Supporting Documents:</span>
          <span className="min-w-0 font-semibold text-slate-900 md:text-right">
            <DocumentsReviewValue documentsCount={(watch("additionalDocuments") || []).length} />
          </span>
        </div>
      </div>

      <Controller
        name="agreeToContact"
        control={control}
        render={({ field }) => (
          <div className="mt-2 flex flex-col gap-1.5">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                field.value
                  ? "border-emerald-500 bg-emerald-50/40"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
                className="mt-0.5"
              />
              <span className="text-xs leading-relaxed font-medium text-slate-800">
                I agree to be contacted by Food Remit regarding partnership opportunities and
                onboarding.
              </span>
            </label>
            {errors.agreeToContact && (
              <p className="text-xs font-medium text-red-500">{errors.agreeToContact.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

function KycReviewValue({
  kycStatus,
  veriffSessionId,
}: {
  kycStatus?: string;
  veriffSessionId?: string;
}) {
  if ((kycStatus || "").toUpperCase() === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
        <CheckCircle2 className="size-4 text-emerald-600" />
        Verified &amp; Approved via Veriff
      </span>
    );
  }
  if (veriffSessionId) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
        <Clock className="size-4 text-amber-600" />
        Submitted / Under Review ({kycStatus || "SUBMITTED"})
      </span>
    );
  }
  return <span className="text-slate-400 italic">Not Started</span>;
}

function BankReviewValue({
  bankStatus,
  bankInstitutionName,
  bankAccountMask,
}: {
  bankStatus?: string;
  bankInstitutionName?: string;
  bankAccountMask?: string;
}) {
  if ((bankStatus || "").toUpperCase() === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
        <CheckCircle2 className="size-4 text-emerald-600" />
        {bankInstitutionName || "Verified Commercial Bank"} (•••• {bankAccountMask || "0000"})
      </span>
    );
  }
  if ((bankStatus || "").toUpperCase() === "SKIPPED") {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
        <Clock className="size-4 text-amber-600" />
        Skipped — Pending Verification
      </span>
    );
  }
  return <span className="text-slate-400 italic">Not Verified</span>;
}

function DocumentsReviewValue({ documentsCount }: { documentsCount: number }) {
  if (documentsCount > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
        <CheckCircle2 className="size-4 text-emerald-600" />
        {documentsCount} Document(s) Attached
      </span>
    );
  }
  return <span className="font-semibold text-rose-500">1 Document Required</span>;
}
