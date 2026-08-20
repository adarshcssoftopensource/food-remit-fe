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

function componentValues(components: GoogleAddressComponent[], types: string[]): string[] {
  const values: string[] = [];
  for (const type of types) {
    const match = findComponent(components, type);
    if (match?.long_name) values.push(match.long_name);
    if (match?.short_name && match.short_name !== match.long_name) {
      values.push(match.short_name);
    }
  }
  return values;
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

  const stateComp = findComponent(components, "administrative_area_level_1");
  if (!stateComp) return null;

  const byCode = states.find((s) => s.isoCode.toUpperCase() === stateComp.short_name.toUpperCase());
  if (byCode) return { name: byCode.name, isoCode: byCode.isoCode };

  const byName = states.find((s) => normalize(s.name) === normalize(stateComp.long_name));
  if (byName) return { name: byName.name, isoCode: byName.isoCode };

  return null;
}

function resolveCityAlias(candidate: string): string {
  return CITY_ALIASES[normalize(candidate)] ?? candidate;
}

function matchCity(
  countryIso: string,
  stateIso: string,
  components: GoogleAddressComponent[],
): string {
  const cities = City.getCitiesOfState(countryIso, stateIso);
  if (!cities.length) return "";

  const candidates = componentValues(components, [
    "locality",
    "postal_town",
    "sublocality",
    "sublocality_level_1",
    "administrative_area_level_3",
    "administrative_area_level_2",
  ]).map(resolveCityAlias);

  for (const candidate of candidates) {
    const exact = cities.find((c) => normalize(c.name) === normalize(candidate));
    if (exact) return exact.name;
  }

  for (const candidate of candidates) {
    const needle = normalize(candidate);
    if (needle.length < 3) continue;
    const partial = cities.find((c) => {
      const name = normalize(c.name);
      return name.includes(needle) || needle.includes(name);
    });
    if (partial) return partial.name;
  }

  // Prefer locality / postal_town text even if not in CSC list (Select may still hold value)
  return candidates[0] ?? "";
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
  const city = country && state ? matchCity(country.isoCode, state.isoCode, components) : "";
  const postalCode = findComponent(components, "postal_code")?.long_name ?? "";

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
