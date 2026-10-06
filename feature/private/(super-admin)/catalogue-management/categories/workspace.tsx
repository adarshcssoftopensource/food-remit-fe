"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { StatusTabs } from "@/components/common/status-tabs";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import { useDebounce } from "@/lib/debounce";
import type { Row } from "@tanstack/react-table";
import {
  ArrowLeftRight,
  Coins,
  FolderOpen,
  LogOut,
  MapPin,
  Package,
  PackagePlus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { getItemColumns } from "../items/columns/item-columns";
import { ItemCsvToolbar } from "../items/components/item-csv-toolbar";
import { useGetItems } from "../items/hooks/use-get-items";
import type { ItemData } from "../items/types/item.types";
import { CategoryPickerDialog } from "./components/category-picker-dialog";
import { useGetCategory } from "./hooks/use-get-category";
import type { ActiveCategory } from "./types/category.types";

interface CategoryItemsWorkspaceProps {
  id: string;
}

type WorkspaceCategory = NonNullable<ReturnType<typeof useGetCategory>["data"]>;
type ItemsResponse = ReturnType<typeof useGetItems>["data"];
type ItemStats = { total: number; active: number; inactive: number };
type StatusTab = "all" | "ACTIVE" | "INACTIVE";

function getWorkspaceRoleFlags(profile: ReturnType<typeof useProfile>["profile"]) {
  const isStoreScoped =
    profile?.role === "store_manager" ||
    profile?.role === "employee" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.roleCode === "EMPLOYEE";
  const isStoreManager = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";
  return { isStoreScoped, isStoreManager };
}

function getItemStats(itemsResponse: ItemsResponse): ItemStats {
  return {
    total: itemsResponse?.stats?.total ?? 0,
    active: itemsResponse?.stats?.active ?? 0,
    inactive: itemsResponse?.stats?.inactive ?? 0,
  };
}

export function CategoryItemsWorkspace({ id }: CategoryItemsWorkspaceProps) {
  const router = useRouter();
  const { profile, needsBankVerification, canViewPlatformFees } = useProfile();
  const canWrite = !needsBankVerification;
  const { isStoreScoped, isStoreManager } = getWorkspaceRoleFlags(profile);

  const { data: category, isLoading: isCategoryLoading } = useGetCategory(id);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusTab, setStatusTab] = useState<StatusTab>("all");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const {
    data: itemsResponse,
    isLoading: isItemsLoading,
    isFetching,
  } = useGetItems({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: id,
    status: statusTab !== "all" ? statusTab : undefined,
  });

  const items = useMemo(() => itemsResponse?.data ?? [], [itemsResponse?.data]);
  const pagination = itemsResponse?.pagination ?? { page: 1, limit, total: 0, totalPages: 0 };
  const stats = getItemStats(itemsResponse);

  const activeCategory = useMemo<ActiveCategory | null>(
    () =>
      category
        ? {
            id: category.id,
            categoryName: category.categoryName,
            categoryIcon: category.categoryIconUrl || category.categoryIcon,
            currencySymbol: category.currencySymbol,
          }
        : null,
    [category],
  );

  const newItemHref = ROUTES.ADMIN.CATALOGUE_MANAGEMENT.NEW_ITEM(id);
  const [isOpeningEditor, startNavigation] = useTransition();
  const openAddItem = useCallback(
    () => startNavigation(() => router.push(newItemHref)),
    [router, newItemHref],
  );

  useEffect(() => {
    if (canWrite) router.prefetch(newItemHref);
  }, [canWrite, router, newItemHref]);

  const handleEdit = useCallback(
    (item: ItemData) =>
      router.push(
        ROUTES.ADMIN.CATALOGUE_MANAGEMENT.EDIT_ITEM(
          item.id,
          ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(id),
        ),
      ),
    [router, id],
  );

  const handleView = useCallback(
    (item: ItemData) => router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEM_DETAILS(item.id)),
    [router],
  );

  const columns = useMemo(
    () =>
      getItemColumns(handleEdit, handleView, setLightboxSrc, isStoreScoped, canViewPlatformFees, {
        hideCategory: true,
      }),
    [handleEdit, handleView, isStoreScoped, canViewPlatformFees],
  );

  const getRowClassName = useCallback((row: Row<ItemData>) => {
    const qty = row.original.quantityOnHand ?? row.original.stockQuantity;
    if (qty === null || qty === undefined) return undefined;
    if (qty <= 0) {
      return "bg-rose-50/30 hover:bg-rose-50/60! dark:bg-rose-950/10 dark:hover:bg-rose-950/25!";
    }
    if (qty <= 5) {
      return "bg-amber-50/30 hover:bg-amber-50/60! dark:bg-amber-950/10 dark:hover:bg-amber-950/25!";
    }
    return undefined;
  }, []);

  const exitCategory = () => router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES);

  if (isCategoryLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!category || !activeCategory) {
    return <CategoryNotAvailable onExit={exitCategory} />;
  }

  const isEmptyCategory =
    !isItemsLoading && stats.total === 0 && !debouncedSearch && statusTab === "all";

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        breadcrumbs={[
          { label: "Catalogue Management" },
          { label: "Categories", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES },
          { label: category.categoryName },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="from-primary/15 via-primary/5 pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-linear-to-r to-transparent" />
        <div className="bg-primary/10 pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <WorkspaceCategoryIdentity
            category={category}
            icon={activeCategory.categoryIcon}
            totalItems={stats.total}
            onZoom={setLightboxSrc}
          />

          <WorkspaceCategoryActions
            category={category}
            canWrite={canWrite}
            isStoreManager={isStoreManager}
            isOpeningEditor={isOpeningEditor}
            onExit={exitCategory}
            onChangeCategory={() => setPickerOpen(true)}
            onAddItem={openAddItem}
          />
        </div>
      </section>

      {isEmptyCategory ? (
        <EmptyCategoryCard
          categoryName={category.categoryName}
          canWrite={canWrite}
          isOpeningEditor={isOpeningEditor}
          onAddItem={openAddItem}
        />
      ) : (
        <WorkspaceItemsSection
          categoryName={category.categoryName}
          stats={stats}
          statusTab={statusTab}
          onStatusTabChange={(tab) => {
            setStatusTab(tab);
            setPage(1);
          }}
          isStatusLoading={isItemsLoading || isFetching}
          pagination={pagination}
          debouncedSearch={debouncedSearch}
          columns={columns}
          items={items}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isItemsLoading={isItemsLoading}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          getRowClassName={getRowClassName}
        />
      )}

      <CategoryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        activeCategoryId={category.id}
        title="Change Category"
        description="Switch to another category. New items will be added to the category you pick."
        onSelect={(next) => {
          setPickerOpen(false);
          if (next.id !== category.id) {
            router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(next.id));
          }
        }}
      />
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/60" />
      <div className="grid gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
    </div>
  );
}

function CategoryNotAvailable({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <FolderOpen className="h-16 w-16 text-slate-300" />
      <h2 className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
        Category not available
      </h2>
      <p className="max-w-sm text-sm text-slate-500">
        This category doesn&apos;t exist or doesn&apos;t belong to your store.
      </p>
      <Button onClick={onExit} variant="outline" className="mt-2 rounded-xl px-6">
        Back to Categories
      </Button>
    </div>
  );
}

function WorkspaceCategoryIdentity({
  category,
  icon,
  totalItems,
  onZoom,
}: {
  category: WorkspaceCategory;
  icon: ActiveCategory["categoryIcon"];
  totalItems: number;
  onZoom: (src: string) => void;
}) {
  const scopeText = category.store?.storeName || category.cityName || null;

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="ring-primary/15 relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-4 sm:h-24 sm:w-24 dark:bg-slate-950">
        {icon ? (
          <button
            type="button"
            onClick={() => onZoom(icon)}
            className="absolute inset-0"
            title="View image"
          >
            <Image
              src={icon}
              alt={category.categoryName}
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ) : (
          <FolderOpen className="text-primary h-9 w-9" />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-primary flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
          </span>
          Working in category
        </p>
        <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {category.categoryName}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={
              category.status === "ACTIVE"
                ? "rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                : "rounded-full bg-rose-500/10 px-2.5 py-1 font-semibold text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-400"
            }
          >
            {category.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Package className="h-3.5 w-3.5" />
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          {scopeText && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5" />
              {scopeText}
            </span>
          )}
          {category.currencySymbol && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Coins className="h-3.5 w-3.5" />
              Prices in {category.currency || category.currencySymbol}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkspaceCategoryActions({
  category,
  canWrite,
  isStoreManager,
  isOpeningEditor,
  onExit,
  onChangeCategory,
  onAddItem,
}: {
  category: WorkspaceCategory;
  canWrite: boolean;
  isStoreManager: boolean;
  isOpeningEditor: boolean;
  onExit: () => void;
  onChangeCategory: () => void;
  onAddItem: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
      <Button variant="ghost" onClick={onExit} className="gap-2 rounded-xl text-slate-600">
        <LogOut className="h-4 w-4" />
        Exit Category
      </Button>
      <Button variant="outline" onClick={onChangeCategory} className="gap-2 rounded-xl">
        <ArrowLeftRight className="h-4 w-4" />
        Change Category
      </Button>
      {canWrite && isStoreManager && (
        <ItemCsvToolbar
          className="contents"
          category={{ id: category.id, categoryName: category.categoryName }}
        />
      )}
      {canWrite && (
        <Button
          onClick={onAddItem}
          disabled={isOpeningEditor}
          isLoading={isOpeningEditor}
          className="gap-2 rounded-xl shadow-sm"
        >
          {!isOpeningEditor && <Plus className="h-4 w-4" />}
          {isOpeningEditor ? "Opening…" : "Add Item"}
        </Button>
      )}
    </div>
  );
}

function EmptyCategoryCard({
  categoryName,
  canWrite,
  isOpeningEditor,
  onAddItem,
}: {
  categoryName: string;
  canWrite: boolean;
  isOpeningEditor: boolean;
  onAddItem: () => void;
}) {
  return (
    <Card className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
          <PackagePlus className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            No items in {categoryName} yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-slate-500">
            Every item you add here is saved under {categoryName}. You can add several items in a
            row without choosing the category again.
          </p>
        </div>
        {canWrite && (
          <Button
            onClick={onAddItem}
            disabled={isOpeningEditor}
            isLoading={isOpeningEditor}
            className="mt-2 gap-2 rounded-xl"
          >
            {!isOpeningEditor && <Plus className="h-4 w-4" />}
            Add your first item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function WorkspaceItemsSection({
  categoryName,
  stats,
  statusTab,
  onStatusTabChange,
  isStatusLoading,
  pagination,
  debouncedSearch,
  columns,
  items,
  search,
  onSearchChange,
  isItemsLoading,
  onPageChange,
  onRowsPerPageChange,
  getRowClassName,
}: {
  categoryName: string;
  stats: ItemStats;
  statusTab: StatusTab;
  onStatusTabChange: (tab: StatusTab) => void;
  isStatusLoading: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  debouncedSearch: string;
  columns: ReturnType<typeof getItemColumns>;
  items: ItemData[];
  search: string;
  onSearchChange: (value: string) => void;
  isItemsLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  getRowClassName: (row: Row<ItemData>) => string | undefined;
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ITEM_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <StatusTabs
        activeTab={statusTab}
        stats={stats}
        onChange={onStatusTabChange}
        isLoading={isStatusLoading}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Items in {categoryName}
              </CardTitle>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {pagination.total.toLocaleString()} {pagination.total === 1 ? "item" : "items"}
                {debouncedSearch || statusTab !== "all" ? " match your filters" : ""}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={items}
            searchKey="itemDisplayName"
            searchPlaceholder="Search by product name, store name, item number, or UPC..."
            emptyMessage="No items match your filters"
            searchValue={search}
            onSearchChange={onSearchChange}
            loading={isItemsLoading}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.limit}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            getRowClassName={getRowClassName}
          />
        </CardContent>
      </Card>
    </>
  );
}
