"use client";

import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqFormFooterProps {
  selectedCategory?: string;
  completedCount: number;
  isSubmitting: boolean;
  submitLabel: string;
  onSaveAndAddAnother?: () => void;
}

export function FaqFormFooter({
  selectedCategory,
  completedCount,
  isSubmitting,
  submitLabel,
  onSaveAndAddAnother,
}: FaqFormFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="text-secondary-foreground flex items-center gap-2 text-xs">
        <span>Active category:</span>
        <Badge variant="outline" className="font-semibold text-slate-700 capitalize">
          {selectedCategory || "General"}
        </Badge>
        <span>•</span>
        <span
          className={cn(
            "font-medium",
            completedCount === 5 ? "text-emerald-600" : "text-secondary-foreground",
          )}
        >
          {completedCount}/5 languages filled
        </span>
      </div>
      <div className="flex items-center gap-2">
        {onSaveAndAddAnother && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="h-11 rounded-xl border-emerald-300 font-semibold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
            onClick={onSaveAndAddAnother}
          >
            <Plus className="mr-1 size-4" /> Add &amp; Add Another
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-11 min-w-36 rounded-xl px-10 font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
