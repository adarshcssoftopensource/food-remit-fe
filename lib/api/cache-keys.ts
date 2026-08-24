export const API_CACHE_KEYS = {
  // Admin / Auth
  ADMIN_PROFILE: ["admin-profile"],
  SUB_ADMIN_PERMISSIONS: ["sub-admin-permissions"],
  SUB_ADMINS: ["sub-admins"],
  SUB_ADMIN_BY_ID: (id: string) => ["sub-admins", id],

  // Users
  USERS: ["users"],
  USER_BY_ID: (id: string) => ["user", id],
  RECYCLED_USERS: ["RECYCLED_USERS"],

  // Partner Leads
  PARTNER_LEADS_LIST: ["partner-leads"],
  PARTNER_LEADS_DETAIL: (id: string) => [`partner-leads-${id}`],

  // Settings – Countries & Cities
  SETTINGS_COUNTRIES: ["settings-countries"],
  SETTINGS_COUNTRIES_DROPDOWN: ["settings-countries-dropdown"],
  SETTINGS_CITIES: ["settings-cities"],
  SETTINGS_CITIES_DROPDOWN: ["settings-cities-dropdown"],
  SETTINGS_MARKUP: ["settings-markup"],
  SETTINGS_PROCESSING_FEES: ["settings-processing-fees"],

  // Flash Images
  FLASH_IMAGES: ["flash-images"],

  // Country Managers
  COUNTRY_MANAGERS: ["COUNTRY_MANAGERS"],

  // City Managers
  CITY_MANAGERS: ["CITY_MANAGERS"],

  // Stores
  STORES: ["STORES"],

  // Catalogue
  DEPARTMENTS: ["departments"],
  DEPARTMENT_BY_ID: (id: string) => ["department", id],
  CATEGORIES: ["categories"],
  CATEGORY_BY_ID: (id: string) => ["category", id],
  ITEMS: ["items"],
  ITEM_BY_ID: (id: string) => ["item", id],

  // Dashboard
  DASHBOARD: ["dashboard"],

  // Orders
  ORDERS: ["orders"],
  ORDER_BY_ID: (id: string) => ["order", id],
};
