"use client";

import {
  BadgeDollarSign,
  Building2,
  CreditCard,
  Globe,
  HandCoins,
  Hash,
  Mail,
  Map,
  MapPin,
  Phone,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import Image from "next/image";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import type { StoreReportRow, StoreTransactionRow } from "@/constants/report-management";
import { storeTransactionColumns } from "../columns/other-report-columns";
import { ReportDateFilters } from "../components/report-date-filters";
import { useReportDateFilters } from "../hooks/use-report-date-filters";

type StoreReportDetailProps = {
  store: StoreReportRow;
};

export function StoreReportDetail({ store }: StoreReportDetailProps) {
  const { applyFilters, clearFilters, fromDate, hasFilters, setFromDate, setToDate, toDate } =
    useReportDateFilters();

  const transactions: StoreTransactionRow[] = [];
  const managerRows = [
    { label: "Name", value: store.manager.name, icon: User },
    { label: "Email Address", value: store.manager.email, icon: Mail },
    { label: "Phone Number", value: store.manager.phone, icon: Phone },
    { label: "Address", value: store.manager.address, icon: MapPin },
    { label: "Country", value: store.manager.country, icon: Globe },
    { label: "State", value: store.manager.state, icon: Map },
    { label: "City", value: store.manager.city, icon: Building2 },
    { label: "Zip Code", value: store.manager.zipCode, icon: Hash },

    { label: "Total Sales by Store", value: store.earnings.totalSales, icon: ShoppingBag },
    { label: "Total Markup Earning", value: store.earnings.totalMarkup, icon: BadgeDollarSign },
    { label: "Total Processing Earning", value: store.earnings.totalProcessing, icon: CreditCard },
    { label: "Total Commission Earning", value: store.earnings.totalCommission, icon: HandCoins },
    { label: "Total Item Tax", value: store.earnings.totalItemTax, icon: Receipt },
    { label: "Refunded Amount", value: store.earnings.refundedAmount, icon: RotateCcw },
  ];

  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          breadcrumbs={[
            { label: "Report Management" },
            { label: "Store Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT },
            { label: "Store Report Details" },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden rounded-3xl border shadow-sm transition hover:shadow-lg">
          <CardContent className="p-0">
            <div className="from-primary/10 via-primary/5 bg-linear-to-r to-transparent p-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="border-background bg-muted relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 shadow-md">
                  {store.image ? (
                    <Image
                      src={store.image}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={store.storeName}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Store className="text-muted-foreground h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-bold tracking-tight">{store.storeName}</h2>

                    <StatusBadge
                      status="Active"
                      className="rounded-full border-0 px-3 py-1 shadow-none"
                    />
                  </div>

                  <p className="text-muted-foreground mt-2">Store Information & Overview</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 rounded-2xl border p-4 transition">
                <div className="bg-primary/10 rounded-xl p-3">
                  <MapPin className="text-primary h-5 w-5" />
                </div>

                <div>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">Address</p>
                  <p className="font-semibold">{store.address || "-"}</p>
                </div>
              </div>

              <div className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 rounded-2xl border p-4 transition">
                <div className="bg-primary/10 rounded-xl p-3">
                  <Phone className="text-primary h-5 w-5" />
                </div>

                <div>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">Phone</p>
                  <p className="font-semibold">{store.phone || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 rounded-3xl border bg-white shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-bold">Store Manager</CardTitle>

            <p className="text-muted-foreground text-sm">
              Manager details & store earnings overview
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {managerRows.map((row) => {
                const Icon = row.icon;

                return (
                  <div
                    key={row.label}
                    className="group from-muted/40 to-background hover:border-primary/30 relative overflow-hidden rounded-2xl border bg-linear-to-br p-4 transition-colors transition-shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-11 w-11 items-center justify-center rounded-xl">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      {row.label}
                    </p>

                    <p className="truncate text-sm font-bold">{row.value || "-"}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        hasFilters={hasFilters}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <Card className="rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <DataTable
            columns={storeTransactionColumns}
            data={transactions}
            searchKey="transactionNo"
          />
        </CardContent>
      </Card>
    </div>
  );
}
