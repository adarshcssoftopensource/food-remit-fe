import { Box, CheckCircle, Package, Tag, XCircle } from "lucide-react";

export type CatalogueStatus = "Active" | "Inactive";

export type DepartmentData = {
  id: string;
  name: string;
  icon?: string;
  country: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;
};

export type CategoryData = {
  id: string;
  name: string;
  icon?: string;
  departmentId: string;
  departmentName: string;
  country: string;
  city: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;
};

export type ItemData = {
  id: string;
  productName: string;
  storeName: string;
  icon?: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  country: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;

  // New switches
  availability: boolean;
  adminShare: boolean;
  discountAvailability: boolean;

  // New form fields
  description?: string;
  upcCode?: string;
  productInfo?: string;
  productInfoImage?: string;
  nutritionInfo?: string;
  nutritionInfoImage?: string;
  discountPercentage?: number;
  baseQuantity?: number;
  unit?: string;
};

export const CATALOGUE_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export { DEPARTMENT_STAT_CONFIG } from "@/feature/private/(super-admin)/catalogue-management/departments/constants/department.constants";
export { CATEGORY_STAT_CONFIG } from "@/feature/private/(super-admin)/catalogue-management/categories/constants/category.constants";
export { ITEM_STAT_CONFIG } from "@/feature/private/(super-admin)/catalogue-management/items/constants/item.constants";
