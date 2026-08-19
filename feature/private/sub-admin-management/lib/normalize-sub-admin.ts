import type { SubAdminData } from "../types/sub-admin.types";

export function normalizeSubAdmin(item: Record<string, unknown>): SubAdminData {
  const countryCode = String(item.countryCode ?? item.phoneCountryCode ?? "");
  const rawNumber = String(item.contactNumber ?? item.phoneNumber ?? item.mobile ?? "");
  const contactNumber = countryCode
    ? `+${countryCode.replace(/^\+/, "")} ${rawNumber}`.trim()
    : rawNumber;

  const isActive =
    item.status === true ||
    item.status === 1 ||
    item.status === "1" ||
    item.status === "Active" ||
    item.status === "ACTIVE" ||
    item.status === "true";

  return {
    id: String(item.id ?? ""),
    userId: String(item.userId ?? item.id ?? ""),
    userName: String(item.userName ?? item.name ?? ""),
    email: String(item.email ?? ""),
    contactNumber,
    status: isActive ? "Active" : "Inactive",
    createdAt: String(item.createdAt ?? item.created_at ?? ""),
    role: String(item.role ?? "Sub-admin"),
    permissions:
      (item.permission as SubAdminData["permissions"]) ??
      (item.permissions as SubAdminData["permissions"]) ??
      [],
  };
}
