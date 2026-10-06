import { ArrowLeftRight, CheckCircle2, FolderOpen, Package2, PackagePlus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { ActiveCategory } from "../../../categories/types/category.types";

type EditorHeaderProps = {
  isEditing: boolean;
  savedCount: number;
  category: ActiveCategory | null;
  onChangeCategory: () => void;
};

export function EditorHeader({
  isEditing,
  savedCount,
  category,
  onChangeCategory,
}: EditorHeaderProps) {
  const categoryName = category?.categoryName ?? "—";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex min-w-0 items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          {isEditing ? <Package2 className="h-6 w-6" /> : <PackagePlus className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {isEditing ? "Edit item" : "Add item"}
            </h1>
            {savedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {savedCount} added this session
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update details, pack / size pricing, stock and images."
              : `New items are saved in ${categoryName}. Use "Save & add another" to keep adding to this category.`}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-2 pl-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="bg-primary/10 text-primary relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {category?.categoryIcon ? (
            <Image
              src={category.categoryIcon}
              alt={categoryName}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <FolderOpen className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500">Category</p>
          <p className="max-w-48 truncate text-sm font-bold text-slate-900 dark:text-white">
            {categoryName}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onChangeCategory}
          className="text-primary hover:text-primary ml-1 h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Change
        </Button>
      </div>
    </div>
  );
}
