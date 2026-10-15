"use client";

import { useMemo } from "react";
import { resolveCurrencyDisplay } from "@/lib/utils/currency";
import type { StoreData } from "@/feature/private/(super-admin)/store-management/types/store-management";

export interface UseCouponCurrencyArgs {
  scope?: "global" | "store";
  storeId?: string;
  isStoreManager?: boolean;
  managerAssignedStore?: {
    country?: string | null;
    countryName?: string | null;
    countryCode?: string | null;
    cityName?: string | null;
  } | null;
  selectedStore?: StoreData | null;
  initialStore?: {
    country?: string | null;
    countryName?: string | null;
  } | null;
}

export function useCouponCurrency({
  scope,
  storeId,
  isStoreManager,
  managerAssignedStore,
  selectedStore,
  initialStore,
}: UseCouponCurrencyArgs) {
  return useMemo(() => {
    // 1. Store manager assigned store currency
    if (isStoreManager && managerAssignedStore) {
      const countryName =
        managerAssignedStore.countryName ||
        managerAssignedStore.country ||
        managerAssignedStore.cityName;
      const countryCode = managerAssignedStore.countryCode;
      const resolved = resolveCurrencyDisplay({ countryName, countryCode });
      return {
        symbol: resolved.symbol,
        code: resolved.code,
        countryName: countryName || "Store Country",
        label: `${countryName || "Store"} (${resolved.code} - ${resolved.symbol})`,
      };
    }

    // 2. Global promotional scope
    if (scope === "global" || !storeId) {
      return {
        symbol: "$",
        code: "USD",
        countryName: "Global",
        label: "Global Currency (USD - $)",
      };
    }

    // 3. Store-specific selection
    const countryName =
      selectedStore?.storeCountryName ||
      selectedStore?.storeCountry ||
      initialStore?.countryName ||
      initialStore?.country;

    if (countryName) {
      const resolved = resolveCurrencyDisplay({ countryName });
      return {
        symbol: resolved.symbol,
        code: resolved.code,
        countryName,
        label: `${countryName} (${resolved.code} - ${resolved.symbol})`,
      };
    }

    return {
      symbol: "$",
      code: "USD",
      countryName: "USD",
      label: "USD ($)",
    };
  }, [scope, storeId, isStoreManager, managerAssignedStore, selectedStore, initialStore]);
}
