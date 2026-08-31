"use client";

import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import {
  Info,
  Box,
  RefreshCcw,
  HandPlatter,
  Users,
  Globe,
  MapPin,
  Store,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardCard } from "./components";
import { StoreManagerDashboard } from "./components/store-manager-dashboard";

export function Dashboard() {
  const { profile, isSuperAdmin } = useProfile();

  if (profile?.role === "store_manager") {
    return <StoreManagerDashboard />;
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Dashboard Overview" />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <h4 className="font-semibold text-emerald-900 dark:text-emerald-300">
            Admin view: oversee marketplace and vendor activity
          </h4>
          <p className="text-sm">
            Monitor platform performance, user activity, and marketplace health in real time.
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
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-slate-50/50">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                FOOD SENT <Info className="inline h-3 w-3 text-slate-400" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">1</span>
                <span className="text-sm font-medium text-slate-500">Today</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
              <Box className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">WEEK</p>
              <p className="mt-1 font-bold">1</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">MONTH</p>
              <p className="mt-1 font-bold">1</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">YEAR</p>
              <p className="mt-1 font-bold">1</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                FOOD REQUESTED <Info className="inline h-3 w-3 text-slate-400" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">0</span>
                <span className="text-sm font-medium text-slate-500">Today</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10">
              <HandPlatter className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">WEEK</p>
              <p className="mt-1 font-bold">0</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">MONTH</p>
              <p className="mt-1 font-bold">0</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">YEAR</p>
              <p className="mt-1 font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                REGISTERED USERS <Info className="inline h-3 w-3 text-slate-400" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">4</span>
                <span className="text-sm font-medium text-slate-500">Total Accounts</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">ACTIVE</p>
              <p className="mt-1 font-bold">3</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">INACTIVE</p>
              <p className="mt-1 font-bold">1</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">PENDING</p>
              <p className="mt-1 font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">MANAGEMENT OVERVIEW</h3>
            <p className="text-sm text-slate-500">Key platform entities at a glance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "COUNTRIES", value: 2, icon: Globe, color: "text-blue-500" },
            { label: "CITIES", value: 3, icon: MapPin, color: "text-teal-500" },
            { label: "VENDORS", value: 16, icon: Store, color: "text-amber-500" },
            { label: "VENDOR STORES", value: 27, icon: Box, color: "text-purple-500" },
            { label: "PRODUCT CATEGORIES", value: 42, icon: Box, color: "text-emerald-500" },
          ].map((item) => (
            <div
              key={item.label}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            >
              <div>
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs dark:bg-slate-700 ${item.color}`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
