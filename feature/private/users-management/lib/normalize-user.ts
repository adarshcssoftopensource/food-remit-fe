import type { UserData } from "../types/user.types";

export function normalizeUser(item: Record<string, unknown>): UserData {
  const firstName = String(
    item.firstName ?? item.fName ?? (item.name as string)?.split(" ")?.[0] ?? "",
  );
  const lastName = String(
    item.lastName ?? item.lName ?? (item.name as string)?.split(" ")?.[1] ?? "",
  );
  const contactNumber = String(
    item.contactNumber ?? item.phoneNumber ?? item.mobile ?? item.phone ?? "",
  );
  const registeredOn = String(
    item.registeredOn ?? item.registered_at ?? item.createdAt ?? item.created_at ?? "",
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
    contactNumber,
    registeredOn,
    country: String(item.country ?? item.countryName ?? ""),
    state: String(item.state ?? ""),
    city: String(item.city ?? ""),
    status: isActive ? "Active" : "Inactive",
  };
}
