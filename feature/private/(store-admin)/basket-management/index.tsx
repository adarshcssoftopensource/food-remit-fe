"use client";

import type { SortingState } from "@tanstack/react-table";
import { CheckCircle2, EyeOff, FilePen, Info, Plus, Search, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/config/routes";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

import { getBasketColumns } from "./columns/basket-columns";
import { BasketsEmptyState } from "./components/list/baskets-empty-state";
import { BasketStoreSwitcher } from "./components/shared/basket-store-switcher";
import {
  BASKET_STATUS_META,
  BASKET_TYPE_MAP,
  BASKET_TYPE_OPTIONS,
} from "../../../../constants/basket.constants";
import { BasketStatusBadge } from "./components/shared/basket-badges";
import { useActiveBasketStore } from "./hooks/use-active-basket-store";
import { useBasketLifecycleActions } from "./hooks/use-basket-lifecycle-actions";
import { useDeleteBasket } from "./hooks/use-delete-basket";
import { useGetBaskets } from "./hooks/use-get-baskets";
import type { Basket, BasketStatus, BasketType } from "./types/basket.types";

type StatusTab = "ALL" | BasketStatus;

const STATUS_TABS: {
  value: StatusTab;
  label: string;
  statKey: "total" | "active" | "draft" | "inactive";
}[] = [
  { value: "ALL", label: "All", statKey: "total" },
  { value: "DRAFT", label: "Draft", statKey: "draft" },
  { value: "ACTIVE", label: "Active", statKey: "active" },
  { value: "INACTIVE", label: "Inactive", statKey: "inactive" },
];

export function BasketManagement() {
  const router = useRouter();
  const {
    stores,
    activeStore,
    activeStoreId,
    setActiveStoreId,
    isLoading: storesLoading,
  } = useActiveBasketStore();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [typeFilter, setTypeFilter] = useState<BasketType | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pendingDelete, setPendingDelete] = useState<Basket | null>(null);

  const params = useMemo(
    () => ({
      storeId: activeStoreId,
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: statusTab === "ALL" ? undefined : statusTab,
      basketType: typeFilter === "ALL" ? undefined : typeFilter,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0] ? (sorting[0].desc ? ("desc" as const) : ("asc" as const)) : undefined,
    }),
    [activeStoreId, page, limit, debouncedSearch, statusTab, typeFilter, sorting],
  );

  const { data, isLoading } = useGetBaskets(params);
  const lifecycle = useBasketLifecycleActions();
  const deleteMutation = useDeleteBasket();

  const stats = data?.stats ?? { total: 0, active: 0, draft: 0, inactive: 0 };
  const baskets = data?.data ?? [];
  const hasFilters = Boolean(params.search || params.status || params.basketType);
  const showEmptyState = !isLoading && !storesLoading && stats.total === 0 && !hasFilters;

  const columns = useMemo(
    () =>
      getBasketColumns({
        onView: (b) => router.push(ROUTES.ADMIN.BASKETS.DETAILS(b.id)),
        onEdit: (b) => router.push(ROUTES.ADMIN.BASKETS.EDIT(b.id)),
        onDelete: setPendingDelete,
        onPublish: lifecycle.publish,
        onSetInactive: lifecycle.setInactive,
        onScheduleInactive: lifecycle.scheduleInactive,
        onReactivate: lifecycle.reactivate,
        onToggleStatus: lifecycle.toggleStatus,
        pendingId: lifecycle.pendingId,
      }),
    [
      router,
      lifecycle.publish,
      lifecycle.setInactive,
      lifecycle.scheduleInactive,
      lifecycle.reactivate,
      lifecycle.toggleStatus,
      lifecycle.pendingId,
    ],
  );

  const resetPage = () => setPage(1);

  const createButton = (
    <Link
      href={ROUTES.ADMIN.BASKETS.CREATE}
      className={cn(
        buttonVariants(),
        "h-10 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700",
      )}
    >
      <Plus className="size-4" />
      Create Basket
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Basket Management"
        description="Create, publish and manage ready-to-buy baskets for your store. Baskets make it easy for families to get essentials in one order."
        action={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <BasketStoreSwitcher
              stores={stores}
              activeStore={activeStore}
              onChange={(id) => {
                setActiveStoreId(id);
                resetPage();
              }}
              isLoading={storesLoading}
            />
            {createButton}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricStatCard
          label="Total Baskets"
          value={stats.total}
          trendLabel="Across all statuses"
          icon={ShoppingBasket}
          iconClassName="text-emerald-600"
          iconWrapperClassName="bg-emerald-100 dark:bg-emerald-950/40"
          loading={isLoading}
        />
        <MetricStatCard
          label="Active"
          value={stats.active}
          trendLabel="Live for customers"
          icon={CheckCircle2}
          iconClassName="text-teal-600"
          iconWrapperClassName="bg-teal-100 dark:bg-teal-950/40"
          loading={isLoading}
        />
        <MetricStatCard
          label="Drafts"
          value={stats.draft}
          trendLabel="Waiting to be published"
          icon={FilePen}
          iconClassName="text-amber-600"
          iconWrapperClassName="bg-amber-100 dark:bg-amber-950/40"
          loading={isLoading}
        />
        <MetricStatCard
          label="Inactive"
          value={stats.inactive}
          trendLabel="Hidden from customers"
          icon={EyeOff}
          iconClassName="text-slate-600"
          iconWrapperClassName="bg-slate-200 dark:bg-slate-800"
          loading={isLoading}
        />
      </div>

      {showEmptyState ? (
        <BasketsEmptyState storeName={activeStore?.storeName} action={createButton} />
      ) : (
        <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="min-w-0 gap-0 rounded-2xl border border-white/70 bg-white/85 py-0 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
            <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div
                role="tablist"
                aria-label="Filter by status"
                className="inline-flex w-full gap-1 overflow-x-auto rounded-full bg-slate-100/80 p-1 shadow-inner sm:w-auto dark:bg-slate-800/50"
              >
                {STATUS_TABS.map((tab) => {
                  const active = statusTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => {
                        setStatusTab(tab.value);
                        resetPage();
                      }}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                        active
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
                      )}
                    >
                      {tab.label}
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                          active
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-200/80 dark:bg-slate-700",
                        )}
                      >
                        {stats[tab.statKey]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative sm:w-64">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Search baskets"
                    className="h-10 rounded-xl pl-9"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => {
                    setTypeFilter((value as BasketType | "ALL") ?? "ALL");
                    resetPage();
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl sm:w-48">
                    <SelectValue>
                      {typeFilter === "ALL"
                        ? "All basket types"
                        : BASKET_TYPE_MAP[typeFilter].label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All basket types</SelectItem>
                    {BASKET_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <DataTable
                columns={columns}
                data={baskets}
                loading={isLoading}
                currentPage={page}
                totalPages={data?.pagination.totalPages ?? 1}
                rowsPerPage={limit}
                onPageChange={setPage}
                onRowsPerPageChange={(value) => {
                  setLimit(value);
                  resetPage();
                }}
                manualPagination
                manualSorting
                onSortingChange={(next) => {
                  setSorting(next);
                  resetPage();
                }}
                emptyMessage="No baskets match your filters"
              />
            </CardContent>
          </Card>
          <BasketStatusLegend />
        </div>
      )}

      {lifecycle.dialogs}

      <ConfirmationDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete basket?"
        description={`"${pendingDelete?.name ?? ""}" will be removed from customers and moved to the recycle bin. You can restore it later.`}
        confirmLabel="Delete basket"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteMutation.mutateAsync({ id: pendingDelete.id });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function BasketStatusLegend() {
  return (
    <aside className="grid gap-3 sm:grid-cols-3 2xl:sticky 2xl:top-24 2xl:grid-cols-1">
      {(["DRAFT", "ACTIVE", "INACTIVE"] as const).map((status) => (
        <div
          key={status}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-950"
        >
          <BasketStatusBadge status={status} />
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {BASKET_STATUS_META[status].description}
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-400">
            {BASKET_STATUS_META[status].visibility}
          </p>
        </div>
      ))}
      <p className="text-muted-foreground flex gap-2 px-1 text-[11px] leading-relaxed sm:col-span-3 2xl:col-span-1">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Status controls whether customers can see a basket. Availability controls when an active
        basket can be ordered.
      </p>
    </aside>
  );
}
