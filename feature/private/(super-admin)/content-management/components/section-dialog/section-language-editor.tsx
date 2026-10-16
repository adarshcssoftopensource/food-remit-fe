"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { RichTextEditor, getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { type FaqLanguageCode, type FaqLanguageMeta } from "../../types";

interface SectionLanguageEditorProps {
  activeLang: FaqLanguageCode;
  currentLangMeta: FaqLanguageMeta;
  titleTranslations: Record<string, string>;
  descTranslations: Record<string, string>;
  errors: Record<string, { title?: string; desc?: string }>;
  displayIndex: number;
  currentInternalIndex: number;
  onTitleChange: (val: string) => void;
  onDescChange: (val: string) => void;
  onCopyFromEnglish: () => void;
  isTranslating: boolean;
}

export function SectionLanguageEditor({
  activeLang,
  currentLangMeta,
  titleTranslations,
  descTranslations,
  errors,
  displayIndex,
  currentInternalIndex,
  onTitleChange,
  onDescChange,
  onCopyFromEnglish,
  isTranslating,
}: SectionLanguageEditorProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
      {activeLang !== "en" && (
        <div className="flex items-center justify-end border-b border-slate-200/80 pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyFromEnglish}
            disabled={isTranslating}
            isLoading={isTranslating}
            className="h-8 w-full shrink-0 justify-center gap-1.5 rounded-lg border-emerald-300 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 hover:text-emerald-950 sm:w-auto"
            title={`Translate English title and description to ${currentLangMeta.fullName}`}
          >
            <Sparkles className="size-3.5 shrink-0 text-emerald-600" />
            <span className="truncate">
              {isTranslating
                ? `Translating to ${currentLangMeta.label}...`
                : `Copy & Translate from English`}
            </span>
          </Button>
        </div>
      )}

      {/* Section Title Rich Text Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel className="text-xs font-semibold text-slate-800">
            Section Title ({currentLangMeta.label}) <span className="text-red-500">*</span>
          </FieldLabel>
          <span className="text-[11px] text-slate-400">
            Rich text • {getHtmlTextLength(titleTranslations[activeLang])} characters
          </span>
        </div>
        <RichTextEditor
          key={`title-${activeLang}-${currentInternalIndex}`}
          value={titleTranslations[activeLang] || ""}
          onChange={onTitleChange}
          placeholder={`e.g., "${displayIndex}. Scope of Grocery Remittance"`}
          hasError={Boolean(errors[activeLang]?.title)}
          minHeight="60px"
          preset="minimal"
        />
        {errors[activeLang]?.title ? (
          <p className="text-xs font-medium text-red-500">{errors[activeLang]?.title}</p>
        ) : null}
      </div>

      {/* Section Description Rich Text Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel className="text-xs font-semibold text-slate-800">
            Section Description ({currentLangMeta.label}) <span className="text-red-500">*</span>
          </FieldLabel>
          <span className="text-[11px] text-slate-400">
            Rich text • {getHtmlTextLength(descTranslations[activeLang])} characters
          </span>
        </div>
        <RichTextEditor
          key={`desc-${activeLang}-${currentInternalIndex}`}
          value={descTranslations[activeLang] || ""}
          onChange={onDescChange}
          placeholder={`Enter section description in ${currentLangMeta.fullName}...`}
          hasError={Boolean(errors[activeLang]?.desc)}
          minHeight="140px"
          preset="standard"
        />
        {errors[activeLang]?.desc ? (
          <p className="text-xs font-medium text-red-500">{errors[activeLang]?.desc}</p>
        ) : null}
      </div>
    </div>
  );
}
