import { findWorldCountryByIso } from "@/lib/world-locations";

function normalizeCode(value: string) {
  return value.trim().replace(/\s/g, "").toUpperCase().replace(/^\+/, "");
}

/**
 * Pick placement country matching viewer ISO (any country via world-locations).
 * DB may store ISO (JP) or dial code (+81).
 */
export function matchPlacementCountryId(
  placements: Array<{
    countryId: string;
    currency?: string | null;
    currencySymbol?: string | null;
    country?: {
      id: string;
      name: string;
      countryCode?: string | null;
    };
  }>,
  isoCode: string | null | undefined,
): string | null {
  if (!placements?.length || !isoCode) return null;

  const world = findWorldCountryByIso(isoCode);
  const iso = isoCode.toUpperCase();
  const dial = world ? normalizeCode(world.phonecode) : "";
  const currency = world?.currency?.toUpperCase() || "";
  const worldName = world?.name?.toLowerCase() || "";

  for (const row of placements) {
    const countryId = row.country?.id || row.countryId;
    if (!countryId) continue;

    const stored = normalizeCode(row.country?.countryCode || "");
    if (
      stored === iso ||
      stored === dial ||
      (dial && stored === dial) ||
      row.country?.countryCode?.toUpperCase() === iso
    ) {
      return countryId;
    }

    const name = (row.country?.name || "").toLowerCase();
    if (worldName && (name === worldName || name.includes(worldName) || worldName.includes(name))) {
      return countryId;
    }

    const cur = (row.currency || "").toUpperCase();
    if (currency && (cur === currency || row.currencySymbol === world?.currency)) {
      return countryId;
    }
  }

  return null;
}
