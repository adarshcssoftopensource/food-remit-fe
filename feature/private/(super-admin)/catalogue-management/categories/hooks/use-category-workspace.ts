"use client";

import { useDebounce } from "@/lib/debounce";
import { ROUTES } from "@/config/routes";
import { useProfile } from "@/providers/profile-provider";
import type { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { getItemColumns } from "../../items/columns/item-columns";
import { useGetItems } from "../../items/hooks/use-get-items";
import type { ItemData } from "../../items/types/item.types";
import { useGetCategory } from "./use-get-category";
import type { ActiveCategory } from "../types/category.types";

export type WorkspaceCategory = NonNullable<ReturnType<typeof useGetCategory>["data"]>;
export type ItemsResponse = ReturnType<typeof useGetItems>["data"];
export type ItemStats = { total: number; active: number; inactive: number };
export type StatusTab = "all" | "ACTIVE" | "INACTIVE";

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

export function useCategoryWorkspace(id: string) {
  const router = useRouter();
  const { profile, needsBankVerification, canViewPlatformFees } = useProfile();
  const canWrite = !needsBankVerification;
  const { isStoreScoped, isStoreManager } = getWorkspaceRoleFlags(profile);

  const { data: category, isLoading: isCategoryLoading } = useGetCategory(id);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [statusTab, setStatusTab] = useState<StatusTab>("ACTIVE");

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
    (item: ItemData) =>
      router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEM_DETAILS(item.id, "category")),
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

  const switchCategory = (nextId: string) => {
    router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(nextId));
  };

  return {
    category,
    activeCategory,
    isCategoryLoading,
    canWrite,
    isStoreScoped,
    isStoreManager,
    isOpeningEditor,
    pickerOpen,
    setPickerOpen,
    lightboxSrc,
    setLightboxSrc,
    openAddItem,
    exitCategory,
    switchCategory,
    search,
    setSearch,
    debouncedSearch,
    page,
    setPage,
    limit,
    setLimit,
    statusTab,
    setStatusTab,
    items,
    pagination,
    stats,
    columns,
    getRowClassName,
    isItemsLoading,
    isFetching,
  };
}
