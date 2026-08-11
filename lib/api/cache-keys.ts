export const API_CACHE_KEYS = {
  ADMIN_PROFILE: ["admin-profile"],
  SUB_ADMIN_PERMISSIONS: ["sub-admin-permissions"],
  SUB_ADMINS: ["sub-admins"],
  USER_BY_ID: (id: string) => ["user", id],
  PARTNER_LEADS_LIST: ["partner-leads"],
  PARTNER_LEADS_DETAIL: (id: string) => [`partner-leads-${id}`],
  SETTINGS_COUNTRIES: ["settings-countries"],
};
