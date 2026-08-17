export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  createdAt: string;
  userStatus: "ACTIVE" | "INACTIVE";
  profileImage?: string;
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
