"use client";

import { useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

import type { LandingSectionKey } from "../types";
import { useGetLandingPage } from "./use-get-landing-page";
import { useUpdateLandingSection } from "./use-update-landing-section";

export function useLandingCms() {
  const queryClient = useQueryClient();
  const query = useGetLandingPage(true);
  const updateMutation = useUpdateLandingSection();

  const saveSection = async (section: LandingSectionKey, data: unknown, image?: File | null) => {
    if (section === "stats") return;
    await updateMutation.mutateAsync({ section, data, image });
    await queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.LANDING_PAGE });
    await queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.LANDING_PAGE_PUBLIC });
    const label = section.charAt(0).toUpperCase() + section.slice(1);
    successToast({ title: `${label} section updated successfully` });
  };

  return {
    content: query.data?.data?.content,
    updatedAt: query.data?.data?.updatedAt,
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving: updateMutation.isPending,
    saveSection,
    refetch: query.refetch,
  };
}
