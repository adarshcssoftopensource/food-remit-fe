export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface CategoryData {
  id: string;
  categoryName: string;
  countryId?: string | null;
  cityId?: string | null;
  department?: {
    id: string;
    departmentName: string;
    countryId?: string;
    cityId?: string | null;
  };
  categoryIcon?: string | null;
  categoryIconUrl?: string | null;
  status: CategoryStatus;

  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;

  countryName?: string | null;
  cityName?: string | null;
  parentCategoryName?: string | null;
  createdBy?: string | null;
  isGlobal?: boolean;
  scopeType?: "global" | "city";
  scopeLabel?: string | null;
  departmentDisplayName?: string | null;

  city?: { id: string; name: string } | null;
  parent?: { id: string; categoryName: string } | null;
  children?: any[];

  storeId?: string | null;
  store?: { id: string; storeName: string } | null;
  itemCount?: number;
  /** Returned by the category detail endpoint for the item workspace */
  currency?: string | null;
  currencySymbol?: string | null;
  pricingCountry?: { id: string; name: string } | null;
}

/** Category context an item is created in (Category-first workflow) */
export interface ActiveCategory {
  id: string;
  categoryName: string;
  categoryIcon?: string | null;
  currencySymbol?: string | null;
}

export interface CategoryDropdownItem {
  id: string;
  name?: string;
  categoryName?: string;
}

export interface UseGetCategoriesArgs {
  search?: string;
  countryId?: string;
  departmentId?: string;
  cityId?: string;
  parentId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetCategoriesResponse {
  message: string;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  data: CategoryData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCategoryPayload {
  categoryName: string;
  departmentId: string;
  cityId?: string;
  parentId?: string;
  categoryIcon?: File | string | null;
  status?: CategoryStatus;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
