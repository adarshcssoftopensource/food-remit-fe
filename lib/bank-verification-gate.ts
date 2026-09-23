/**
 * Shared flag so axios can block store-manager write actions
 * until bank verification is complete (profile sets this).
 */
let needsBankVerification = false;

export function setNeedsBankVerification(value: boolean) {
  needsBankVerification = value;
}

export function getNeedsBankVerification() {
  return needsBankVerification;
}

/** Endpoints allowed while bank verification is incomplete (writes). */
export function isBankVerificationExemptUrl(url?: string): boolean {
  if (!url) return false;
  const path = url.toLowerCase();
  // Profile photo / store updates are NOT exempt — view-only until bank verified.
  // Only auth, password, plaid, and notifications may mutate.
  return (
    path.includes("/plaid/") ||
    path.includes("plaid/") ||
    path.includes("/admin/auth/") ||
    path.includes("admin/change-password") ||
    path.includes("admin/logout") ||
    path.includes("admin/refresh") ||
    path.includes("admin/verify-password") ||
    path.includes("/notifications")
  );
}

export function isBankStatusVerified(bankStatus?: string | null): boolean {
  return (bankStatus || "").toUpperCase() === "VERIFIED";
}

export function resolvePartnerBankStatus(
  partnerLead?: {
    bankStatus?: string | null;
    bankVerifications?: { status?: string | null }[];
  } | null,
): string {
  if (!partnerLead) return "NOT_STARTED";
  const fromLead = (partnerLead.bankStatus || "").toUpperCase();
  if (fromLead) return fromLead;
  const fromRecord = (partnerLead.bankVerifications?.[0]?.status || "").toUpperCase();
  if (fromRecord === "VERIFIED" || fromRecord === "verified".toUpperCase()) return "VERIFIED";
  return fromRecord || "NOT_STARTED";
}
