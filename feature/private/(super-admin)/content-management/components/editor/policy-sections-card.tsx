"use client";

import { ArrowDown, ArrowUp, Check, FileText, PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlainText } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import {
  FAQ_SUPPORTED_LANGUAGES,
  type ContentPageSection,
  type FaqLanguageCode,
} from "../../types";

interface PolicySectionsCardProps {
  sections: ContentPageSection[];
  adminViewLang: FaqLanguageCode;
  onAdminViewLangChange: (lang: FaqLanguageCode) => void;
  onOpenAddSection: () => void;
  onOpenEditSection: (sec: ContentPageSection, idx: number) => void;
  onPromptDeleteSection: (sec: ContentPageSection, idx: number) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  isPending: boolean;
}

export function PolicySectionsCard({
  sections,
  adminViewLang,
  onAdminViewLangChange,
  onOpenAddSection,
  onOpenEditSection,
  onPromptDeleteSection,
  onMoveUp,
  onMoveDown,
  isPending,
}: PolicySectionsCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/40 to-transparent py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <FileText className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Policy Sections</CardTitle>
              <p className="text-xs text-slate-500">
                {sections.length} numbered {sections.length === 1 ? "section" : "sections"}{" "}
                configured
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 text-xs">
              <span className="pl-1 text-[11px] font-medium text-slate-400">Sorted by:</span>
              {FAQ_SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onAdminViewLangChange(lang.code)}
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-bold transition-all",
                    adminViewLang === lang.code
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100",
                  )}
                  title={lang.fullName}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No sections added yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Click &quot;Add Section&quot; to configure your first multilingual clause.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={onOpenAddSection}
            >
              <Plus className="mr-1.5 size-4" /> Add Section
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((sec, idx) => {
              const titleTrans = sec.titleTranslations || {};
              const descTrans = sec.descriptionTranslations || {};

              const displayTitle =
                adminViewLang === "en"
                  ? titleTrans.en || sec.title || `Section ${idx + 1}`
                  : titleTrans[adminViewLang] || titleTrans.en || sec.title || `Section ${idx + 1}`;

              const displayDesc =
                adminViewLang === "en"
                  ? descTrans.en || sec.description || ""
                  : descTrans[adminViewLang] || descTrans.en || sec.description || "";

              return (
                <div
                  key={sec.id || idx}
                  className="group relative rounded-xl border border-slate-200/90 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                        {idx + 1}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="line-clamp-1 text-sm font-bold text-slate-900">
                            {getPlainText(displayTitle)}
                          </h4>
                        </div>
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {getPlainText(displayDesc) || "—"}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-1.5">
                          {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
                            const hasT = Boolean(titleTrans[lang.code]?.trim());
                            const hasD = Boolean(descTrans[lang.code]?.trim());
                            const isOk = hasT && hasD;
                            return (
                              <span
                                key={lang.code}
                                className={cn(
                                  "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                                  isOk
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-600",
                                )}
                                title={`${lang.fullName}: ${isOk ? "Complete" : "Incomplete"}`}
                              >
                                {isOk ? <Check className="size-2.5" /> : "!"}
                                {lang.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        disabled={idx === 0 || isPending}
                        onClick={() => onMoveUp(idx)}
                        title="Move section up"
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        disabled={idx === sections.length - 1 || isPending}
                        onClick={() => onMoveDown(idx)}
                        title="Move section down"
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-lg text-slate-400 hover:text-emerald-700"
                        onClick={() => onOpenEditSection(sec, idx)}
                        title="Edit section"
                      >
                        <PencilLine className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-lg text-slate-400 hover:text-red-600"
                        onClick={() => onPromptDeleteSection(sec, idx)}
                        title="Delete section"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
