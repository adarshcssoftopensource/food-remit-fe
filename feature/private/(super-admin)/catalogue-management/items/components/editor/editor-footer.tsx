import { PackagePlus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

type EditorFooterProps = {
  isEditing: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  savedCount: number;
  onCancel: () => void;
  onSaveAndAddAnother: () => void;
};

export function EditorFooter({
  isEditing,
  isDirty,
  isSubmitting,
  savedCount,
  onCancel,
  onSaveAndAddAnother,
}: EditorFooterProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur sm:px-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-950/95">
      <p className="hidden text-xs text-slate-500 lg:block">
        <span className="text-destructive">*</span> Required ·{" "}
        {isDirty ? "Unsaved changes" : "No unsaved changes"}
      </p>
      <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 rounded-xl px-3.5 text-xs sm:h-10 sm:px-5 sm:text-sm"
        >
          {savedCount > 0 ? "Done" : "Cancel"}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveAndAddAnother}
            disabled={isSubmitting}
            className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary h-9 rounded-xl px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
          >
            <PackagePlus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            Save &amp; add another
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="h-9 rounded-xl px-4 text-xs sm:h-10 sm:px-5 sm:text-sm"
        >
          {!isSubmitting && <Save className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />}
          {isEditing ? "Save changes" : "Save item"}
        </Button>
      </div>
    </div>
  );
}
