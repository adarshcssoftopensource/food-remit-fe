export type StoreStatus = "Active" | "Inactive";

export type StoreData = {
  id: string;
  storeImage: string;
  storeName: string;
  storeAddress: string;
  address2?: string;
  storeCountry: string;
  storeCountryName: string;
  storeCity: string;
  storeCityName: string;
  storePhoneCode: string;
  storePhoneNumber: string;
  storeTax: number;
  foodRemitCommission: number;
  status: StoreStatus;
  createdAt: string;
  managerId: string;
  managerImage: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmail: string;
  managerPhoneCode: string;
  managerPhoneNumber: string;
  managerAddress: string;
  managerCountry: string;
  managerState: string;
  managerCity: string;
  managerZipCode: string;
};

export interface CreateStoreManagerPayload {
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  managerStatus?: string;
  image?: string;
  zipcode?: string;
}

export interface CreateStorePayload {
  storeImage?: string;
  storeName: string;
  storeCountryCode?: string;
  storePhoneNumber?: string;
  storeAddress?: string;
  storeAddress2?: string;
  country?: string;
  city?: string;
  storeTax?: number;
  foodRemitCommission?: number;
  status?: string;
  assignedStoreManager?: string;
}

export interface CreateStoreManagerResponse {
  message: string;
  status: boolean;
  data: { id: string; [key: string]: unknown };
}

export interface CreateStoreResponse {
  message: string;
  status: boolean;
  data: { id: string; [key: string]: unknown };
}

export interface RawStoreManager {
  id?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

export interface RawStore {
  id: string;
  storeImage?: string;
  storeName: string;
  storeAddress?: string;
  storeAddress2?: string;
  country?: string;
  countryName?: string | null;
  city?: string;
  cityName?: string | null;
  storeCountryCode?: string;
  storePhoneNumber?: string;
  storeTax?: number;
  foodRemitCommission?: number;
  status?: string;
  addedOn?: string;
  storeManager?: RawStoreManager;
}

export interface StoreListResponse {
  data: RawStore[];
  pagination?: unknown;
  message: string;
  status: boolean;
}

export interface SingleStoreResponse {
  data: RawStore;
  message: string;
  status: boolean;
}

export interface UseGetStoresArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
