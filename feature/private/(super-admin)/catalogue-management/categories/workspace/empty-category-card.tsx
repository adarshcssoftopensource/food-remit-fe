"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackagePlus, Plus } from "lucide-react";

interface EmptyCategoryCardProps {
  categoryName: string;
  canWrite: boolean;
  isOpeningEditor: boolean;
  onAddItem: () => void;
}

export function EmptyCategoryCard({
  categoryName,
  canWrite,
  isOpeningEditor,
  onAddItem,
}: EmptyCategoryCardProps) {
  return (
    <Card className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
          <PackagePlus className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            No items in {categoryName} yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-slate-500">
            Every item you add here is saved under {categoryName}. You can add several items in a
            row without choosing the category again.
          </p>
        </div>
        {canWrite && (
          <Button
            onClick={onAddItem}
            disabled={isOpeningEditor}
            isLoading={isOpeningEditor}
            className="mt-2 gap-2 rounded-xl"
          >
            {!isOpeningEditor && <Plus className="h-4 w-4" />}
            Add your first item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
