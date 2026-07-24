import { OverviewStats } from "./components/overview-stats";
import { ManagementStats } from "./components/management-stats";
import { FinancialStats } from "./components/financial-stats";
import { SalesOverview } from "./components/sales-overview";
import { DataTablesSection } from "./components/data-tables-section";
import { TrendingOrders } from "./components/trending-orders";
import { MonthlyRevenue } from "./components/monthly-revenue";
import { StoreListings } from "./components/store-listings";
import { DataTable } from "@/components/common/data-table/data-table";
import { orderColumns } from "./components/columns/columns";
import { RECENT_ORDERS } from "@/constants/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

export function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your platform's performance, orders, revenue, and recent activities."
      />

      <div className="space-y-6">
        {/* Management Statistics */}
        <OverviewStats />
        <ManagementStats />
        <FinancialStats />
        <SalesOverview />

        <DataTablesSection />
        <TrendingOrders />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="col-span-2 overflow-hidden rounded-xl">
            <CardHeader className="mb-4 border-b border-slate-100/50 px-6 pt-6 pb-5">
              <CardTitle className="text-sm font-bold tracking-wider uppercase">
                Recently Placed Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-0 pb-6">
              <DataTable columns={orderColumns} data={RECENT_ORDERS} />
            </CardContent>
          </Card>

          <div className="col-span-1">
            <MonthlyRevenue />
          </div>
        </div>

        <StoreListings />
      </div>
    </div>
  );
}
