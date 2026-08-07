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
  contactNumber: string;
  status: "Active" | "Inactive";
  createdAt: string;
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

// ─── PATCH: Update Sub Admin ───────────────────────────────────────────────

export interface UpdateSubAdminPayload {
  name: string;
  countryCode: string;
  email: string;
  phoneNumber: string;
  permissions: Array<{ key: string }>;
}

export interface UpdateSubAdminStatusPayload {
  status: 0 | 1;
}

export interface UpdateSubAdminResponse {
  message: string;
}
