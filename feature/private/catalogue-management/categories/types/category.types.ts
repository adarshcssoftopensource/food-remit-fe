export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface CategoryData {
  id: string;
  categoryName: string;
  department?: {
    id: string;
    departmentName: string;
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

  city?: { id: string; name: string } | null;
  parent?: { id: string; categoryName: string } | null;
  children?: any[];
}

export interface UseGetCategoriesArgs {
  search?: string;
  countryId?: string;
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
