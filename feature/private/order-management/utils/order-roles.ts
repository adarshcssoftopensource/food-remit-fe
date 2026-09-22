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
  const isSuperAdmin = upper === "SUPER_ADMIN" || lower === "super_admin";
  const isElevated =
    ["SUPER_ADMIN", "SUB_ADMIN", "CO_ADMIN", "COUNTRY_MANAGER", "CITY_MANAGER"].includes(upper) ||
    ["super_admin", "sub_admin", "co_admin", "country_manager", "city_manager"].includes(lower);

  /**
   * Assign Order = Store Manager only (UC-02).
   * Super Admin / elevated roles can view orders but cannot assign.
   */
  const canAssign = isStoreManager;

  /**
   * Abandon / Mark Abandoned = Store Manager only.
   * Super Admin cannot abandon.
   */
  const canAbandon = isStoreManager;

  /**
   * Manual Mark as Picked Up = Store Manager or Employee (own orders).
   * Super Admin cannot mark picked up.
   */
  const canMarkPickedUp = isStoreManager || isEmployee;

  /** Can complete Processing orders (employee own / manager any). SA may still complete. */
  const canOverrideLifecycle = isElevated || isStoreManager;

  return {
    role,
    isEmployee,
    isStoreManager,
    isSuperAdmin,
    isElevated,
    canAssign,
    canAbandon,
    canMarkPickedUp,
    canOverrideLifecycle,
  };
}
