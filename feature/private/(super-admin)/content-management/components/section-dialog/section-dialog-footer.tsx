"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SectionDialogFooterProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSaveAndAddAnother: () => void;
}

export function SectionDialogFooter({
  isEditing,
  isSubmitting,
  onCancel,
  onSaveAndAddAnother,
}: SectionDialogFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
      <span className="text-xs text-slate-500">All 5 language translations are required.</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl font-medium"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="h-10 rounded-xl border-emerald-300 font-semibold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
            onClick={onSaveAndAddAnother}
          >
            <Plus className="mr-1 size-3.5" /> Save &amp; Add Another
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="h-10 min-w-28 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
        >
          {isEditing ? "Update Section" : "Save Section"}
        </Button>
      </div>
    </div>
  );
}
