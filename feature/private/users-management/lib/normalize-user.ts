import type { UserData } from "../types/user.types";

export function normalizeUser(item: Record<string, unknown>): UserData {
  const firstName = String(
    item.firstName ?? item.fName ?? (item.name as string)?.split(" ")?.[0] ?? "",
  );
  const lastName = String(
    item.lastName ?? item.lName ?? (item.name as string)?.split(" ")?.[1] ?? "",
  );
  const phoneNumber = String(
    item.phoneNumber ?? item.contactNumber ?? item.mobile ?? item.phone ?? "",
  );
  const createdAt = String(
    item.createdAt ?? item.created_at ?? item.registeredOn ?? item.registered_at ?? "",
  );

  const rawStatus = item.userStatus ?? item.status;
  const isActive =
    rawStatus === true ||
    rawStatus === 1 ||
    rawStatus === "1" ||
    rawStatus === "Active" ||
    rawStatus === "ACTIVE" ||
    rawStatus === "true";

  return {
    id: String(item.id ?? ""),
    firstName,
    lastName,
    userName: String(item.userName ?? item.username ?? item.user_name ?? ""),
    userType: String(item.userType ?? item.type ?? "Normal"),
    email: String(item.email ?? ""),
    phoneNumber,
    countryCode: String(item.countryCode ?? ""),
    country: String(item.country ?? ""),
    state: String(item.state ?? ""),
    city: String(item.city ?? ""),
    createdAt,
    userStatus: isActive ? "ACTIVE" : "INACTIVE",
    profileImage: item.profileImage ? String(item.profileImage) : undefined,
  };
}
