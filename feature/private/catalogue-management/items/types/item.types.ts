export type ItemStatus = "ACTIVE" | "INACTIVE";

export interface ItemData {
  id: string;
  productName: string;
  description?: string | null;
  productInfo?: string | null;
  nutritionInfo?: string | null;
  upcCode?: string | null;
  baseQuantity?: number | null;
  unit?: string | null;
  discountPercentage?: number | null;

  productImage?: string | null;
  productInfoImage?: string | null;
  nutritionInfoImage?: string | null;

  productImageUrl?: string | null;
  productInfoImageUrl?: string | null;
  nutritionInfoImageUrl?: string | null;

  status: ItemStatus;
  adminShare: boolean;
  discountAvailability: boolean;

  countryId: string;
  departmentId: string;
  categoryId: string;

  country?: { id: string; name: string };
  department?: { id: string; departmentName: string };
  category?: { id: string; categoryName: string };

  createdAt: string;
  updatedAt: string;
}

export interface UseGetItemsArgs {
  search?: string;
  countryId?: string;
  departmentId?: string;
  categoryId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetItemsResponse {
  message: string;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  data: ItemData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateItemPayload {
  countryId: string;
  departmentId: string;
  categoryId: string;
  productName: string;
  description?: string;
  productInfo?: string;
  nutritionInfo?: string;
  upcCode?: string;
  baseQuantity?: number;
  unit?: string;
  discountPercentage?: number;
  status?: ItemStatus;
  productImageFile?: File | string | null;
  productInfoImageFile?: File | string | null;
  nutritionInfoImageFile?: File | string | null;
}

export type UpdateItemPayload = Partial<CreateItemPayload>;
