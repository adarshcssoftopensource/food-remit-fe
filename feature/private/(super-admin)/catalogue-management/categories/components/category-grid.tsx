"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Package,
  Pencil,
  Trash2,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { CategoryData } from "../types/category.types";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { useUpdateCategoryStatus } from "../hooks/use-update-category-status";

interface CategoryGridProps {
  categories: CategoryData[];
  loading?: boolean;
  canWrite?: boolean;
  onOpen: (category: CategoryData) => void;
  onEdit: (category: CategoryData) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CategoryGridCardProps {
  category: CategoryData;
  canWrite: boolean;
  onOpen: (category: CategoryData) => void;
  onEdit: (category: CategoryData) => void;
  setCategoryToDelete: (category: CategoryData) => void;
  setLightboxSrc: (src: string) => void;
}

function CategoryGridCard({
  category,
  canWrite,
  onOpen,
  onEdit,
  setCategoryToDelete,
  setLightboxSrc,
}: CategoryGridCardProps) {
  const [isActive, setIsActive] = useState(category.status === "ACTIVE");
  const { mutateAsync: updateStatus, isPending } = useUpdateCategoryStatus(category.id);

  const icon = category.categoryIconUrl || category.categoryIcon;
  const count = category.itemCount ?? 0;

  const handleStatusChange = async (checked: boolean) => {
    if (!canWrite) return;
    setIsActive(checked);
    try {
      await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({ description: "Category status updated successfully" });
    } catch {
      setIsActive(!checked);
    }
  };

  return (
    <div className="group hover:border-primary/40 has-[>button:focus-visible]:ring-primary/30 relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-xs transition outline-none hover:-translate-y-0.5 hover:shadow-md has-[>button:focus-visible]:ring-2 dark:border-slate-800 dark:bg-slate-950">
      <button
        type="button"
        aria-label={category.categoryName}
        onClick={() => onOpen(category)}
        className="absolute inset-0 z-[1] cursor-pointer outline-none"
      />
      <div className="flex items-start gap-3 p-4">
        <div className="bg-primary/10 text-primary relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl">
          {icon ? (
            <>
              <Image
                src={icon}
                alt={category.categoryName}
                fill
                sizes="56px"
                className="object-cover"
              />

              <button
                type="button"
                aria-label="View full image"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxSrc(icon);
                }}
                className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/35 group-hover:opacity-100"
              >
                <ZoomIn className="h-5 w-5 text-white drop-shadow-md" />
              </button>
            </>
          ) : (
            <FolderOpen className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-bold text-slate-900 dark:text-white"
            title={category.categoryName}
          >
            {category.categoryName}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                isActive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Package className="h-3.5 w-3.5" />
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
        {canWrite && (
          <div className="relative z-10 flex items-center gap-1 opacity-100 transition-opacity focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={isActive}
                onCheckedChange={handleStatusChange}
                disabled={isPending || !canWrite}
                className="scale-75 data-[state=checked]:bg-green-500"
                title={isActive ? "Active" : "Inactive"}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Edit category"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
              }}
              className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Delete category"
              onClick={(e) => {
                e.stopPropagation();
                setCategoryToDelete(category);
              }}
              className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="group-hover:bg-primary/5 mt-auto flex items-center justify-between border-t border-slate-100 px-4 py-3 transition-colors dark:border-slate-800">
        <span className="group-hover:text-primary text-sm font-semibold text-slate-600 dark:text-slate-300">
          Open &amp; manage items
        </span>
        <ArrowRight className="group-hover:text-primary h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}

export function CategoryGrid({
  categories,
  loading,
  canWrite,
  onOpen,
  onEdit,
  currentPage,
  totalPages,
  onPageChange,
}: CategoryGridProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory(
    categoryToDelete?.id ?? "",
  );

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await deleteCategory();
      setCategoryToDelete(null);
      successToast({
        title: "Category Deleted",
        description: response?.message || "Category has been deleted successfully.",
      });
    } catch {}
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <FolderOpen className="h-12 w-12 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          No categories found
        </p>
        <p className="text-xs text-slate-400">Create a category to start adding items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryGridCard
            key={category.id}
            category={category}
            canWrite={canWrite ?? false}
            onOpen={onOpen}
            onEdit={onEdit}
            setCategoryToDelete={setCategoryToDelete}
            setLightboxSrc={setLightboxSrc}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="mr-2 text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ImageLightbox src={lightboxSrc} alt="Category image" onClose={() => setLightboxSrc(null)} />

      <ConfirmationDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title="Delete Category"
        description={`Are you sure you want to delete ${categoryToDelete?.categoryName}? It will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete Category"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
