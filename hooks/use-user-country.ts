"use client";

import { useEffect, useState } from "react";

interface IpApiResponse {
  country_name: string;
  country_code: string;
}

interface UserCountryResult {
  countryName: string | null;
  countryCode: string | null;
  isLoading: boolean;
  error: string | null;
}

const SESSION_KEY = "fg_user_country";

export function useUserCountry(): UserCountryResult {
  const [result, setResult] = useState<UserCountryResult>(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as IpApiResponse;
        return {
          countryName: parsed.country_name,
          countryCode: parsed.country_code,
          isLoading: false,
          error: null,
        };
      }
    } catch {
      // sessionStorage not available (SSR), or parse failed
    }
    return {
      countryName: null,
      countryCode: null,
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    if (!result.isLoading) return;

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
  }, [result.isLoading]);

  return result;
}
