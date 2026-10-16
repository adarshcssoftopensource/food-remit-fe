"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { RichTextEditor, getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { type FaqLanguageCode, type FaqLanguageMeta } from "../../types";

interface FaqLanguageEditorProps {
  activeLang: FaqLanguageCode;
  currentLangMeta: FaqLanguageMeta;
  qTranslations: Record<string, string>;
  aTranslations: Record<string, string>;
  onQuestionChange: (lang: FaqLanguageCode, val: string) => void;
  onAnswerChange: (lang: FaqLanguageCode, val: string) => void;
  onCopyFromEnglish: () => void;
  isTranslating: boolean;
  currentQError?: string;
  currentAError?: string;
}

export function FaqLanguageEditor({
  activeLang,
  currentLangMeta,
  qTranslations,
  aTranslations,
  onQuestionChange,
  onAnswerChange,
  onCopyFromEnglish,
  isTranslating,
  currentQError,
  currentAError,
}: FaqLanguageEditorProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
      <div className="flex flex-col gap-2.5 border-b border-slate-200/80 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-xl">{currentLangMeta.flag}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-slate-900">
                {currentLangMeta.fullName}
              </span>
              <Badge variant="outline" className="shrink-0 text-[10px] font-semibold uppercase">
                {currentLangMeta.label}
              </Badge>
            </div>
            <span className="text-xs text-slate-500">{currentLangMeta.nativeLabel}</span>
          </div>
        </div>

        {activeLang !== "en" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyFromEnglish}
            disabled={isTranslating}
            isLoading={isTranslating}
            className="h-8 w-full shrink-0 justify-center gap-1.5 rounded-lg border-emerald-300 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 hover:text-emerald-950 sm:w-auto"
            title={`Translate English question and answer to ${currentLangMeta.fullName}`}
          >
            <Sparkles className="size-3.5 shrink-0 text-emerald-600" />
            <span className="truncate">
              {isTranslating
                ? `Translating to ${currentLangMeta.label}...`
                : `Copy & Translate from English`}
            </span>
          </Button>
        )}
      </div>

      {/* Question Rich Text Editor for Active Language */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <FieldLabel className="text-xs font-semibold text-slate-800">
            Question ({currentLangMeta.fullName}) <span className="text-red-500">*</span>
          </FieldLabel>
          <span className="text-[11px] text-slate-400">
            Rich text • {getHtmlTextLength(qTranslations[activeLang])} characters
          </span>
        </div>
        <RichTextEditor
          key={`q-${activeLang}`}
          value={qTranslations[activeLang] || ""}
          onChange={(val) => onQuestionChange(activeLang, val)}
          placeholder={`Enter question in ${currentLangMeta.fullName} (${currentLangMeta.label})...`}
          hasError={Boolean(currentQError)}
          minHeight="60px"
          preset="minimal"
        />
        {currentQError ? <p className="text-xs font-medium text-red-500">{currentQError}</p> : null}
      </div>

      {/* Answer Rich Text Editor for Active Language */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <FieldLabel className="text-xs font-semibold text-slate-800">
            Answer ({currentLangMeta.fullName}) <span className="text-red-500">*</span>
          </FieldLabel>
          <span className="text-[11px] text-slate-400">
            Rich text • {getHtmlTextLength(aTranslations[activeLang])} characters
          </span>
        </div>
        <RichTextEditor
          key={`a-${activeLang}`}
          value={aTranslations[activeLang] || ""}
          onChange={(val) => onAnswerChange(activeLang, val)}
          placeholder={`Enter answer in ${currentLangMeta.fullName} (${currentLangMeta.label})...`}
          hasError={Boolean(currentAError)}
          minHeight="140px"
          preset="compact"
        />
        {currentAError ? <p className="text-xs font-medium text-red-500">{currentAError}</p> : null}
      </div>
    </div>
  );
}
