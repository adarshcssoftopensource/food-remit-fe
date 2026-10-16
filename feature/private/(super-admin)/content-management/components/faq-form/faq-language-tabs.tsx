"use client";

import { Check, Globe, Sparkles } from "lucide-react";
import { type FieldErrors } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FaqFormValues } from "../../schema/content.schema";
import { FAQ_SUPPORTED_LANGUAGES, type FaqLanguageCode } from "../../types";

interface FaqLanguageTabsProps {
  activeLang: FaqLanguageCode;
  onSelectLang: (lang: FaqLanguageCode) => void;
  completedCount: number;
  qTranslations: Record<string, string>;
  aTranslations: Record<string, string>;
  onTranslateAll: () => void;
  isTranslatingAll: boolean;
  isSubmitted: boolean;
  errors: FieldErrors<FaqFormValues>;
}

export function FaqLanguageTabs({
  activeLang,
  onSelectLang,
  completedCount,
  qTranslations,
  aTranslations,
  onTranslateAll,
  isTranslatingAll,
  isSubmitted,
  errors,
}: FaqLanguageTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <Globe className="text-primary size-4 shrink-0" />
          <span className="text-sm font-semibold text-slate-800">
            Language Translations ({FAQ_SUPPORTED_LANGUAGES.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={completedCount === 5 ? "default" : "secondary"}
            className={cn(
              "shrink-0 text-xs font-bold",
              completedCount === 5
                ? "bg-emerald-600 text-white"
                : "border-amber-300 bg-amber-100 text-amber-900",
            )}
          >
            {completedCount} / 5 completed
          </Badge>

          {completedCount < 5 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onTranslateAll}
              disabled={isTranslatingAll}
              isLoading={isTranslatingAll}
              className="h-7 shrink-0 gap-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
              title="Auto-translate English FAQ to all remaining languages"
            >
              <Sparkles className="size-3 text-emerald-600" />
              {isTranslatingAll ? "Translating..." : "Auto-Translate All"}
            </Button>
          )}
        </div>
      </div>

      {/* Responsive Language Tabs: Horizontal scroll on mobile, 5-Grid on sm+ */}
      <div className="scrollbar-none overflow-x-auto rounded-xl bg-slate-100/90 p-1.5">
        <div className="flex min-w-max items-center gap-1.5 sm:grid sm:min-w-0 sm:grid-cols-5">
          {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = activeLang === lang.code;
            const qVal = lang.code === "en" ? qTranslations.en : qTranslations[lang.code];
            const aVal = lang.code === "en" ? aTranslations.en : aTranslations[lang.code];
            const hasQ = Boolean(qVal?.trim());
            const hasA = Boolean(aVal?.trim());
            const isFilled = hasQ && hasA;
            const isPartial = (hasQ || hasA) && !isFilled;
            const hasTabError = Boolean(
              isSubmitted &&
              (errors.questionTranslations?.[lang.code] ||
                errors.answerTranslations?.[lang.code] ||
                (lang.code === "en" && (errors.question || errors.answer))),
            );

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelectLang(lang.code)}
                title={`${lang.fullName} (${lang.nativeLabel}) - Required`}
                className={cn(
                  "relative flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-all outline-none sm:min-w-0 sm:shrink sm:px-1",
                  isActive
                    ? "bg-white font-bold text-emerald-700 shadow-xs ring-1 ring-slate-200"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900",
                  hasTabError && !isActive && "bg-red-50 text-red-600 ring-1 ring-red-200",
                )}
              >
                <span className="shrink-0 text-sm leading-none">{lang.flag}</span>
                <span className="shrink-0 font-bold tracking-wide">{lang.label}</span>
                <span className="shrink-0 text-xs leading-none font-bold text-red-500">*</span>

                {/* Status Indicator */}
                {isFilled ? (
                  <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="size-2.5 stroke-3" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      hasTabError
                        ? "bg-red-500 ring-2 ring-red-200"
                        : isPartial
                          ? "bg-amber-400"
                          : "bg-slate-300",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
