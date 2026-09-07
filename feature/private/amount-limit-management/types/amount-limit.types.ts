export interface RawAmountLimit {
  id: string;
  countryName: string;
  amount: string;
  currency?: string | null;
  email?: string | null;
  addedOn?: string | null;
  addedOnTimestamp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AmountLimitData {
  id: string;
  countryName: string;
  amount: string;
  currency?: string | null;
  email?: string | null;
  createdAt: string;
}

export interface AmountLimitListResponse {
  message: string;
  status?: boolean;
  data: RawAmountLimit[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AmountLimitDetailResponse {
  message: string;
  status?: boolean;
  data: RawAmountLimit;
}

export interface CreateAmountLimitPayload {
  countryName: string;
  amount: string;
  currency?: string;
  email?: string;
}

export interface UpdateAmountLimitPayload {
  id?: string;
  amount?: string;
  countryName?: string;
  currency?: string;
}

export interface UseGetAmountLimitsArgs {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
