import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderColumnsRequest } from "./columns/order-columns";

export function DataTablesSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 px-6 py-5">
          <CardTitle className="text-sm font-bold tracking-wider uppercase">
            Recent Orders Requested
          </CardTitle>

          <Button size="sm" className="h-8 rounded-full px-5 text-xs font-semibold">
            View All
          </Button>
        </CardHeader>

        <CardContent className="p-0 px-2">
          <DataTable columns={orderColumnsRequest} data={[]} />
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 px-6 pt-6 pb-5">
          <CardTitle className="text-sm font-bold tracking-wider uppercase">
            Recent Support Tickets
          </CardTitle>
          <Button
            variant="default"
            className="h-8 rounded-full px-6 text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="flex min-h-40 flex-1 items-center justify-center bg-slate-50/50 p-0">
          <p className="text-sm font-semibold text-slate-400">No Tickets Generated Yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
