"use client";

import { useEffect, useState } from "react";

interface IpApiResponse {
  country_name: string;
  country_code: string;
}

export interface UserCountryResult {
  countryName: string | null;
  countryCode: string | null;
  isLoading: boolean;
  error: string | null;
}

const SESSION_KEY = "fg_user_country";

function readCache(): IpApiResponse | null {
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as IpApiResponse;
  } catch {
    return null;
  }
}

/**
 * Detects viewer country via IP (works with VPN).
 * Re-fetches on mount so a mid-session VPN change is picked up.
 */
export function useUserCountry(): UserCountryResult {
  const [result, setResult] = useState<UserCountryResult>(() => {
    const cached = typeof window !== "undefined" ? readCache() : null;
    if (cached?.country_code) {
      return {
        countryName: cached.country_name ?? null,
        countryCode: cached.country_code ?? null,
        isLoading: true, // still re-validate against current IP
        error: null,
      };
    }
    return {
      countryName: null,
      countryCode: null,
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    let cancelled = false;

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<IpApiResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
        } catch {
          // Ignore storage errors
        }
        setResult({
          countryName: data.country_name ?? null,
          countryCode: data.country_code ?? null,
          isLoading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const cached = readCache();
        if (cached?.country_code) {
          setResult({
            countryName: cached.country_name ?? null,
            countryCode: cached.country_code ?? null,
            isLoading: false,
            error: null,
          });
          return;
        }
        setResult({
          countryName: null,
          countryCode: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to detect country",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}
