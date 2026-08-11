export interface CountryData {
  id: string;
  name: string;
  countryName: string;
  countryCode?: string | null;
  currency?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  addedOn: string;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  totalCities?: number;
  totalDepartments?: number;
}

export interface GetCountriesResponse {
  message: string;
  data: CountryData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCountryPayload {
  name: string;
  countryCode?: string;
  currency?: string;
  latitude?: string;
  longitude?: string;
}

export interface CreateCountryResponse {
  message: string;
  data: CountryData;
}

export interface UpdateCountryPayload {
  name?: string;
  countryCode?: string;
  currency?: string;
  latitude?: string;
  longitude?: string;
}

export interface UpdateCountryResponse {
  message: string;
  data: CountryData;
}

export interface DeleteCountryResponse {
  message: string;
  data: CountryData;
}

export interface UseGetCountriesArgs {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
