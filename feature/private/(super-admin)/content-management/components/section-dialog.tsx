"use client";

import { PencilLine, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ContentPageSection } from "../types";
import { useSectionDialog } from "../hooks/use-section-dialog";
import { SectionLanguageTabs } from "./section-dialog/section-language-tabs";
import { SectionLanguageEditor } from "./section-dialog/section-language-editor";
import { SectionDialogFooter } from "./section-dialog/section-dialog-footer";

export type SectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: ContentPageSection | null;
  sectionIndex?: number;
  onSave: (section: ContentPageSection, options?: { keepOpen?: boolean }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function SectionDialog({
  open,
  onOpenChange,
  section,
  sectionIndex,
  onSave,
  isSubmitting = false,
}: SectionDialogProps) {
  const {
    activeLang,
    setActiveLang,
    isTranslating,
    isTranslatingAll,
    currentInternalIndex,
    titleTranslations,
    descTranslations,
    errors,
    isEditing,
    displayIndex,
    copyFromEnglish,
    handleTranslateAll,
    handleTitleChange,
    handleDescChange,
    completedCount,
    handleSubmit,
    handleSaveAndAddAnother,
    currentLangMeta,
  } = useSectionDialog({
    section,
    sectionIndex,
    onSave,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <DialogHeader className="from-primary/10 border-b bg-linear-to-r via-emerald-50/60 to-transparent p-6 pb-5">
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-slate-900">
              <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-2xl shadow-sm">
                {isEditing ? <PencilLine className="size-5" /> : <Plus className="size-5" />}
              </div>
              <span>{isEditing ? `Edit Section ${displayIndex}` : `Add New Section`}</span>
            </DialogTitle>
            <DialogDescription className="mt-1 text-center text-sm text-slate-500">
              Provide section title and description across all 5 supported languages.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="bg-white">
            <div className="space-y-6 p-6">
              <SectionLanguageTabs
                activeLang={activeLang}
                onSelectLang={setActiveLang}
                completedCount={completedCount}
                titleTranslations={titleTranslations}
                descTranslations={descTranslations}
                errors={errors}
                onTranslateAll={handleTranslateAll}
                isTranslatingAll={isTranslatingAll}
              />

              <SectionLanguageEditor
                activeLang={activeLang}
                currentLangMeta={currentLangMeta}
                titleTranslations={titleTranslations}
                descTranslations={descTranslations}
                errors={errors}
                displayIndex={displayIndex}
                currentInternalIndex={currentInternalIndex}
                onTitleChange={handleTitleChange}
                onDescChange={handleDescChange}
                onCopyFromEnglish={copyFromEnglish}
                isTranslating={isTranslating}
              />
            </div>

            <SectionDialogFooter
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
              onSaveAndAddAnother={handleSaveAndAddAnother}
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
