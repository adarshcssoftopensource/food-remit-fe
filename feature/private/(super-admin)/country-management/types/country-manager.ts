export type CountryManagerStatus = "Active" | "Inactive";

export type AssignedCityManagerItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
  managerStatus: string;
  country?: string | null;
  assignCities?: string | null;
};

export type CountryManagerData = {
  id: string;
  userId: string;
  image?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2?: string | null;
  residentialCountry: string;
  state: string;
  city: string;
  zipcode: string;
  assignCountryName: string;
  assignedCountry?: string | null;
  assignedCityManagers: string[];
  cityManagers: AssignedCityManagerItem[];
  createdAt: string;
  status: CountryManagerStatus;
};

export interface CountryManagerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  assignCountries?: string;
  managerStatus?: string;
  image?: string;
}

export interface UpdateCountryManagerPayload extends CountryManagerPayload {
  id: string;
}

export interface RawCountryManagerCityManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
  managerStatus: string;
  country?: string | null;
  assignCities?: string | null;
}

export interface RawCountryManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  image?: string | null;
  zipcode?: string | null;
  uniqueToken?: string | null;
  sessionToken?: string | null;
  countryCode?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  address2?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  managerStatus?: string | null;
  changePasswordStatus?: boolean | null;
  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  cityManagers?: RawCountryManagerCityManager[];
  assignCountries?: string | null;
  assignCountryName?: string | null;
}

export interface CountryManagerListResponse {
  data: RawCountryManager[];
  message: string;
  status: boolean;
}

export interface CountryManagerMutationResponse {
  message: string;
  status: boolean;
  data: { id: string };
}

export interface SingleCountryManagerResponse {
  message: string;
  status: boolean;
  data: RawCountryManager;
}

export interface UseGetCountryManagersArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  fromDate?: string;
  toDate?: string;
  countryId?: string;
}
