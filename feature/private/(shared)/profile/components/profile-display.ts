import type { useProfile } from "@/components/providers/profile-provider";
import { formatRole } from "@/lib/formatRole";

type Profile = ReturnType<typeof useProfile>["profile"];

export function getProfileRoles(profile: Profile) {
  const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";
  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  return { isEmployee, isStoreManager };
}

export function getProfileDefaultTab(
  needsBankVerification: boolean,
  isStoreManager: boolean,
  tabParam: string | null,
) {
  if (needsBankVerification && isStoreManager) return "store";
  if (tabParam === "store" && isStoreManager) return "store";
  if (tabParam === "security") return "security";
  return "general";
}

export function getProfileHeaderDetails(profile: Profile) {
  const displayName = profile?.name || "Admin User";
  const displayRole = formatRole(profile?.role || "");
  const displayEmail = profile?.email || "admin@foodremit.com";
  const displayStores = profile?.stores ? profile.stores.map((s) => s.storeName).join(", ") : null;
  const storeId = profile?.stores?.[0]?.id || "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bannerStore =
    (profile?.roleCode === "STORE_MANAGER" ||
      profile?.roleCode === "EMPLOYEE" ||
      profile?.role === "employee" ||
      profile?.role === "store_manager") &&
    profile?.stores?.[0]
      ? profile.stores[0]
      : null;

  return { displayName, displayRole, displayEmail, displayStores, storeId, initials, bannerStore };
}
