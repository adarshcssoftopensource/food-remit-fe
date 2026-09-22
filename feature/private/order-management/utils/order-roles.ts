/** Shared role helpers for order processing UI */
export function getOrderActorRole(
  profile?: {
    role?: string | null;
    roleCode?: string | null;
  } | null,
) {
  const role = String(profile?.roleCode || profile?.role || "");
  const upper = role.toUpperCase();
  const lower = role.toLowerCase();

  const isEmployee = upper === "EMPLOYEE" || lower === "employee";
  const isStoreManager = upper === "STORE_MANAGER" || lower === "store_manager";
  const isElevated =
    ["SUPER_ADMIN", "SUB_ADMIN", "CO_ADMIN", "COUNTRY_MANAGER", "CITY_MANAGER"].includes(upper) ||
    ["super_admin", "sub_admin", "co_admin", "country_manager", "city_manager"].includes(lower);

  /** Can abandon Completed → Abandoned → Closed */
  const canAbandon = isStoreManager || isElevated;
  /** Can complete / pickup any order (not only own) */
  const canOverrideLifecycle = isElevated || isStoreManager;

  return {
    role,
    isEmployee,
    isStoreManager,
    isElevated,
    canAbandon,
    canOverrideLifecycle,
  };
}
