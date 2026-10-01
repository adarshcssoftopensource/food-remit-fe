"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, FolderOpen, Package, Pencil } from "lucide-react";
import Image from "next/image";
import type { CategoryData } from "../types/category.types";

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
        {categories.map((category) => {
          const icon = category.categoryIconUrl || category.categoryIcon;
          const isActive = category.status === "ACTIVE";
          const count = category.itemCount ?? 0;

          return (
            <div
              key={category.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(category)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(category);
                }
              }}
              className="group hover:border-primary/40 focus-visible:ring-primary/30 relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-xs transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="bg-primary/10 text-primary relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {icon ? (
                    <Image
                      src={icon}
                      alt={category.categoryName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Edit category"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                    className="h-8 w-8 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-700 focus-visible:opacity-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
        })}
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
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
