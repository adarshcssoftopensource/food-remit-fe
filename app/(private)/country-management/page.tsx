import { ROUTES } from "@/config/routes";
import { redirect } from "next/navigation";

export default function CountryManagementRedirect() {
  redirect(ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST);
}
