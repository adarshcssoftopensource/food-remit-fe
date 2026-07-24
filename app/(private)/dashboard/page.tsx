import { Dashboard } from "@/feature/private/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Food Remit",
  description: "Platform dashboard and overview.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
