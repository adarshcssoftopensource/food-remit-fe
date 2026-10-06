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
    <div className="sticky bottom-0 z-20 mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800 dark:bg-slate-950/95">
      <p className="hidden text-xs text-slate-500 sm:block">
        <span className="text-destructive">*</span> Required ·{" "}
        {isDirty ? "Unsaved changes" : "No unsaved changes"}
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 rounded-xl px-5"
        >
          {savedCount > 0 ? "Done" : "Cancel"}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveAndAddAnother}
            disabled={isSubmitting}
            className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary h-10 rounded-xl px-5"
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Save &amp; add another
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="h-10 min-w-36 rounded-xl px-5"
        >
          {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
          {isEditing ? "Save changes" : "Save item"}
        </Button>
      </div>
    </div>
  );
}
