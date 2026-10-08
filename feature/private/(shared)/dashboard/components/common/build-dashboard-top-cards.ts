import { ROUTES } from "@/config/routes";
import { CheckCircle2, Clock, DollarSign, HandPlatter } from "lucide-react";

export function buildDashboardTopCards(dashboardData: any) {
  return [
    {
      title: "Total Orders Received",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: Clock,
      accentColor: "amber" as const,
      iconBgClassName: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      mainValue: dashboardData?.totalPendingOrders?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalPendingOrders?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalPendingOrders?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Requested Orders",
      href: `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?tab=requested`,
      icon: HandPlatter,
      accentColor: "cyan" as const,
      iconBgClassName: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
      mainValue: dashboardData?.totalRequestedOrders?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalRequestedOrders?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalRequestedOrders?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Completed Orders",
      href: `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?tab=completed-orders`,
      icon: CheckCircle2,
      accentColor: "emerald" as const,
      iconBgClassName:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      mainValue: dashboardData?.totalOrdersCompleted?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalOrdersCompleted?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalOrdersCompleted?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Earning",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: DollarSign,
      accentColor: "indigo" as const,
      iconBgClassName:
        "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      mainValue: dashboardData?.totalEarnings?.total ?? "0.00",
      mainLabel: "All Time",
      subStats: [
        { label: "Today", value: dashboardData?.totalEarnings?.today ?? "0.00" },
        { label: "This Week", value: dashboardData?.totalEarnings?.thisWeek ?? "0.00" },
      ],
    },
  ];
}
