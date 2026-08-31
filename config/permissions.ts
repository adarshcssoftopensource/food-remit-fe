import { ROUTES } from "./routes";

/** Routes every authenticated admin may open (account UI), regardless of module permissions. */
export const ALWAYS_ALLOWED_ROUTES = [ROUTES.ADMIN.PROFILE, ROUTES.ADMIN.SETTINGS] as const;

export const ROUTE_PERMISSION_MAP: Record<string, string> = {
  [ROUTES.ADMIN.DASHBOARD]: "dashboard",
  [ROUTES.ADMIN.USERS_MANAGEMENT]: "userManagement",
  [ROUTES.ADMIN.RECYCLE_BIN]: "userManagement",
  [ROUTES.ADMIN.PARTNER_LEADS]: "partnerLeads",
  [ROUTES.ADMIN.FOUNDATION_MANAGEMENT]: "organization",
  [ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT]: "philanthropistsManagement",
  [ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT]: "subAdminManagement",
  [ROUTES.ADMIN.STORIES.LIST]: "stories",
  [ROUTES.ADMIN.STORIES.ADD]: "stories",
  [ROUTES.ADMIN.DONATION_LOGS]: "donationLogs",
  [ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ROOT]: "catalogueManagement",
  [ROUTES.ADMIN.PRODUCT_BOXES]: "productBoxesManagement",
  [ROUTES.ADMIN.STORE_MANAGEMENT.ROOT]: "storeManagement",
  [ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT]: "countryManagement",
  [ROUTES.ADMIN.CITY_MANAGEMENT.ROOT]: "cityManagement",
  [ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT]: "orderManagement",
  [ROUTES.ADMIN.MY_ORDERS]: "myOrders",
  [ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT]: "contentManagement",
  [ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT]: "ticketManagement",
  [ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT]: "reportManagement",
  [ROUTES.ADMIN.FEEDBACK_MANAGEMENT]: "feedbacks",
  [ROUTES.ADMIN.SEND_NOTIFICATION]: "sendNotifications",
  [ROUTES.ADMIN.COUPONS_MANAGEMENT]: "couponManagement",
  [ROUTES.ADMIN.AMOUNT_LIMIT_MANAGEMENT]: "amountLimits",
  "/credits-management": "creditsManagement",
  [ROUTES.ADMIN.TUTORIAL_MANAGEMENT]: "imageManagement",
  [ROUTES.ADMIN.EMPLOYEE_MANAGEMENT]: "employeeManagement",
};

function isAlwaysAllowedRoute(pathname: string): boolean {
  return ALWAYS_ALLOWED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function hasPathPermission(
  pathname: string,
  permissions: Record<string, number | null | undefined> | null | undefined,
  isSuperAdmin: boolean = false,
): boolean {
  // Explicitly deny Employee Management for super admin
  if (
    isSuperAdmin &&
    (pathname === ROUTES.ADMIN.EMPLOYEE_MANAGEMENT ||
      pathname.startsWith(`${ROUTES.ADMIN.EMPLOYEE_MANAGEMENT}/`))
  ) {
    return false;
  }

  if (isSuperAdmin) return true;

  if (isAlwaysAllowedRoute(pathname)) return true;

  if (!permissions) return false;

  const hasAnyPermission = Object.values(permissions).some((val) => val === 1);
  if (!hasAnyPermission) return false;

  const matchedKey = Object.keys(ROUTE_PERMISSION_MAP)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  // Deny by default — only SUPER_ADMIN (above) or an explicit mapped permission can pass.
  if (!matchedKey) return false;

  const permissionKey = ROUTE_PERMISSION_MAP[matchedKey];
  return permissions[permissionKey] === 1;
}
