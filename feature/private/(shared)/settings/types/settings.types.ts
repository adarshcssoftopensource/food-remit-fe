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

export interface CountryDropdownItem {
  id: string;
  name: string;
  countryName?: string;
  countryCode?: string | null;
  currency?: string | null;
}

export interface GetCountriesDropdownResponse {
  message: string;
  data: CountryDropdownItem[];
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

// City Types
export interface CityData {
  id: string;
  name: string;
  cityName: string;
  countryId: string;
  countryName?: string | null;
  countryCode?: string | null;
  currency?: string | null;
  stateId?: string | null;
  addedOn: string;
  totalDepartments?: number;
  isAssigned?: boolean;
}

export interface CityDropdownItem {
  id: string;
  name: string;
  cityName?: string;
  countryId: string;
  countryName?: string | null;
  stateId?: string | null;
}

export interface GetCitiesResponse {
  message: string;
  data: CityData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCityPayload {
  name: string;
  countryId: string;
  stateId?: string;
}

export interface CreateCityResponse {
  message: string;
  data: CityData;
}

export interface UpdateCityPayload {
  name?: string;
  countryId?: string;
  stateId?: string;
}

export interface UpdateCityResponse {
  message: string;
  data: CityData;
}

export interface DeleteCityResponse {
  message: string;
  data: {
    id: string;
  };
}

export interface UseGetCitiesArgs {
  countryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  unassignedOnly?: boolean;
  excludeManagerId?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordResponse {
  message: string;
  status: boolean;
}
