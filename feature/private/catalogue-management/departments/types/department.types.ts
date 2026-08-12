export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface DepartmentData {
  id: string;
  departmentName: string;
  countryId: string;
  country?: {
    id: string;
    name: string;
  };
  cityId?: string | null;
  parentId?: string | null;
  departmentIcon?: string | null;
  departmentIconUrl?: string | null;
  status: DepartmentStatus;

  createdById?: string | null;
  createdByType?: number | null;
  editedById?: string | null;
  editedBy?: number | null;

  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  modifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;

  countryName?: string | null;
  cityName?: string | null;
  parentDepartmentName?: string | null;
  createdRoleLabel?: string | null;

  city?: { id: string; name: string } | null;
  parent?: { id: string; departmentName: string } | null;
  children?: any[];
}

export interface UseGetDepartmentsArgs {
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
  parentId?: string;
  departmentIcon?: File | string | null;
  status?: DepartmentStatus;
}

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;
