export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
  email: string;
  contactNumber: string;
  registeredOn: string;
  country: string;
  state: string;
  city: string;
  status: "Active" | "Inactive";
  image?: string;
};

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersResponse {
  message: string;
  stats: UserStats;
  data: UserData[];
  pagination: PaginationMeta;
}

export type UseGetUsersArgs = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
};
