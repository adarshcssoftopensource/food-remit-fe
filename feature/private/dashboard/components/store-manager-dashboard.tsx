"use client";

import { PageHeader } from "@/components/common/page-header";
import {
  Info,
  Box,
  RefreshCcw,
  HandPlatter,
  Users,
  Store,
  Menu,
  QrCode,
  DollarSign,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/components/providers/profile-provider";

export function StoreManagerDashboard() {
  const { profile } = useProfile();
  const welcomeMessage = profile?.name ? `Welcome, ${profile.name}` : undefined;

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Business Dashboard" welcomeMessage={welcomeMessage} />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-slate-50/80 p-4 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-emerald-300">
            Vendor view: manage your stores, catalog, and incoming orders
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Monitor store operations, fulfillment activity, product availability, and payouts in
            real time.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Menu className="h-4 w-4" /> FILTERS
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-slate-50/50">
              <Store className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Stores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px] bg-slate-50/50">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                NEW ORDERS
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">12</span>
                <span className="text-sm font-medium text-slate-500">Today</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
              <Box className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                PENDING
              </p>
              <p className="mt-1 text-lg font-bold">5</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                PROCESSING
              </p>
              <p className="mt-1 text-lg font-bold">4</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                COMPLETED
              </p>
              <p className="mt-1 text-lg font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                READY FOR PICKUP
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">7</span>
                <span className="text-sm font-medium text-slate-500">Today</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-500/20 bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10">
              <QrCode className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                AWAITING SCAN
              </p>
              <p className="mt-1 text-lg font-bold">4</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                PICKED UP
              </p>
              <p className="mt-1 text-lg font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                LOW STOCK ITEMS
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">9</span>
                <span className="text-sm font-medium text-slate-500">Needs attention</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-500/20 bg-amber-50 text-amber-600 dark:bg-amber-500/10">
              <Box className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                CRITICAL
              </p>
              <p className="mt-1 text-lg font-bold">2</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">LOW</p>
              <p className="mt-1 text-lg font-bold">7</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                PENDING PAYOUT
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">$1,240</span>
                <span className="text-sm font-medium text-slate-500">Current cycle</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-500/20 bg-purple-50 text-purple-600 dark:bg-purple-500/10">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              LAST SETTLEMENT
            </p>
            <p className="mt-1 text-lg font-bold">$2,180</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">OPERATIONS OVERVIEW</h3>
            <p className="text-sm text-slate-500">Your business activity at a glance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: "STORES",
              value: 2,
              icon: Store,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              label: "ACTIVE PRODUCTS",
              value: 148,
              icon: Box,
              color: "text-emerald-500",
              bg: "bg-emerald-50",
            },
            {
              label: "ACTIVE ORDERS",
              value: 12,
              icon: Box,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "READY FOR PICKUP",
              value: 7,
              icon: QrCode,
              color: "text-purple-500",
              bg: "bg-purple-50",
            },
            { label: "STAFF", value: 6, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
          ].map((item) => (
            <div
              key={item.label}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.color} dark:bg-slate-800`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {item.label}
                    </p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-slate-400 dark:text-slate-600">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M6.1584 3.13508C6.35985 2.95662 6.66436 2.97811 6.84282 3.17956L10.2708 7.04655C10.4259 7.22158 10.4259 7.48784 10.2708 7.66286L6.84282 11.5298C6.66436 11.7313 6.35985 11.7528 6.1584 11.5743C5.95695 11.3959 5.93546 11.0913 6.11391 10.89L9.13524 7.47879C9.22744 7.37474 9.22744 7.2173 9.13524 7.11325L6.11391 3.70204C5.93546 3.50059 5.95695 3.19608 6.1584 3.13508Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
