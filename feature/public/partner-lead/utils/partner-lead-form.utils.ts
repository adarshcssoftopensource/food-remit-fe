import type { PartnerLeadFormValues } from "../schema/partner-lead.schema";

export const DRAFT_KEY = "food_remit_partner_lead_draft";

export function dataUrlToFile(dataUrl: string, fileName: string, mimeType?: string): File | null {
  try {
    const parts = dataUrl.split(",");
    const header = parts[0];
    const data = parts[1];
    if (parts.length < 2 || !header || !data) return null;
    const mime = mimeType || header.match(/:(.*?);/)?.[1] || "application/octet-stream";
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  } catch {
    return null;
  }
}

export function hasMeaningfulData(vals?: Partial<PartnerLeadFormValues> | null): boolean {
  if (!vals) return false;
  return Boolean(
    vals.businessName?.trim() ||
    vals.businessType?.trim() ||
    vals.country?.trim() ||
    vals.firstName?.trim() ||
    vals.lastName?.trim() ||
    vals.businessEmail?.trim() ||
    vals.phoneNumber?.trim() ||
    vals.storePhoneNumber?.trim() ||
    vals.websiteOrSocial?.trim() ||
    vals.additionalNotes?.trim() ||
    vals.jobTitle?.trim() ||
    vals.businessCity?.trim() ||
    vals.stateProvinceRegion?.trim() ||
    (vals.workPreferences && vals.workPreferences.length > 0) ||
    vals.veriffSessionId?.trim() ||
    vals.plaidItemId?.trim() ||
    (vals.kycStatus && vals.kycStatus !== "NOT_STARTED") ||
    (vals.bankStatus && vals.bankStatus !== "NOT_STARTED") ||
    (vals.additionalDocuments && vals.additionalDocuments.length > 0),
  );
}

export function getCurrencySymbol(currencyCode: string) {
  let symbol = currencyCode;
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
    }).formatToParts(0);
    symbol = parts.find((p) => p.type === "currency")?.value || currencyCode;
  } catch (e) {}
  return symbol;
}

export function getIsNextStepDisabled(
  currentStep: number,
  isKycApproved: boolean,
  isBankStepComplete: boolean,
  documentsCount: number,
) {
  return (
    (currentStep === 4 && !isKycApproved) ||
    (currentStep === 5 && (!isBankStepComplete || documentsCount < 1))
  );
}
