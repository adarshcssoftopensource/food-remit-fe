"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Edit,
  Layers,
  Plus,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { successToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { cn } from "@/lib/utils";

import { FlashImageDialog } from "./components/edit-tutorial-dialog";
import { useDeleteFlashImage } from "./hooks/use-delete-flash-image";
import { FlashImageData, useGetFlashImages } from "./hooks/use-get-flash-images";

export function TutorialManagement() {
  const { data, isLoading } = useGetFlashImages();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [editingTutorial, setEditingTutorial] = useState<FlashImageData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingTutorial, setDeletingTutorial] = useState<FlashImageData | null>(null);
  const { mutateAsync: deleteFlashImage, isPending: isDeleting } = useDeleteFlashImage(
    deletingTutorial?.id || "",
  );
  const queryClient = useQueryClient();

  const handleEdit = (tutorial: FlashImageData) => {
    setEditingTutorial(tutorial);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTutorial(null);
  };

  const handleDelete = async () => {
    if (!deletingTutorial) return;
    try {
      await deleteFlashImage(undefined);
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FLASH_IMAGES });
      successToast({ title: "Flash image deleted successfully" });
      setDeletingTutorial(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Stats
  const totalScreens = data?.data.length || 0;
  const activeScreens = useMemo(
    () => (data?.data || []).filter((item) => item.isActive).length,
    [data],
  );
  const inactiveScreens = totalScreens - activeScreens;

  // Filtered Items
  const filteredTutorials = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => {
      // Status filter
      if (statusFilter === "active" && !item.isActive) return false;
      if (statusFilter === "inactive" && item.isActive) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [data, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Flash & Onboarding Screens"
          description="Design, organize, and manage onboarding tutorial screens for the mobile app."
        />
        <Button
          onClick={() => setIsEditDialogOpen(true)}
          className="gap-2 self-start rounded-xl bg-orange-600 px-5 shadow-sm transition-all hover:bg-orange-700 hover:shadow-md hover:shadow-orange-500/20 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Screen
        </Button>
      </div>

      {/* Overview Metric Bar & Quick Filter Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-md lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900/60">
        {/* Metric Badges / Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                : "border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Screens</span>
            <span
              className={cn(
                "py-0.2 rounded-full px-1.5 text-[10px]",
                statusFilter === "all"
                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              {totalScreens}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Active</span>
            <span
              className={cn(
                "py-0.2 rounded-full px-1.5 text-[10px]",
                statusFilter === "active"
                  ? "bg-white/25 text-white"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
              )}
            >
              {activeScreens}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "inactive"
                ? "bg-slate-700 text-white shadow-xs dark:bg-slate-700"
                : "border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700",
            )}
          >
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Inactive</span>
            <span
              className={cn(
                "py-0.2 rounded-full px-1.5 text-[10px]",
                statusFilter === "inactive"
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
              )}
            >
              {inactiveScreens}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border-slate-200/80 bg-white/90 pl-9 text-xs shadow-none dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <Skeleton className="h-5 flex-1 rounded-lg" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <div className="mt-auto flex gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTutorials.length === 0 && (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Smartphone className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            {searchQuery || statusFilter !== "all"
              ? "No matching screens found"
              : "No onboarding screens yet"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or filter to find what you're looking for."
              : "Get started by adding your first tutorial or flash screen to welcome mobile users."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 rounded-xl text-xs"
            >
              Clear filters
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              size="sm"
              className="mt-4 gap-2 rounded-xl bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              Add First Screen
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && filteredTutorials.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.map((tutorial, index) => (
            <Card
              key={tutorial.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-0 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-xl dark:border-slate-800/90 dark:bg-slate-900/95 dark:hover:border-orange-500/40"
            >
              {/* Media Header with Badge Overlays */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={tutorial.imageUrl}
                  alt={tutorial.title || "Onboarding Screen Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Gradients for text contrast */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Sequence Step Tag */}
                <div className="absolute top-3 left-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md">
                    <Smartphone className="h-3.5 w-3.5 text-orange-400" />
                    <span>Screen #{index + 1}</span>
                  </div>
                </div>

                {/* Active / Inactive Status Pill */}
                <div className="absolute top-3 right-3">
                  {tutorial.isActive ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/95 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/90 px-2.5 py-1 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Inactive</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="flex flex-1 flex-col justify-between space-y-3.5 p-5">
                {/* Title & Icon */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25 transition-transform duration-300 group-hover:scale-105">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      title={tutorial.title || "Untitled Screen"}
                      className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400"
                    >
                      {tutorial.title || "Untitled Screen"}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      Onboarding walkthrough
                    </p>
                  </div>
                </div>

                {/* Description Box */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <p
                    title={tutorial.description || ""}
                    className="line-clamp-3 min-h-[3.8rem] text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    {tutorial.description?.trim() ? (
                      tutorial.description
                    ) : (
                      <span className="text-slate-400 italic dark:text-slate-500">
                        No description provided for this screen.
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>

              {/* Card Footer with Perfectly Aligned Actions */}
              <div className="mt-auto flex items-center gap-2.5 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingTutorial(tutorial)}
                  className="flex-1 gap-1.5 rounded-xl border-slate-200 text-xs font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleEdit(tutorial)}
                  className="flex-1 gap-1.5 rounded-xl bg-orange-600 text-xs font-medium text-white shadow-xs transition-all hover:bg-orange-700 hover:shadow-sm"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Dialog */}
      {isEditDialogOpen && (
        <FlashImageDialog
          key={editingTutorial?.id || "new-flash-image"}
          open={isEditDialogOpen}
          onOpenChange={handleCloseDialog}
          tutorial={editingTutorial}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTutorial && (
        <ConfirmationDialog
          open={!!deletingTutorial}
          onOpenChange={(open) => !open && setDeletingTutorial(null)}
          title="Delete Flash Image"
          description={`Are you sure you want to delete the flash image "${deletingTutorial.title || "Untitled"}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
