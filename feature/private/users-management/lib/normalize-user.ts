import type { UserData } from "../types/user.types";

export function normalizeUser(item: any): UserData {
  const firstName = item.firstName ?? item.fName ?? item.name?.split(" ")?.[0] ?? "";
  const lastName = item.lastName ?? item.lName ?? item.name?.split(" ")?.[1] ?? "";
  const contactNumber = item.contactNumber ?? item.phoneNumber ?? item.mobile ?? item.phone ?? "";
  const registeredOn =
    item.registeredOn ?? item.registered_at ?? item.createdAt ?? item.created_at ?? "";

  return {
    id: String(item.id ?? ""),
    firstName: String(firstName ?? ""),
    lastName: String(lastName ?? ""),
    userName: String(item.userName ?? item.username ?? item.user_name ?? ""),
    userType: String(item.userType ?? item.type ?? "Normal"),
    email: String(item.email ?? ""),
    contactNumber: String(contactNumber ?? ""),
    registeredOn: String(registeredOn ?? ""),
    country: String(item.country ?? item.countryName ?? ""),
    state: String(item.state ?? ""),
    city: String(item.city ?? ""),
    status:
      item.status === 1 || item.status === "1" || item.status === "Active" ? "Active" : "Inactive",
  };
}
