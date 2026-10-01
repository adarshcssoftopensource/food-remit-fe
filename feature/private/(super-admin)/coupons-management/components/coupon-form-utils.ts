import type { AdminProfile } from "@/components/providers/profile-provider";

export function getStoreManagerInfo(profile: AdminProfile | null) {
  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  const managerAssignedStore = profile?.stores?.[0];
  return { isStoreManager, managerAssignedStore };
}

export function getAssignedStoreName(managerStoreName?: string, couponStoreName?: string) {
  return managerStoreName || couponStoreName || "your assigned store";
}
