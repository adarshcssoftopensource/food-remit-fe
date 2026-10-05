import { toPhoneDigits } from "@/lib/phone";
import { formatAddress } from "@/lib/utils";
import type { ProfileDetailsValues } from "../schema/profile.schema";

function buildProfileContactNumber(
  phoneNumber?: string | null,
  countryCode?: string | null,
): string {
  const national = toPhoneDigits(phoneNumber || "");
  const dial = toPhoneDigits(countryCode || "");
  if (!national) return "";
  // Already includes dial (e.g. saved as full "13322359345")
  if (dial && national.startsWith(dial) && national.length > dial.length) {
    return national;
  }
  return dial ? `${dial}${national}` : national;
}

export function getProfileFormValues(profile: any) {
  const nameParts = (profile?.name || "").trim().split(" ");
  const firstName = profile?.firstName || nameParts[0] || "";
  const lastName = profile?.lastName || nameParts.slice(1).join(" ") || "";

  const resolvedCountry =
    (profile as any)?.countryName ||
    (profile as any)?.stores?.find((s: any) => s.country === (profile as any)?.country)
      ?.countryName ||
    (profile as any)?.stores?.[0]?.countryName ||
    (profile as any)?.country ||
    "";

  const resolvedCity =
    (profile as any)?.cityName ||
    (profile as any)?.stores?.find((s: any) => s.city === (profile as any)?.city)?.cityName ||
    (profile as any)?.city ||
    "";

  const getLeadAddress = () => {
    try {
      const locsRaw = (profile as any)?.partnerLead?.locations;
      if (!locsRaw) return null;
      let locs = locsRaw;
      if (typeof locsRaw === "string") {
        locs = JSON.parse(locsRaw);
      }
      return Array.isArray(locs) && locs[0] ? locs[0].address : null;
    } catch {
      return null;
    }
  };

  const rawAddress = getLeadAddress() || profile?.address || "";

  const values: ProfileDetailsValues = {
    firstName,
    lastName,
    email: profile?.email || "",
    contactNumber: buildProfileContactNumber(profile?.phoneNumber, (profile as any)?.countryCode),
    address: formatAddress(rawAddress) || "",
    country: resolvedCountry,
    state: (profile as any)?.state || "",
    city: resolvedCity || (profile as any)?.city || "",
    zipCode: (profile as any)?.zipCode || (profile as any)?.zipcode || "",
    image: undefined,
  };

  const phoneFallbackCountry =
    (profile as any)?.countryCode || resolvedCountry || (profile as any)?.country || "US";

  return { phoneFallbackCountry, values };
}
