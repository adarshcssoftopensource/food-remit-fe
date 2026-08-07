import { ROUTES } from "./routes";

export const ROUTE_PERMISSION_MAP: Record<string, string> = {
  [ROUTES.ADMIN.USERS_MANAGEMENT]: "userManagement",
  [ROUTES.ADMIN.FOUNDATION_MANAGEMENT]: "organization",
  [ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT]: "philanthropistsManagement",
  [ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT]: "userManagement",
  [ROUTES.ADMIN.STORIES.LIST]: "contentManagement",
  [ROUTES.ADMIN.STORIES.ADD]: "contentManagement",
  [ROUTES.ADMIN.DONATION_LOGS]: "donationLogs",
  [ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ROOT]: "catalogueManagement",
  [ROUTES.ADMIN.STORE_MANAGEMENT.ROOT]: "storeManagement",
  [ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT]: "countryManagement",
  [ROUTES.ADMIN.CITY_MANAGEMENT.ROOT]: "cityManagement",
  [ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT]: "storeManagement",
  [ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT]: "contentManagement",
  [ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT]: "ticketManagement",
  [ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT]: "reportManagement",
  [ROUTES.ADMIN.FEEDBACK_MANAGEMENT]: "feedbacks",
  [ROUTES.ADMIN.SEND_NOTIFICATION]: "sendNotifications",
  [ROUTES.ADMIN.COUPONS_MANAGEMENT]: "couponManagement",
  [ROUTES.ADMIN.AMOUNT_LIMIT_MANAGEMENT]: "amountLimits",
  [ROUTES.ADMIN.CREDITS_MANAGEMENT.PENDING_CREDITS]: "creditsManagement",
  [ROUTES.ADMIN.TUTORIAL_MANAGEMENT]: "contentManagement",
};

/**
 * Verifies if the admin has permission to access a specific route pathname.
 * Super Admins always have access to everything.
 */
export function hasPathPermission(
  pathname: string,
  permissions: Record<string, number> | null | undefined,
  isSuperAdmin: boolean = false,
): boolean {
  if (isSuperAdmin) return true;

  // Sub-admins must have at least one active permission to access any route (including dashboard)
  if (!permissions) return false;
  const hasAnyPermission = Object.values(permissions).some((val) => val === 1);
  if (!hasAnyPermission) return false;

  // Find the matching permission key by matching path prefixes
  const matchedKey = Object.keys(ROUTE_PERMISSION_MAP)
    .sort((a, b) => b.length - a.length) // check longer prefixes first (e.g. nested routes)
    .find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!matchedKey) {
    // If route doesn't have a configured permission key, it's open to all authenticated admins
    return true;
  }

  const permissionKey = ROUTE_PERMISSION_MAP[matchedKey];
  const safePermissions = permissions || {};
  return safePermissions[permissionKey] === 1;
}
