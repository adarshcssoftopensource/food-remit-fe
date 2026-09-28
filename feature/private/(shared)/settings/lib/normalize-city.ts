import type { CityData } from "../types/settings.types";

export function normalizeCity(raw: Record<string, unknown>): CityData {
  const name = String(raw.name ?? raw.cityName ?? "");
  const countryName = raw.countryName
    ? String(raw.countryName)
    : raw.country && typeof raw.country === "object" && "name" in raw.country
      ? String((raw.country as Record<string, unknown>).name)
      : null;

  return {
    id: String(raw.id ?? ""),
    name,
    cityName: name,
    countryId: String(raw.countryId ?? ""),
    countryName,
    countryCode: raw.countryCode ? String(raw.countryCode) : null,
    currency: raw.currency ? String(raw.currency) : null,
    stateId: raw.stateId ? String(raw.stateId) : null,
    addedOn: raw.addedOn ? String(raw.addedOn) : new Date().toISOString(),
    totalDepartments: Number(raw.totalDepartments ?? 0),
    isAssigned: Boolean(raw.isAssigned),
  };
}
