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
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20 gap-2 self-start rounded-xl px-5 shadow-xs transition-all hover:shadow-md sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Screen
        </Button>
      </div>

      {/* Overview Metric Bar & Quick Filter Controls */}
      <div className="border-border/80 bg-card/80 flex flex-col gap-4 rounded-2xl border p-4 shadow-xs backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
        {/* Metric Badges / Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border-border/80 bg-background text-muted-foreground hover:border-border hover:text-foreground border",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Screens</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                statusFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {totalScreens}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border-border/80 bg-background text-muted-foreground hover:border-border hover:text-foreground border",
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Active</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                statusFilter === "active"
                  ? "bg-white/25 text-white"
                  : "dark:bg-emerald-950/60 dark:text-emerald-300",
              )}
            >
              {activeScreens}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              statusFilter === "inactive"
                ? "bg-slate-700 text-white shadow-xs dark:bg-slate-700"
                : "border-border/80 bg-background text-muted-foreground hover:border-border hover:text-foreground border",
            )}
          >
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Inactive</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                statusFilter === "inactive"
                  ? "bg-white/25 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {inactiveScreens}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/80 bg-background/90 focus-visible:border-primary focus-visible:ring-primary/20 h-9 w-full rounded-xl pl-9 text-xs shadow-none"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border/80 bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-xs"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 flex-1 rounded-lg" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <div className="border-border/60 mt-auto flex gap-3 border-t p-4">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTutorials.length === 0 && (
        <div className="border-border bg-card/50 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <div className="border-primary/20 bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl border">
            <Smartphone className="h-7 w-7" />
          </div>
          <h3 className="text-foreground mt-4 text-base font-semibold">
            {searchQuery || statusFilter !== "all"
              ? "No matching screens found"
              : "No onboarding screens yet"}
          </h3>
          <p className="text-muted-foreground mt-1.5 max-w-sm text-xs leading-relaxed">
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 gap-2 rounded-xl"
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
              className="border-border/80 bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border p-0 shadow-xs"
            >
              {/* Media Header with Badge Overlays */}
              <div className="bg-muted/40 relative aspect-16/10 w-full overflow-hidden">
                <Image
                  src={tutorial.imageUrl}
                  alt={tutorial.title || "Onboarding Screen Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />

                {/* Top subtle gradient for badge contrast */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/55 via-black/15 to-transparent" />

                {/* Sequence Step Tag */}
                <div className="absolute top-3 left-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md">
                    <Smartphone className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Screen #{index + 1}</span>
                  </div>
                </div>

                {/* Active / Inactive Status Pill */}
                <div className="absolute top-3 right-3">
                  {tutorial.isActive ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-medium text-white/80 shadow-xs backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                      <span>Inactive</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="flex flex-1 flex-col justify-between space-y-3.5 p-5">
                {/* Title & Step Badge */}
                <div className="flex items-start gap-3">
                  <div className="border-primary/20 bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs">
                    <span className="text-xs font-bold tracking-tight">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      title={tutorial.title || "Untitled Screen"}
                      className="text-foreground truncate text-base font-bold tracking-tight"
                    >
                      {tutorial.title || "Untitled Screen"}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-[11px] font-medium">
                      <span className="bg-primary/70 inline-block h-1.5 w-1.5 rounded-full" />
                      <span>Onboarding walkthrough</span>
                    </p>
                  </div>
                </div>

                {/* Description Box */}
                <div className="border-border/60 bg-muted/30 rounded-xl border p-3.5">
                  <p
                    title={tutorial.description || ""}
                    className="text-muted-foreground line-clamp-3 min-h-[3.6rem] text-xs leading-relaxed"
                  >
                    {tutorial.description?.trim() ? (
                      tutorial.description
                    ) : (
                      <span className="text-muted-foreground/60 italic">
                        No description provided for this screen.
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>

              {/* Card Footer with Actions */}
              <div className="border-border/60 bg-muted/20 mt-auto flex items-center gap-2.5 border-t px-5 py-3.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingTutorial(tutorial)}
                  className="border-border/80 bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-9 flex-1 gap-1.5 rounded-xl text-xs font-medium transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleEdit(tutorial)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 flex-1 gap-1.5 rounded-xl text-xs font-medium shadow-xs transition-colors"
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
