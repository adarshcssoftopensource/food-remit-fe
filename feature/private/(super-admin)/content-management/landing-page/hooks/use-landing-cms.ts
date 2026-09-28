"use client";

import { successToast } from "@/components/toaster";

import type { LandingSectionKey } from "../types";
import { useGetLandingPage } from "./use-get-landing-page";
import { useUpdateLandingSection } from "./use-update-landing-section";

export function useLandingCms() {
  const query = useGetLandingPage(true);
  const updateMutation = useUpdateLandingSection();

  const saveSection = async (
    section: LandingSectionKey,
    data: unknown,
    files?: { fieldname: string; file: File }[],
  ) => {
    if (section === "stats") return;
    const response = await updateMutation.mutateAsync({ section, data, files });
    successToast({
      title: response?.message || `updated successfully`,
    });
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
