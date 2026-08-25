import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function ContentManagementPage() {
  redirect(ROUTES.ADMIN.CONTENT_MANAGEMENT.LANDING_PAGE);
}
