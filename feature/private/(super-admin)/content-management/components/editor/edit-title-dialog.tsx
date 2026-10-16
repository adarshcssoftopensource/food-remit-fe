"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface EditTitleDialogProps {
  open: boolean;
  tempTitle: string;
  onOpenChange: (open: boolean) => void;
  onTempTitleChange: (val: string) => void;
  onApplyTitle: () => void;
}

const inputClass =
  "h-11 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

export function EditTitleDialog({
  open,
  tempTitle,
  onOpenChange,
  onTempTitleChange,
  onApplyTitle,
}: EditTitleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Edit Page Title</DialogTitle>
          <DialogDescription>
            Update the title displayed at the top of this content page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <FieldLabel className="text-xs font-semibold">Title</FieldLabel>
            <Input
              value={tempTitle}
              onChange={(e) => onTempTitleChange(e.target.value)}
              placeholder="Enter page title"
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={onApplyTitle}
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
