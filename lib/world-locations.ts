import { City, Country, State, type ICity, type ICountry, type IState } from "country-state-city";

export function countryFlag(isoCode?: string | null): string | null {
  if (!isoCode || isoCode.length !== 2) return null;
  try {
    return String.fromCodePoint(...[...isoCode.toUpperCase()].map((l) => 127397 + l.charCodeAt(0)));
  } catch {
    return null;
  }
}

export type WorldStateOption = {
  name: string;
  isoCode: string;
  countryCode: string;
};

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

export function getWorldStatesByCountryIso(isoCode?: string | null): WorldStateOption[] {
  if (!isoCode) return [];
  return (State.getStatesOfCountry(isoCode.toUpperCase()) ?? [])
    .map((state) => ({
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findWorldState(countryIso: string, stateNameOrCode?: string | null) {
  if (!countryIso || !stateNameOrCode) return null;
  const normalized = stateNameOrCode.trim().toLowerCase();
  return (
    getWorldStatesByCountryIso(countryIso).find(
      (s) => s.name.toLowerCase() === normalized || s.isoCode.toLowerCase() === normalized,
    ) ?? null
  );
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

export function getWorldCitiesByCountryAndState(
  isoCode?: string | null,
  stateCode?: string | null,
): WorldCityOption[] {
  if (!isoCode) return [];
  if (stateCode) {
    const stateCities = (City.getCitiesOfState(isoCode.toUpperCase(), stateCode) ?? []).map(
      (city) => ({
        name: city.name,
        stateCode: city.stateCode,
        countryCode: city.countryCode,
      }),
    );
    if (stateCities.length > 0) {
      return stateCities.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  return getWorldCitiesByCountryIso(isoCode);
}

export function findWorldCity(
  countryIso: string,
  cityName?: string | null,
  stateCode?: string | null,
) {
  if (!countryIso || !cityName) return null;
  const normalized = cityName.trim().toLowerCase();
  const pool = stateCode
    ? getWorldCitiesByCountryAndState(countryIso, stateCode)
    : getWorldCitiesByCountryIso(countryIso);
  return pool.find((city) => city.name.toLowerCase() === normalized) ?? null;
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
