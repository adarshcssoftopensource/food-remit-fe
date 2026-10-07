"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { BasketStore } from "../types/basket.types";

const STORAGE_KEY = "food-remit:basket-active-store";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const getSnapshot = () => window.localStorage.getItem(STORAGE_KEY);
const getServerSnapshot = () => null;

/**
 * The Store whose Baskets the vendor is managing. Vendors with several stores
 * can switch; the choice is remembered across pages and sessions.
 */
export function useActiveBasketStore() {
  const { data, isLoading } = useApiQuery<{ data: BasketStore[] }>(
    API_CACHE_KEYS.BASKET_STORES,
    BASKET_ENDPOINTS.STORES,
    { staleTime: 5 * 60 * 1000 },
  );
  const storedId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const stores = useMemo(() => data?.data ?? [], [data]);
  const activeStore = stores.find((s) => s.id === storedId) ?? stores[0] ?? null;

  const setActiveStoreId = useCallback((id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    listeners.forEach((listener) => listener());
  }, []);

  return {
    stores,
    activeStore,
    activeStoreId: activeStore?.id,
    setActiveStoreId,
    isLoading,
  };
}
