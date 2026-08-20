"use client";

import { useCallback, useState } from "react";

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  streetAddress: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  name?: string;
}

export interface UseGooglePlacesReturn {
  isReady: boolean;
  error: string | null;
  getSuggestions: (input: string) => Promise<PlacePrediction[]>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: "no-store" });
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function useGooglePlaces(): UseGooglePlacesReturn {
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (input: string): Promise<PlacePrediction[]> => {
    const query = input.trim();
    if (!query) return [];

    try {
      const data = await fetchJson<{ predictions: PlacePrediction[] }>(
        `/api/places/autocomplete?input=${encodeURIComponent(query)}`,
      );
      setError(null);
      return data.predictions ?? [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch suggestions";
      console.error("[useGooglePlaces] suggestions:", message);
      setError(message);
      return [];
    }
  }, []);

  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!placeId) return null;

    try {
      const data = await fetchJson<PlaceDetails>(
        `/api/places/details?placeId=${encodeURIComponent(placeId)}`,
      );
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch place details";
      console.error("[useGooglePlaces] details:", message);
      setError(message);
      return null;
    }
  }, []);

  return { isReady: true, error, getSuggestions, getPlaceDetails };
}
