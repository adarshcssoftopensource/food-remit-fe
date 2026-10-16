"use client";

import { Check, Globe, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FAQ_SUPPORTED_LANGUAGES, type FaqLanguageCode } from "../../types";

interface SectionLanguageTabsProps {
  activeLang: FaqLanguageCode;
  onSelectLang: (lang: FaqLanguageCode) => void;
  completedCount: number;
  titleTranslations: Record<string, string>;
  descTranslations: Record<string, string>;
  errors: Record<string, { title?: string; desc?: string }>;
  onTranslateAll: () => void;
  isTranslatingAll: boolean;
}

export function SectionLanguageTabs({
  activeLang,
  onSelectLang,
  completedCount,
  titleTranslations,
  descTranslations,
  errors,
  onTranslateAll,
  isTranslatingAll,
}: SectionLanguageTabsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Globe className="text-primary size-4" />
          <span className="text-sm font-semibold text-slate-800">
            Languages ({FAQ_SUPPORTED_LANGUAGES.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={completedCount === 5 ? "default" : "secondary"}
            className={cn(
              "text-xs font-bold",
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
              className="h-7 gap-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
              title="Auto-translate English content to all remaining languages"
            >
              <Sparkles className="size-3 text-emerald-600" />
              {isTranslatingAll ? "Translating..." : "Auto-Translate All"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = activeLang === lang.code;
          const t = titleTranslations[lang.code]?.trim();
          const d = descTranslations[lang.code]?.trim();
          const isFilled = Boolean(t && t.length >= 2 && d && d.length >= 5);
          const hasErr = Boolean(errors[lang.code]);

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLang(lang.code)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all outline-none",
                isSelected
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20"
                  : hasErr
                    ? "border-red-300 bg-red-50/50 text-red-900 hover:border-red-400"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {isFilled ? (
                <div className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                  <Check className="size-2.5" />
                </div>
              ) : hasErr ? (
                <div className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  !
                </div>
              ) : null}
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="text-xs font-bold">{lang.label}</span>
              <span className="line-clamp-1 text-[10px] text-slate-500">{lang.fullName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
