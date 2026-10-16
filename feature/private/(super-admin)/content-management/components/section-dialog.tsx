"use client";

import { Check, Globe, PencilLine, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

import { errorToast, successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { RichTextEditor, getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { translateText } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { FAQ_SUPPORTED_LANGUAGES, type ContentPageSection, type FaqLanguageCode } from "../types";

type SectionDialogProps = {
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
  const [activeLang, setActiveLang] = useState<FaqLanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState<boolean>(false);
  const [currentInternalIndex, setCurrentInternalIndex] = useState<number>(() => sectionIndex ?? 0);

  const [titleTranslations, setTitleTranslations] = useState<Record<string, string>>(() => {
    if (!section) return { en: "", hi: "", es: "", pt: "", fr: "" };
    const tTrans = section.titleTranslations || {};
    return {
      en: tTrans.en || section.title || "",
      hi: tTrans.hi || "",
      es: tTrans.es || "",
      pt: tTrans.pt || "",
      fr: tTrans.fr || "",
      ...tTrans,
    };
  });

  const [descTranslations, setDescTranslations] = useState<Record<string, string>>(() => {
    if (!section) return { en: "", hi: "", es: "", pt: "", fr: "" };
    const dTrans = section.descriptionTranslations || {};
    return {
      en: dTrans.en || section.description || "",
      hi: dTrans.hi || "",
      es: dTrans.es || "",
      pt: dTrans.pt || "",
      fr: dTrans.fr || "",
      ...dTrans,
    };
  });

  const [errors, setErrors] = useState<Record<string, { title?: string; desc?: string }>>({});

  const isEditing = Boolean(section);
  const displayIndex = currentInternalIndex + 1;

  // Auto-translate from English into the active selected language
  const copyFromEnglish = async () => {
    if (activeLang === "en") return;
    const enTitle = titleTranslations.en?.trim() || "";
    const enDesc = descTranslations.en?.trim() || "";

    if (!enTitle && !enDesc) {
      errorToast({ title: "Please enter English title or description first." });
      return;
    }

    setIsTranslating(true);
    try {
      const [translatedTitle, translatedDesc] = await Promise.all([
        enTitle ? translateText(enTitle, activeLang, "en") : Promise.resolve(""),
        enDesc ? translateText(enDesc, activeLang, "en") : Promise.resolve(""),
      ]);

      setTitleTranslations((prev) => ({
        ...prev,
        [activeLang]: translatedTitle || enTitle,
      }));
      setDescTranslations((prev) => ({
        ...prev,
        [activeLang]: translatedDesc || enDesc,
      }));

      // Clear any errors for activeLang
      setErrors((prev) => {
        const next = { ...prev };
        delete next[activeLang];
        return next;
      });

      const targetMeta = FAQ_SUPPORTED_LANGUAGES.find((l) => l.code === activeLang);
      successToast({
        title: `Auto-translated to ${targetMeta?.fullName || activeLang}`,
        description: `Content has been converted to ${targetMeta?.fullName} (${targetMeta?.nativeLabel}).`,
      });
    } catch {
      // Fallback: copy English directly if offline
      setTitleTranslations((prev) => ({ ...prev, [activeLang]: enTitle }));
      setDescTranslations((prev) => ({ ...prev, [activeLang]: enDesc }));
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate English to all remaining 4 languages at once
  const handleTranslateAll = async () => {
    const enTitle = titleTranslations.en?.trim() || "";
    const enDesc = descTranslations.en?.trim() || "";

    if (!enTitle && !enDesc) {
      errorToast({ title: "Please enter English title or description first." });
      return;
    }

    setIsTranslatingAll(true);
    try {
      const nonEnLangs = FAQ_SUPPORTED_LANGUAGES.filter((l) => l.code !== "en");

      const newTitles = { ...titleTranslations };
      const newDescs = { ...descTranslations };

      await Promise.all(
        nonEnLangs.map(async (lang) => {
          const [tTitle, tDesc] = await Promise.all([
            enTitle ? translateText(enTitle, lang.code, "en") : Promise.resolve(""),
            enDesc ? translateText(enDesc, lang.code, "en") : Promise.resolve(""),
          ]);
          if (tTitle) newTitles[lang.code] = tTitle;
          if (tDesc) newDescs[lang.code] = tDesc;
        }),
      );

      setTitleTranslations(newTitles);
      setDescTranslations(newDescs);
      setErrors({});
      successToast({ title: "All 5 languages auto-translated successfully!" });
    } catch {
      errorToast({ title: "Failed to auto-translate all languages." });
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitleTranslations((prev) => ({ ...prev, [activeLang]: val }));
    if (errors[activeLang]?.title) {
      setErrors((prev) => ({
        ...prev,
        [activeLang]: { ...prev[activeLang], title: undefined },
      }));
    }
  };

  const handleDescChange = (val: string) => {
    setDescTranslations((prev) => ({ ...prev, [activeLang]: val }));
    if (errors[activeLang]?.desc) {
      setErrors((prev) => ({
        ...prev,
        [activeLang]: { ...prev[activeLang], desc: undefined },
      }));
    }
  };

  // Check language completeness using plain text length for rich text
  const completedCount = FAQ_SUPPORTED_LANGUAGES.filter((lang) => {
    const t = titleTranslations[lang.code]?.trim() || "";
    const d = descTranslations[lang.code]?.trim() || "";
    return getHtmlTextLength(t) >= 2 && getHtmlTextLength(d) >= 5;
  }).length;

  const validateForm = (): ContentPageSection | null => {
    const newErrors: Record<string, { title?: string; desc?: string }> = {};
    let firstErrorLang: FaqLanguageCode | null = null;

    for (const lang of FAQ_SUPPORTED_LANGUAGES) {
      const t = titleTranslations[lang.code]?.trim() || "";
      const d = descTranslations[lang.code]?.trim() || "";
      const titleLen = getHtmlTextLength(t);
      const descLen = getHtmlTextLength(d);
      const langErr: { title?: string; desc?: string } = {};

      if (!t || titleLen < 2) {
        langErr.title = `${lang.fullName} title is required (min 2 chars).`;
      }
      if (!d || descLen < 5) {
        langErr.desc = `${lang.fullName} description is required (min 5 chars).`;
      }

      if (langErr.title || langErr.desc) {
        newErrors[lang.code] = langErr;
        if (!firstErrorLang) {
          firstErrorLang = lang.code;
        }
      }
    }

    if (firstErrorLang) {
      setErrors(newErrors);
      setActiveLang(firstErrorLang);
      return null;
    }

    const enTitle = titleTranslations.en?.trim() || "";
    const enDesc = descTranslations.en?.trim() || "";

    const cleanTitles: Record<string, string> = {};
    const cleanDescs: Record<string, string> = {};

    for (const lang of FAQ_SUPPORTED_LANGUAGES) {
      cleanTitles[lang.code] = titleTranslations[lang.code]?.trim() || "";
      cleanDescs[lang.code] = descTranslations[lang.code]?.trim() || "";
    }

    return {
      id: section?.id || "",
      title: enTitle,
      description: enDesc,
      titleTranslations: cleanTitles,
      descriptionTranslations: cleanDescs,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    await onSave(payload, { keepOpen: false });
    onOpenChange(false);
  };

  const handleSaveAndAddAnother = async () => {
    const payload = validateForm();
    if (!payload) return;

    try {
      await onSave(payload, { keepOpen: true });
      // Reset inputs to immediately enter the next section
      setTitleTranslations({ en: "", hi: "", es: "", pt: "", fr: "" });
      setDescTranslations({ en: "", hi: "", es: "", pt: "", fr: "" });
      setErrors({});
      setActiveLang("en");
      setCurrentInternalIndex((prev) => prev + 1);
    } catch {
      // Error already toasted by onSave handler
    }
  };

  const currentLangMeta =
    FAQ_SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) ?? FAQ_SUPPORTED_LANGUAGES[0]!;

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
              {/* 5-Language Compact Grid Tabs */}
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
                        onClick={handleTranslateAll}
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
                        onClick={() => setActiveLang(lang.code)}
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
                        <span className="line-clamp-1 text-[10px] text-slate-500">
                          {lang.fullName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Language Editor Card */}
              <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
                {activeLang !== "en" && (
                  <div className="flex items-center justify-end border-b border-slate-200/80 pb-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyFromEnglish}
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
                      Section Title ({currentLangMeta.label}){" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <span className="text-[11px] text-slate-400">
                      {getHtmlTextLength(titleTranslations[activeLang])} characters
                    </span>
                  </div>
                  <RichTextEditor
                    key={`title-${activeLang}-${currentInternalIndex}`}
                    value={titleTranslations[activeLang] || ""}
                    onChange={handleTitleChange}
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
                      Section Description ({currentLangMeta.label}){" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <span className="text-[11px] text-slate-400">
                      {getHtmlTextLength(descTranslations[activeLang])} characters
                    </span>
                  </div>
                  <RichTextEditor
                    key={`desc-${activeLang}-${currentInternalIndex}`}
                    value={descTranslations[activeLang] || ""}
                    onChange={handleDescChange}
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
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <span className="text-xs text-slate-500">
                All 5 language translations are required.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl font-medium"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="h-10 rounded-xl border-emerald-300 font-semibold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
                    onClick={handleSaveAndAddAnother}
                  >
                    <Plus className="mr-1 size-3.5" /> Save &amp; Add Another
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="h-10 min-w-28 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                >
                  {isEditing ? "Update Section" : "Save Section"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
