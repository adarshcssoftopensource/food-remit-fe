"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftRight, LogOut, Plus } from "lucide-react";
import { ItemCsvToolbar } from "../../items/components/csv/item-csv-toolbar";
import type { WorkspaceCategory } from "../hooks/use-category-workspace";

interface WorkspaceCategoryActionsProps {
  category: WorkspaceCategory;
  canWrite: boolean;
  isStoreManager: boolean;
  isOpeningEditor: boolean;
  onExit: () => void;
  onChangeCategory: () => void;
  onAddItem: () => void;
}

export function WorkspaceCategoryActions({
  category,
  canWrite,
  isStoreManager,
  isOpeningEditor,
  onExit,
  onChangeCategory,
  onAddItem,
}: WorkspaceCategoryActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
      <Button variant="ghost" onClick={onExit} className="gap-2 rounded-xl text-slate-600">
        <LogOut className="h-4 w-4" />
        Exit Category
      </Button>
      <Button variant="outline" onClick={onChangeCategory} className="gap-2 rounded-xl">
        <ArrowLeftRight className="h-4 w-4" />
        Change Category
      </Button>
      {canWrite && isStoreManager && (
        <ItemCsvToolbar
          className="contents"
          category={{ id: category.id, categoryName: category.categoryName }}
        />
      )}
      {canWrite && (
        <Button
          onClick={onAddItem}
          disabled={isOpeningEditor}
          isLoading={isOpeningEditor}
          className="gap-2 rounded-xl shadow-sm"
        >
          {!isOpeningEditor && <Plus className="h-4 w-4" />}
          {isOpeningEditor ? "Opening…" : "Add Item"}
        </Button>
      )}
    </div>
  );
}
