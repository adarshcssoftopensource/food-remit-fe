export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface DepartmentData {
  id: string;
  departmentName: string;
  displayName?: string | null;
  country?: {
    id: string;
    name: string;
  };
  departmentIcon?: string | null;
  departmentIconUrl?: string | null;
  status: DepartmentStatus;

  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;

  countryName?: string | null;
  cityName?: string | null;
  storeId?: string | null;
  storeName?: string | null;
  parentDepartmentName?: string | null;
  createdBy?: string | null;
  isGlobal?: boolean;
  scopeType?: "global" | "city" | "store";
  scopeLabel?: string | null;
  cityId?: string | null;

  city?: { id: string; name: string } | null;
  store?: { id: string; storeName: string } | null;
  parent?: { id: string; departmentName: string } | null;
  children?: any[];
}

export interface DepartmentDropdownItem {
  id: string;
  name?: string;
  departmentName?: string;
  displayName?: string;
  cityId?: string | null;
  cityName?: string | null;
  storeId?: string | null;
  storeName?: string | null;
  isGlobal?: boolean;
  scopeLabel?: string | null;
  createdBy?: string | null;
}

export interface UseGetDepartmentsArgs {
  search?: string;
  countryId?: string;
  cityId?: string;
  storeId?: string;
  parentId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetDepartmentsResponse {
  message: string;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  data: DepartmentData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDepartmentPayload {
  departmentName: string;
  countryId: string;
  cityId?: string;
  storeId?: string;
  parentId?: string;
  departmentIcon?: File | string | null;
  status?: DepartmentStatus;
}

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;
