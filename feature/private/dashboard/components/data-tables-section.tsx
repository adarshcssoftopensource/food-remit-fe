"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { Clock, Inbox, LifeBuoy, ShoppingBag } from "lucide-react";
import type { DashboardOrderRequested, DashboardTicketItem } from "../types/dashboard.types";
import { requestedOrdersColumns } from "./columns/requested-orders-columns";
import { DashboardActionButton } from "./common/dashboard-action-button";
import { DashboardCard } from "./common/dashboard-card";
import { DashboardEmptyState } from "./common/dashboard-empty-state";
import { DashboardStatusBadge } from "./common/dashboard-status-badge";

const EMPTY_ORDERS: DashboardOrderRequested[] = [];
const EMPTY_TICKETS: DashboardTicketItem[] = [];

interface DataTablesSectionProps {
  recentOrdersRequested?: DashboardOrderRequested[];
  recentTickets?: DashboardTicketItem[];
  isLoading?: boolean;
}

export function DataTablesSection({
  recentOrdersRequested = EMPTY_ORDERS,
  recentTickets = EMPTY_TICKETS,
  isLoading = false,
}: DataTablesSectionProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
      <DashboardCard
        title="Recent Orders Requested"
        subtitle="Incoming requisition requests across communities"
        accentColor="cyan"
        className="min-w-0 overflow-hidden"
        icon={
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
        }
        action={
          <DashboardActionButton
            href={`${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?tab=requested-orders`}
            label="View All"
          />
        }
        contentClassName="p-0 overflow-x-auto"
      >
        <div className="w-full min-w-0 overflow-x-auto">
          <DataTable
            columns={requestedOrdersColumns}
            data={recentOrdersRequested}
            loading={isLoading}
            hidePagination={true}
          />
        </div>
      </DashboardCard>

      <DashboardCard
        title="Recent Support Tickets"
        subtitle="Active user and partner issues requiring triage"
        accentColor="violet"
        className="min-w-0 overflow-hidden"
        icon={
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <LifeBuoy className="h-4.5 w-4.5" />
          </div>
        }
        action={
          <DashboardActionButton href={ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT} label="View All" />
        }
        contentClassName="p-5 sm:p-6"
      >
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex-1 space-y-2 pr-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentTickets.length > 0 ? (
          <div className="space-y-2.5">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-colors transition-shadow transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {ticket.subject || "Support Request"}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>
                      {ticket.addedOn
                        ? new Date(ticket.addedOn).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recently generated"}
                    </span>
                  </div>
                </div>
                <DashboardStatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            icon={Inbox}
            title="No Tickets Generated"
            description="Active support requests will appear here once submitted."
          />
        )}
      </DashboardCard>
    </div>
  );
}
