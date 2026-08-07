export interface SubAdminPermission {
  key: string;
  label: string;
}

export interface GetSubAdminPermissionsResponse {
  message: string;
  data: SubAdminPermission[];
}

export type SubAdminData = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  contactNumber: string;
  address: string;
  status: "Active" | "Inactive";
  createdAt: string;
  permissions: any[];
};

export interface CreateSubAdminPayload {
  name: string;
  countryCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  permission: Array<{
    key: string;
  }>;
}

export interface CreateSubAdminResponse {
  message: string;
}

export interface SubAdminStats {
  total: number;
  active: number;
  inactive: number;
  avgPermissions: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSubAdminsResponse {
  message: string;
  stats: SubAdminStats;
  data: SubAdminData[];
  pagination: PaginationMeta;
}
