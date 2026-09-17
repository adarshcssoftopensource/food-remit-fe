"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  User,
  UserCheck,
} from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/routes";
import { useTableFilters } from "@/hooks/use-table-filters";

import { getCustomerOrdersColumns } from "../columns/customer-orders-columns";
import { useGetCustomerReportDetail } from "../hooks/use-get-customer-report-detail";
import { useGetCustomerOrders, CustomerOrderRow } from "../hooks/use-get-customer-orders";
import { CustomerReportDetailSkeleton } from "./customer-report-detail-skeleton";
import { OrderReportDetailPage } from "./order-report-detail-page";

interface CustomerReportDetailProps {
  customerId: string;
}

export function CustomerReportDetail({ customerId }: CustomerReportDetailProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderType, setSelectedOrderType] = useState<number | undefined>(undefined);

  // Table filters for Customer's Orders
  const orderTableFilters = useTableFilters(50);

  // Customer Profile & Stats Query
  const {
    data: detailResponse,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetCustomerReportDetail(customerId);

  // Customer Orders Query
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useGetCustomerOrders(customerId, {
    page: orderTableFilters.page,
    limit: orderTableFilters.limit,
    search: orderTableFilters.debouncedSearch.trim() || undefined,
    type: selectedOrderType,
    sortBy: orderTableFilters.sortBy,
    sortOrder: orderTableFilters.sortOrder,
  });

  const customer = detailResponse?.data?.customer;
  const stats = detailResponse?.data?.stats;
  const orders: CustomerOrderRow[] = ordersResponse?.data || [];
  const orderPagination = ordersResponse?.pagination;

  const handleSearchChange = (val: string) => {
    orderTableFilters.setSearchQuery(val);
    orderTableFilters.setPage(1);
  };

  const columns = useMemo(
    () =>
      getCustomerOrdersColumns({
        page: orderTableFilters.page,
        limit: orderTableFilters.limit,
        onViewDetails: (orderId: string) => setSelectedOrderId(orderId),
      }),
    [orderTableFilters.page, orderTableFilters.limit],
  );

  // If user clicked view order details drilldown
  if (selectedOrderId) {
    return (
      <OrderReportDetailPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
    );
  }

  // Loading state
  if (isDetailLoading) {
    return <CustomerReportDetailSkeleton />;
  }

  // Not found or error
  if (isDetailError || !customer) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Customer Reports"
          action={
            <Link href={ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT}>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                <span>Back to Customer Reports</span>
              </Button>
            </Link>
          }
          breadcrumbs={[
            { label: "Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT },
            {
              label: "Customer Reports",
              href: ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT,
            },
            { label: "Customer Details" },
          ]}
        />
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <User className="mb-4 size-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Customer Not Found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            The requested customer profile could not be loaded or may have been deleted.
          </p>
          <Link href={ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT} className="mt-4">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Customer Reports</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const joinDateFormatted = customer.createdAt
    ? format(new Date(customer.createdAt), "dd MMM yyyy")
    : "—";

  const customerInitials =
    `${customer.firstName?.[0] || ""}${customer.lastName?.[0] || ""}`.toUpperCase() || "CU";

  return (
    <div className="space-y-5">
      {/* Header & Breadcrumb */}
      <PageHeader
        title="Customer Report"
        description="Comprehensive customer profile overview and orders activity"
        action={
          <Link href={ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Customer Reports</span>
            </Button>
          </Link>
        }
        breadcrumbs={[
          { label: "Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT },
          {
            label: "Customer Reports",
            href: ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT,
          },
          { label: customer.fullName || "Customer Details" },
        ]}
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative flex shrink-0 items-center justify-center">
              {customer.profileImage ? (
                <div className="relative size-24 overflow-hidden rounded-2xl border-2 border-white shadow-md md:size-28 dark:border-slate-800">
                  <Image
                    src={customer.profileImage}
                    alt={customer.fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 112px"
                  />
                </div>
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl border-2 border-white bg-linear-to-br from-blue-600 to-indigo-700 text-2xl font-bold tracking-wider text-white shadow-md md:size-28 dark:border-slate-800">
                  {customerInitials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
                      {customer.fullName}
                    </h2>
                    {customer.userStatus === "ACTIVE" ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />
                        Active Account
                      </Badge>
                    ) : (
                      <Badge className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                        <span className="mr-1.5 size-1.5 rounded-full bg-rose-500" />
                        {customer.userStatus || "Inactive"}
                      </Badge>
                    )}
                    {customer.emailVerifyStatus === "VERIFIED" ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                      >
                        <UserCheck className="size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                      >
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span>Joined {joinDateFormatted}</span>
                </div>
              </div>

              {/* Contact and Location Grid */}
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Mail className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      Email Address
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {customer.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Phone className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      Phone Number
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {customer.phoneNumber || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Globe className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      Country
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {customer.country || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-800/60">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <MapPin className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      City & State
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {[customer.city, customer.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 backdrop-blur-xs sm:col-span-2 dark:border-slate-800/80 dark:bg-slate-800/60">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      Delivery / Residence Address
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {customer.address || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() => {
            setSelectedOrderType(undefined);
            orderTableFilters.setPage(1);
          }}
          className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
            selectedOrderType === undefined
              ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500/40 dark:bg-blue-950/20"
              : "border-slate-200/80 bg-white dark:border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stats?.totalOrders ?? 0}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <ShoppingBag className="size-5" />
            </div>
          </div>
        </Card>

        <Card
          onClick={() => {
            setSelectedOrderType(1);
            orderTableFilters.setPage(1);
          }}
          className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
            selectedOrderType === 1
              ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500/40 dark:bg-emerald-950/20"
              : "border-slate-200/80 bg-white dark:border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders Sent</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats?.ordersSent ?? 0}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ArrowUpRight className="size-5" />
            </div>
          </div>
        </Card>

        <Card
          onClick={() => {
            setSelectedOrderType(2);
            orderTableFilters.setPage(1);
          }}
          className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
            selectedOrderType === 2
              ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 dark:border-amber-500/40 dark:bg-amber-950/20"
              : "border-slate-200/80 bg-white dark:border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Orders Requested
              </p>
              <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {stats?.ordersRequested ?? 0}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <ArrowDownLeft className="size-5" />
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Received Orders
              </p>
              <p className="text-2xl font-bold tracking-tight text-violet-600 dark:text-violet-400">
                {stats?.completedOrders ?? 0}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
        </Card>

        {/* <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spent</p>
              <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stats?.totalSpent || "$0.00"}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <CreditCard className="size-5" />
            </div>
          </div>
        </Card> */}
      </div>

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Customer Orders History
            </CardTitle>
            <Badge
              variant="secondary"
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {orderPagination?.total ?? orders.length} Orders
            </Badge>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-800/60">
            <button
              type="button"
              onClick={() => {
                setSelectedOrderType(undefined);
                orderTableFilters.setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedOrderType === undefined
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>All</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  selectedOrderType === undefined
                    ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    : "bg-slate-200/70 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
                }`}
              >
                {stats?.totalOrders ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOrderType(1);
                orderTableFilters.setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedOrderType === 1
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-emerald-500/20 dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>Sent</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {stats?.ordersSent ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOrderType(2);
                orderTableFilters.setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedOrderType === 2
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-amber-500/20 dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>Requested</span>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {stats?.ordersRequested ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOrderType(3);
                orderTableFilters.setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedOrderType === 3
                  ? "bg-white text-slate-900 shadow-xs ring-1 ring-purple-500/20 dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>Received</span>
              <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                {stats?.completedOrders ?? 0}
              </span>
            </button>
          </div>
        </div>

        {/* Filter bar: Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={orderTableFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search reference, sender, store, status, handed over by..."
              className="h-9 rounded-xl pl-9 text-xs"
            />
          </div>
        </div>

        {/* Orders DataTable */}
        <DataTable
          columns={columns}
          data={orders}
          loading={isOrdersLoading || isOrdersFetching}
          currentPage={orderTableFilters.page}
          totalPages={orderPagination?.totalPages || 1}
          rowsPerPage={orderTableFilters.limit}
          onPageChange={orderTableFilters.setPage}
          onRowsPerPageChange={(newLimit) => {
            orderTableFilters.setLimit(newLimit);
            orderTableFilters.setPage(1);
          }}
          onSortingChange={orderTableFilters.setSorting}
          manualSorting={true}
          manualFiltering={true}
          manualPagination={true}
        />
      </Card>
    </div>
  );
}
