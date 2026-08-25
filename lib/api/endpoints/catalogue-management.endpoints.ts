export const CATALOGUE_MANAGEMENT_ENDPOINTS = {
  // Departments
  GET_DEPARTMENTS: "/admin/departments",
  GET_DEPARTMENT: (id: string) => `/admin/departments/${id}`,
  CREATE_DEPARTMENT: "/admin/departments",
  UPDATE_DEPARTMENT: (id: string) => `/admin/departments/${id}`,
  UPDATE_DEPARTMENT_STATUS: (id: string) => `/admin/departments/${id}/status`,
  DELETE_DEPARTMENT: (id: string) => `/admin/departments/${id}`,
  GET_DEPARTMENT_LOGS: (id: string) => `/admin/departments/${id}/logs`,
  GET_DEPARTMENTS_DROPDOWN: "/admin/departments/dropdown",

  // Categories
  GET_CATEGORIES: "/admin/categories",
  GET_CATEGORY: (id: string) => `/admin/categories/${id}`,
  CREATE_CATEGORY: "/admin/categories",
  UPDATE_CATEGORY: (id: string) => `/admin/categories/${id}`,
  UPDATE_CATEGORY_STATUS: (id: string) => `/admin/categories/${id}/status`,
  DELETE_CATEGORY: (id: string) => `/admin/categories/${id}`,

  // Items
  GET_ITEMS: "/admin/items",
  GET_ITEM: (
    id: string,
    params?: {
      countryId?: string;
      countryCode?: string;
      countryName?: string;
      dialCode?: string;
    },
  ) => {
    const qs = new URLSearchParams();
    if (params?.countryId) qs.set("countryId", params.countryId);
    if (params?.countryCode) qs.set("countryCode", params.countryCode);
    if (params?.countryName) qs.set("countryName", params.countryName);
    if (params?.dialCode) qs.set("dialCode", params.dialCode);
    const q = qs.toString();
    return q ? `/admin/items/${id}?${q}` : `/admin/items/${id}`;
  },
  CREATE_ITEM: "/admin/items",
  UPDATE_ITEM: (id: string) => `/admin/items/${id}`,
  UPDATE_ITEM_STATUS: (id: string) => `/admin/items/${id}/status`,
  DELETE_ITEM: (id: string) => `/admin/items/${id}`,
};
