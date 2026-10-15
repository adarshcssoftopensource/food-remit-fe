export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CO_ADMIN: "CO_ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  STORE_ADMIN: "STORE_ADMIN",
  EMPLOYEE: "EMPLOYEE",
  PHILANTHROPIST: "PHILANTHROPIST",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRoleCode = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isSuperAdminRole(roleCode?: string | null, role?: string | null): boolean {
  const code = (roleCode || "").toUpperCase();
  const r = (role || "").toLowerCase();
  return code === "SUPER_ADMIN" || code === "CO_ADMIN" || r === "super_admin" || r === "co_admin";
}

export function isStoreManagerRole(roleCode?: string | null, role?: string | null): boolean {
  const code = (roleCode || "").toUpperCase();
  const r = (role || "").toLowerCase();
  return (
    code === "STORE_MANAGER" ||
    code === "STORE_ADMIN" ||
    r === "store_manager" ||
    r === "store_admin"
  );
}

export function isEmployeeRole(roleCode?: string | null, role?: string | null): boolean {
  const code = (roleCode || "").toUpperCase();
  const r = (role || "").toLowerCase();
  return code === "EMPLOYEE" || r === "employee";
}

/**
 * Checks if a user belongs to store-scoped operations (Store Manager or Employee).
 */
export function isStoreScopedRole(roleCode?: string | null, role?: string | null): boolean {
  return isStoreManagerRole(roleCode, role) || isEmployeeRole(roleCode, role);
}
