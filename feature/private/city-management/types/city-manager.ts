export type CityManagerStatus = "Active" | "Inactive";

export type CityManagerData = {
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
  /** Resolved country name (from countryName BE field) */
  countryName: string;
  /** Resolved city names (from assignCityNames BE field) */
  assignedCityNames: string[];
  /** Raw country ID */
  country: string;
  /** Raw city IDs */
  assignedCities: string[];
  createdAt: string;
  status: CityManagerStatus;
  countryManagerId: string;
};

// ── API payload types ─────────────────────────────────────────────────────────
export interface CityManagerPayload {
  countryManagerId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  residentialCountry?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  assignCities?: string;
  managerStatus?: string;
  image?: string;
}

export interface UpdateCityManagerPayload extends CityManagerPayload {
  id: string;
}

// ── API response types ────────────────────────────────────────────────────────
export interface RawCityManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  address2?: string | null;
  residentialCountry?: string | null;
  state?: string | null;
  city?: string | null;
  zipcode?: string | null;
  /** Raw country ID from BE */
  country?: string | null;
  /** Resolved country name from BE */
  countryName?: string | null;
  /** Raw city IDs from BE */
  assignCities?: string | null;
  /** Resolved city names from BE */
  assignCityNames?: string[];
  managerStatus?: string | null;
  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  image?: string | null;
  countryManagerId: string;
}

export interface CityManagerListResponse {
  data: RawCityManager[];
  message: string;
  status: boolean;
}

export interface CityManagerMutationResponse {
  message: string;
  status: boolean;
  data: { id: string };
}

export interface SingleCityManagerResponse {
  message: string;
  status: boolean;
  data: RawCityManager;
}

export interface UseGetCityManagersArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
