import { useApiMutation } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { RecycleEntityType } from "./use-get-recycled-data";

export function useRestoreEntity(entityType: RecycleEntityType, id: string) {
  const queryClient = useQueryClient();

  const urlMap: Record<RecycleEntityType, string> = {
    users: USER_MANAGEMENT_ENDPOINTS.RESTORE_USER(id),
    stores: STORE_ENDPOINTS.RESTORE_STORE(id),
    items: CATALOGUE_MANAGEMENT_ENDPOINTS.RESTORE_ITEM(id),
    categories: CATALOGUE_MANAGEMENT_ENDPOINTS.RESTORE_CATEGORY(id),
    "city-managers": CITY_MANAGER_ENDPOINTS.RESTORE_CITY_MANAGER(id),
    "country-managers": COUNTRY_MANAGER_ENDPOINTS.RESTORE_COUNTRY_MANAGER(id),
    employees: EMPLOYEE_ENDPOINTS.RESTORE_EMPLOYEE(id),
    "partner-leads": PARTNER_LEAD_ENDPOINTS.RESTORE_LEAD(id),
    "product-boxes": CATALOGUE_MANAGEMENT_ENDPOINTS.RESTORE_PRODUCT_BOX(id),
    "sub-admins": SUB_ADMIN_ENDPOINTS.RESTORE_SUB_ADMIN(id),
  };

  return useApiMutation<{ message: string }, void>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
      if (entityType === "sub-admins") {
        queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
      }
    },
  });
}

export function usePermanentDeleteEntity(entityType: RecycleEntityType, id: string) {
  const queryClient = useQueryClient();

  const urlMap: Record<RecycleEntityType, string> = {
    users: USER_MANAGEMENT_ENDPOINTS.PERMANENT_DELETE_USER(id),
    stores: STORE_ENDPOINTS.PERMANENT_DELETE_STORE(id),
    items: CATALOGUE_MANAGEMENT_ENDPOINTS.PERMANENT_DELETE_ITEM(id),
    categories: CATALOGUE_MANAGEMENT_ENDPOINTS.PERMANENT_DELETE_CATEGORY(id),
    "city-managers": CITY_MANAGER_ENDPOINTS.PERMANENT_DELETE_CITY_MANAGER(id),
    "country-managers": COUNTRY_MANAGER_ENDPOINTS.PERMANENT_DELETE_COUNTRY_MANAGER(id),
    employees: EMPLOYEE_ENDPOINTS.PERMANENT_DELETE_EMPLOYEE(id),
    "partner-leads": PARTNER_LEAD_ENDPOINTS.PERMANENT_DELETE_LEAD(id),
    "product-boxes": CATALOGUE_MANAGEMENT_ENDPOINTS.PERMANENT_DELETE_PRODUCT_BOX(id),
    "sub-admins": SUB_ADMIN_ENDPOINTS.PERMANENT_DELETE_SUB_ADMIN(id),
  };

  return useApiMutation<{ message: string }, void>("delete", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
      if (entityType === "sub-admins") {
        queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
      }
    },
  });
}

export function useBulkRestoreEntities(entityType: RecycleEntityType) {
  const queryClient = useQueryClient();

  const urlMap: Record<RecycleEntityType, string> = {
    users: USER_MANAGEMENT_ENDPOINTS.BULK_RESTORE_USERS(),
    stores: STORE_ENDPOINTS.BULK_RESTORE_STORES,
    items: CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_RESTORE_ITEMS,
    categories: CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_RESTORE_CATEGORIES,
    "city-managers": CITY_MANAGER_ENDPOINTS.BULK_RESTORE_CITY_MANAGERS,
    "country-managers": COUNTRY_MANAGER_ENDPOINTS.BULK_RESTORE_COUNTRY_MANAGERS,
    employees: EMPLOYEE_ENDPOINTS.BULK_RESTORE_EMPLOYEES,
    "partner-leads": PARTNER_LEAD_ENDPOINTS.BULK_RESTORE_LEADS,
    "product-boxes": CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_RESTORE_PRODUCT_BOXES,
    "sub-admins": SUB_ADMIN_ENDPOINTS.BULK_RESTORE_SUB_ADMINS,
  };

  return useApiMutation<{ message: string }, { ids: string[] }>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
      if (entityType === "sub-admins") {
        queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
      }
    },
  });
}

export function useBulkPermanentDeleteEntities(entityType: RecycleEntityType) {
  const queryClient = useQueryClient();

  const urlMap: Record<RecycleEntityType, string> = {
    users: USER_MANAGEMENT_ENDPOINTS.BULK_PERMANENT_DELETE_USERS(),
    stores: STORE_ENDPOINTS.BULK_PERMANENT_DELETE_STORES,
    items: CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_PERMANENT_DELETE_ITEMS,
    categories: CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_PERMANENT_DELETE_CATEGORIES,
    "city-managers": CITY_MANAGER_ENDPOINTS.BULK_PERMANENT_DELETE_CITY_MANAGERS,
    "country-managers": COUNTRY_MANAGER_ENDPOINTS.BULK_PERMANENT_DELETE_COUNTRY_MANAGERS,
    employees: EMPLOYEE_ENDPOINTS.BULK_PERMANENT_DELETE_EMPLOYEES,
    "partner-leads": PARTNER_LEAD_ENDPOINTS.BULK_PERMANENT_DELETE_LEADS,
    "product-boxes": CATALOGUE_MANAGEMENT_ENDPOINTS.BULK_PERMANENT_DELETE_PRODUCT_BOXES,
    "sub-admins": SUB_ADMIN_ENDPOINTS.BULK_PERMANENT_DELETE_SUB_ADMINS,
  };

  return useApiMutation<{ message: string }, { ids: string[] }>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
      if (entityType === "sub-admins") {
        queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
      }
    },
  });
}
