export interface RawCityManager {
  id: string;
  country: string;
  countryName?: string | null;
  firstName: string;
  lastName: string;
  assignCities?: string;
  assignCityNames?: string[];
  managerStatus?: string;
}

export type AvailableCityManager = RawCityManager & { name: string };

export interface RawStore {
  id: string;
  storeName: string;
  country?: string;
  countryId?: string;
  countryName?: string | null;
  city?: string;
  cityId?: string;
  cityName?: string | null;
  assignedCityManager?: string | null;
  cityManager?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  storeAddress?: string;
  status?: string;
}
