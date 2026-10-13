export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type SortOrder = "asc" | "desc";

export type BaseStatus = "ACTIVE" | "INACTIVE";
