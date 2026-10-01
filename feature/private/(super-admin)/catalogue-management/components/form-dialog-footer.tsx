import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormDialogFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  entityLabel: string;
}

export function FormDialogFooter({
  onCancel,
  isSubmitting,
  isEditing,
  entityLabel,
}: FormDialogFooterProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7 dark:border-slate-800 dark:bg-slate-900/40">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="h-10 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 rounded-xl px-5 font-semibold shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{isEditing ? `Update ${entityLabel}` : `Create ${entityLabel}`}</>
        )}
      </Button>
    </div>
  );
}
