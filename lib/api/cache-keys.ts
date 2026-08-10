export const API_CACHE_KEYS = {
  ADMIN_PROFILE: ["admin-profile"],
  SUB_ADMIN_PERMISSIONS: ["sub-admin-permissions"],
  SUB_ADMINS: ["get-sub-admins"],
  USER_BY_ID: (id: string) => ["user", id],
};
