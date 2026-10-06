import { City, Country, State } from "country-state-city";

export type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type ParsedPlaceAddress = {
  streetAddress: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  postalCode: string;
  formattedAddress: string;
  name?: string;
};

/** Well-known Google locality names → country-state-city city names */
const CITY_ALIASES: Record<string, string> = {
  "sahibzada ajit singh nagar": "Mohali",
  "sas nagar": "Mohali",
  "s.a.s. nagar": "Mohali",
  "new delhi": "Delhi",
  gurgaon: "Gurugram",
  bombay: "Mumbai",
  calcutta: "Kolkata",
  madras: "Chennai",
  bangalore: "Bengaluru",
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function findComponent(
  components: GoogleAddressComponent[],
  type: string,
): GoogleAddressComponent | undefined {
  return components.find((c) => c.types.includes(type));
}

function matchCountry(components: GoogleAddressComponent[]): {
  name: string;
  isoCode: string;
} | null {
  const countryComp = findComponent(components, "country");
  if (!countryComp) return null;

  const byIso = Country.getCountryByCode(countryComp.short_name);
  if (byIso) return { name: byIso.name, isoCode: byIso.isoCode };

  const byName = Country.getAllCountries().find(
    (c) => normalize(c.name) === normalize(countryComp.long_name),
  );
  return byName ? { name: byName.name, isoCode: byName.isoCode } : null;
}

function matchState(
  countryIso: string,
  components: GoogleAddressComponent[],
): { name: string; isoCode: string } | null {
  const states = State.getStatesOfCountry(countryIso);
  if (!states.length) return null;

  const isPh = countryIso.toUpperCase() === "PH";
  // In the Philippines, administrative_area_level_2 is the Province (e.g. Laguna, Cavite, Batangas, Cebu),
  // while administrative_area_level_1 is often the broader Region (e.g. Calabarzon, Central Luzon).
  // Prioritize the actual Province (level_2), and fall back to Region (level_1) if not found (e.g. Metro Manila / NCR).
  const candidateTypes = isPh
    ? ["administrative_area_level_2", "administrative_area_level_1"]
    : ["administrative_area_level_1", "administrative_area_level_2"];

  for (const type of candidateTypes) {
    const stateComp = findComponent(components, type);
    if (!stateComp) continue;

    const byCode = states.find(
      (s) => s.isoCode.toUpperCase() === stateComp.short_name.toUpperCase(),
    );
    if (byCode) return { name: byCode.name, isoCode: byCode.isoCode };

    const byName = states.find((s) => normalize(s.name) === normalize(stateComp.long_name));
    if (byName) return { name: byName.name, isoCode: byName.isoCode };
  }

  // Fallback for PH if level_2 is provided but not in CSC state list: use province name directly
  if (isPh) {
    const level2 = findComponent(components, "administrative_area_level_2");
    if (level2?.long_name) {
      return { name: level2.long_name, isoCode: level2.short_name || "" };
    }
  }

  return null;
}

function resolveCityAlias(candidate: string): string {
  return CITY_ALIASES[normalize(candidate)] ?? candidate;
}

function cleanCityCandidate(name: string): string[] {
  const trimmed = name.trim();
  const variations = [trimmed];

  // Strip "City of X" -> "X" (e.g. "City of Santa Rosa" -> "Santa Rosa", "City of Manila" -> "Manila")
  const withoutCityOf = trimmed.replace(/^city\s+of\s+/i, "").trim();
  if (withoutCityOf && normalize(withoutCityOf) !== normalize(trimmed)) {
    variations.push(withoutCityOf);
  }

  // Strip "X City" -> "X" (e.g. "Makati City" -> "Makati")
  const withoutCitySuffix = trimmed.replace(/\s+city$/i, "").trim();
  if (withoutCitySuffix && normalize(withoutCitySuffix) !== normalize(trimmed)) {
    variations.push(withoutCitySuffix);
  }

  return variations;
}

function matchCity(
  countryIso: string,
  state: { name: string; isoCode: string } | null,
  components: GoogleAddressComponent[],
): string {
  const stateIso = state?.isoCode;
  const stateName = state?.name;
  const stateCities = stateIso ? (City.getCitiesOfState(countryIso, stateIso) ?? []) : [];
  const countryCities = City.getCitiesOfCountry(countryIso) ?? [];
  const pool = stateCities.length > 0 ? stateCities : countryCities;

  const cityTypes = [
    "locality",
    "postal_town",
    "administrative_area_level_3",
    "sublocality",
    "sublocality_level_1",
    "sublocality_level_2",
  ];

  const rawCandidates: string[] = [];
  for (const type of cityTypes) {
    const comp = findComponent(components, type);
    if (comp?.long_name && !rawCandidates.includes(comp.long_name)) {
      rawCandidates.push(comp.long_name);
    }
    if (
      comp?.short_name &&
      comp.short_name !== comp.long_name &&
      !rawCandidates.includes(comp.short_name)
    ) {
      rawCandidates.push(comp.short_name);
    }
  }

  // If no city component found, check administrative_area_level_2 if not already used as state
  if (rawCandidates.length === 0) {
    const level2 = findComponent(components, "administrative_area_level_2");
    if (level2?.long_name && normalize(level2.long_name) !== normalize(stateName || "")) {
      rawCandidates.push(level2.long_name);
    }
  }

  const allCandidates: string[] = [];
  for (const raw of rawCandidates) {
    const resolved = resolveCityAlias(raw);
    for (const v of cleanCityCandidate(resolved)) {
      if (!allCandidates.includes(v)) {
        allCandidates.push(v);
      }
    }
  }

  // 1. Exact match in city pool
  for (const candidate of allCandidates) {
    const exact = pool.find((c) => normalize(c.name) === normalize(candidate));
    if (exact) return exact.name;
  }

  // 2. Partial match in city pool
  for (const candidate of allCandidates) {
    const needle = normalize(candidate);
    if (needle.length < 3) continue;
    const partial = pool.find((c) => {
      const name = normalize(c.name);
      return name.includes(needle) || needle.includes(name);
    });
    if (partial) return partial.name;
  }

  // 3. Fallback: prefer cleaned variation (e.g. "Santa Rosa" over "City of Santa Rosa")
  const stripped = allCandidates.find((c) => !/^city\s+of\s+/i.test(c) && !/\s+city$/i.test(c));
  return stripped ?? allCandidates[0] ?? "";
}

function buildStreetAddress(components: GoogleAddressComponent[], fallbackName?: string): string {
  const streetParts: string[] = [];

  const streetNumber = findComponent(components, "street_number")?.long_name;
  const route = findComponent(components, "route")?.long_name;
  if (streetNumber && route) {
    streetParts.push(`${streetNumber} ${route}`);
  } else if (route) {
    streetParts.push(route);
  } else if (streetNumber) {
    streetParts.push(streetNumber);
  }

  const premiseTypes = ["premise", "subpremise"] as const;
  for (const type of premiseTypes) {
    const value = findComponent(components, type)?.long_name;
    if (value && !streetParts.some((p) => normalize(p) === normalize(value))) {
      streetParts.push(value);
    }
  }

  const localityTypes = [
    "neighborhood",
    "sublocality_level_2",
    "sublocality_level_1",
    "sublocality",
  ] as const;
  for (const type of localityTypes) {
    const value = findComponent(components, type)?.long_name;
    if (value && !streetParts.some((p) => normalize(p) === normalize(value))) {
      streetParts.push(value);
    }
  }

  if (streetParts.length > 0) return streetParts.join(", ");
  if (fallbackName?.trim()) return fallbackName.trim();
  return "";
}

/**
 * Maps Google Places address_components onto form-friendly fields,
 * aligning country/state/city names with `country-state-city` dropdowns.
 */
export function parsePlaceAddress(input: {
  addressComponents?: GoogleAddressComponent[];
  formattedAddress?: string;
  name?: string;
}): ParsedPlaceAddress {
  const components = input.addressComponents ?? [];
  const country = matchCountry(components);
  const state = country ? matchState(country.isoCode, components) : null;
  const city = country ? matchCity(country.isoCode, state, components) : "";
  let postalCode =
    findComponent(components, "postal_code")?.long_name ||
    findComponent(components, "postal_code_prefix")?.long_name ||
    "";

  if (!postalCode && input.formattedAddress) {
    const match = input.formattedAddress.match(/\b\d{4,6}\b/);
    if (match) {
      postalCode = match[0];
    }
  }

  return {
    streetAddress: buildStreetAddress(components, input.name),
    country: country?.name ?? "",
    countryCode: country?.isoCode ?? "",
    state: state?.name ?? "",
    stateCode: state?.isoCode ?? "",
    city,
    postalCode,
    formattedAddress: input.formattedAddress ?? "",
    name: input.name,
  };
}
