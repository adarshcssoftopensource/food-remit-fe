import { DataTable } from "@/components/common/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { orderColumnsRequest } from "./columns/order-columns";
import type { DashboardOrderRequested, DashboardTicketItem } from "../types/dashboard.types";

interface DataTablesSectionProps {
  recentOrdersRequested?: DashboardOrderRequested[];
  recentTickets?: DashboardTicketItem[];
  isLoading?: boolean;
}

export function DataTablesSection({
  recentOrdersRequested = [],
  recentTickets = [],
  isLoading,
}: DataTablesSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/70 px-6 py-5">
          <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase">
            Recent Orders Requested
          </CardTitle>

          <Button asChild size="sm" className="h-8 rounded-full px-5 text-xs font-semibold">
            <Link href="/order-management/requested-orders">View All</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0 px-2">
          <DataTable
            columns={orderColumnsRequest}
            data={recentOrdersRequested}
            loading={isLoading}
            hidePagination={true}
          />
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/70 px-6 pt-6 pb-5">
          <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase">
            Recent Support Tickets
          </CardTitle>
          <Button
            asChild
            variant="default"
            className="h-8 rounded-full px-6 text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Link href="/ticket-management/active-requests">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex min-h-40 flex-1 flex-col justify-center bg-slate-50/30 p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white p-3 shadow-xs"
                >
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentTickets.length > 0 ? (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {ticket.subject}
                    </p>
                    {ticket.addedOn && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(ticket.addedOn).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={ticket.status.toUpperCase() === "RESOLVED" ? "secondary" : "default"}
                    className="shrink-0 text-xs font-medium uppercase"
                  >
                    {ticket.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-slate-400">No Tickets Generated Yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
