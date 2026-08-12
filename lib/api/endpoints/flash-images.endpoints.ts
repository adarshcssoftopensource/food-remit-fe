export const FLASH_IMAGES_ENDPOINTS = {
  GET_ALL: "/admin/flash-images",
  UPDATE: (id: string) => `/admin/flash-images/${id}`,
  CREATE: "/admin/flash-images",
  DELETE: (id: string) => `/admin/flash-images/${id}`,
} as const;
