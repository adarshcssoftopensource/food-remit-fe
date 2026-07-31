import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RECENT_ORDERS } from "@/constants/dashboard";
import { orderColumns } from "./components/columns/columns";
import { DataTablesSection } from "./components/data-tables-section";
import { FinancialStats } from "./components/financial-stats";
import { ManagementStats } from "./components/management-stats";
import { MonthlyRevenue } from "./components/monthly-revenue";
import { OverviewStats } from "./components/overview-stats";
import { SalesOverview } from "./components/sales-overview";
import { StoreListings } from "./components/store-listings";
import { TrendingOrders } from "./components/trending-orders";

export function Dashboard() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Overview of your platform's performance and recent activities."
      />

      <div className="space-y-6">
        <OverviewStats />

        <ManagementStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <FinancialStats />
          <SalesOverview />
        </div>

        <DataTablesSection />

        <TrendingOrders />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="col-span-full overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-slate-100 bg-white px-6 py-4">
              <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase">
                Recently Placed Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-4">
              <DataTable columns={orderColumns} data={RECENT_ORDERS} />
            </CardContent>
          </Card>

          <div className="col-span-full lg:col-span-1">
            <MonthlyRevenue />
          </div>
        </div>

        <StoreListings />
      </div>
    </div>
  );
}
