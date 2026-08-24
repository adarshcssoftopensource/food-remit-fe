import { City, Country, type ICity, type ICountry } from "country-state-city";

export function countryFlag(isoCode?: string | null): string | null {
  if (!isoCode || isoCode.length !== 2) return null;
  try {
    return String.fromCodePoint(...[...isoCode.toUpperCase()].map((l) => 127397 + l.charCodeAt(0)));
  } catch {
    return null;
  }
}

export type WorldCountryOption = {
  name: string;
  isoCode: string;
  phonecode: string;
  currency: string;
  latitude: string;
  longitude: string;
  flag: string | null;
};

export type WorldCityOption = {
  name: string;
  stateCode: string;
  countryCode: string;
};

const ALL_WORLD_COUNTRIES: WorldCountryOption[] = Country.getAllCountries()
  .map((country) => ({
    name: country.name,
    isoCode: country.isoCode,
    phonecode: country.phonecode,
    currency: country.currency,
    latitude: country.latitude,
    longitude: country.longitude,
    flag: countryFlag(country.isoCode),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const COUNTRIES_BY_NAME = new Map(
  ALL_WORLD_COUNTRIES.map((country) => [country.name.toLowerCase(), country]),
);

const COUNTRIES_BY_ISO = new Map(ALL_WORLD_COUNTRIES.map((country) => [country.isoCode, country]));

export function getAllWorldCountries() {
  return ALL_WORLD_COUNTRIES;
}

export function findWorldCountryByName(name?: string | null) {
  if (!name) return null;
  return COUNTRIES_BY_NAME.get(name.trim().toLowerCase()) ?? null;
}

export function findWorldCountryByIso(isoCode?: string | null) {
  if (!isoCode) return null;
  return COUNTRIES_BY_ISO.get(isoCode.toUpperCase()) ?? null;
}

export function resolveWorldCountryIsoCode(
  countryName?: string | null,
  countryCode?: string | null,
): string | null {
  if (countryCode && COUNTRIES_BY_ISO.has(countryCode.toUpperCase())) {
    return countryCode.toUpperCase();
  }
  return findWorldCountryByName(countryName)?.isoCode ?? null;
}

export function getWorldCitiesByCountryIso(isoCode?: string | null): WorldCityOption[] {
  if (!isoCode) return [];
  return (City.getCitiesOfCountry(isoCode.toUpperCase()) ?? [])
    .map((city) => ({
      name: city.name,
      stateCode: city.stateCode,
      countryCode: city.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findWorldCity(countryIso: string, cityName?: string | null) {
  if (!countryIso || !cityName) return null;
  const normalized = cityName.trim().toLowerCase();
  return (
    getWorldCitiesByCountryIso(countryIso).find((city) => city.name.toLowerCase() === normalized) ??
    null
  );
}

export function toCreateCountryPayload(country: WorldCountryOption) {
  return {
    name: country.name,
    countryCode: country.isoCode,
    currency: country.currency,
    latitude: country.latitude,
    longitude: country.longitude,
  };
}

export function mapCountryPackageItem(country: ICountry): WorldCountryOption {
  return {
    name: country.name,
    isoCode: country.isoCode,
    phonecode: country.phonecode,
    currency: country.currency,
    latitude: country.latitude,
    longitude: country.longitude,
    flag: countryFlag(country.isoCode),
  };
}

export function mapCityPackageItem(city: ICity): WorldCityOption {
  return {
    name: city.name,
    stateCode: city.stateCode,
    countryCode: city.countryCode,
  };
}
