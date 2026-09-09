import { ROUTES } from "@/config/routes";
import { redirect } from "next/navigation";

export default function CityManagementRedirect() {
  redirect(ROUTES.ADMIN.CITY_MANAGEMENT.LIST);
}
