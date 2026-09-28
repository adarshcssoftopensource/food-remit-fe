export interface SubAdminPermission {
  key: string;
  label: string;
}

export interface AssignedSubAdminPermission {
  key: string;
  value: string;
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
  countryCode?: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  createdAt: string;
  role: string;
  userType: string;
  permissions: AssignedSubAdminPermission[];
};

export interface CreateSubAdminPayload {
  name: string;
  countryCode: string;
  email: string;
  phoneNumber: string;
  permissions: Array<{
    key: string;
  }>;
  isCoAdmin?: boolean;
}

export interface CreateSubAdminResponse {
  message: string;
}

export interface SubAdminStats {
  total: number;
  active: number;
  inactive: number;
  avgPermissions: number;
  subAdmins?: number;
  coAdmins?: number;
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

export type UseGetSubAdminsArgs = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
};

// ─── PATCH: Update Sub Admin ───────────────────────────────────────────────

export interface UpdateSubAdminPayload {
  name: string;
  countryCode: string;
  email: string;
  phoneNumber: string;
  permissions: Array<{ key: string }>;
  isCoAdmin?: boolean;
}

export interface UpdateSubAdminStatusPayload {
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "DENIED";
}

export interface UpdateSubAdminResponse {
  message: string;
}
