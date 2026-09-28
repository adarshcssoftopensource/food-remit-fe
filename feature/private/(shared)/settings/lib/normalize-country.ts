import type { CountryData } from "../types/settings.types";

export function normalizeCountry(raw: Record<string, unknown>): CountryData {
  const name = String(raw.name ?? raw.countryName ?? "");
  return {
    id: String(raw.id ?? ""),
    name,
    countryName: name,
    countryCode: raw.countryCode ? String(raw.countryCode) : null,
    currency: raw.currency ? String(raw.currency) : null,
    latitude: raw.latitude ? String(raw.latitude) : null,
    longitude: raw.longitude ? String(raw.longitude) : null,
    addedOn: raw.addedOn ? String(raw.addedOn) : new Date().toISOString(),
    addedOnTimestamp: raw.addedOnTimestamp ? String(raw.addedOnTimestamp) : null,
    modifiedOn: raw.modifiedOn ? String(raw.modifiedOn) : null,
    totalCities: Number(raw.totalCities ?? 0),
    totalDepartments: Number(raw.totalDepartments ?? 0),
  };
}
