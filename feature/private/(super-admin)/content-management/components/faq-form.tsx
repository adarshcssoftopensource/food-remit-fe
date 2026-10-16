"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CreditCard,
  Globe,
  HelpCircle,
  ShoppingBag,
  Sparkles,
  Plus,
  Store,
  User,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { errorToast, successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { RichTextEditor, getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { translateText } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { faqSchema, type FaqFormValues } from "../schema/content.schema";
import {
  FAQ_STATIC_CATEGORIES,
  FAQ_SUPPORTED_LANGUAGES,
  type FaqCategoryKey,
  type FaqLanguageCode,
} from "../types";

type FaqFormProps = {
  initialValues?: Partial<FaqFormValues>;
  onSubmit: (values: FaqFormValues) => void;
  onSaveAndAddAnother?: (values: FaqFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const CATEGORY_ICONS: Record<FaqCategoryKey, React.ComponentType<{ className?: string }>> = {
  order: ShoppingBag,
  payments: CreditCard,
  account: User,
  pickup: Store,
  general: HelpCircle,
};

export function FaqForm({
  initialValues,
  onSubmit,
  onSaveAndAddAnother,
  submitLabel = "Add",
  isSubmitting = false,
}: FaqFormProps) {
  const [activeLang, setActiveLang] = useState<FaqLanguageCode>("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  // Prepare initial translations maps
  const initialQTrans: Record<string, string> = {
    en: initialValues?.question ?? "",
    ...(initialValues?.questionTranslations ?? {}),
  };
  const initialATrans: Record<string, string> = {
    en: initialValues?.answer ?? "",
    ...(initialValues?.answerTranslations ?? {}),
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      categoryKey: initialValues?.categoryKey ?? "general",
      question: initialQTrans.en ?? "",
      answer: initialATrans.en ?? "",
      questionTranslations: initialQTrans,
      answerTranslations: initialATrans,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const selectedCategory = useWatch({ control, name: "categoryKey" });
  const qTranslations = useWatch({ control, name: "questionTranslations" }) || {};
  const aTranslations = useWatch({ control, name: "answerTranslations" }) || {};

  const handleQuestionChange = (lang: FaqLanguageCode, value: string) => {
    const updated = { ...qTranslations, [lang]: value };
    setValue("questionTranslations", updated, { shouldDirty: true, shouldValidate: isSubmitted });
    if (lang === "en") {
      setValue("question", value, { shouldValidate: isSubmitted, shouldDirty: true });
    }
  };

  const handleAnswerChange = (lang: FaqLanguageCode, value: string) => {
    const updated = { ...aTranslations, [lang]: value };
    setValue("answerTranslations", updated, { shouldDirty: true, shouldValidate: isSubmitted });
    if (lang === "en") {
      setValue("answer", value, { shouldValidate: isSubmitted, shouldDirty: true });
    }
  };

  // Auto-translate from English into the active selected language
  const copyAndTranslateFromEnglish = async () => {
    if (activeLang === "en") return;
    const enQuestion = (qTranslations.en || "").trim();
    const enAnswer = (aTranslations.en || "").trim();

    if (!enQuestion && !enAnswer) {
      errorToast({ title: "Please enter English question or answer first." });
      return;
    }

    setIsTranslating(true);
    try {
      const [translatedQ, translatedA] = await Promise.all([
        enQuestion ? translateText(enQuestion, activeLang, "en") : Promise.resolve(""),
        enAnswer ? translateText(enAnswer, activeLang, "en") : Promise.resolve(""),
      ]);

      const updatedQ = {
        ...qTranslations,
        [activeLang]: translatedQ || enQuestion,
      };
      const updatedA = {
        ...aTranslations,
        [activeLang]: translatedA || enAnswer,
      };

      setValue("questionTranslations", updatedQ, { shouldValidate: true, shouldDirty: true });
      setValue("answerTranslations", updatedA, { shouldValidate: true, shouldDirty: true });

      const targetMeta = FAQ_SUPPORTED_LANGUAGES.find((l) => l.code === activeLang);
      successToast({
        title: `Auto-translated to ${targetMeta?.fullName || activeLang}`,
        description: `Question and answer translated into ${targetMeta?.fullName} (${targetMeta?.nativeLabel}).`,
      });
    } catch {
      // Fallback: copy English directly if offline
      const updatedQ = { ...qTranslations, [activeLang]: enQuestion };
      const updatedA = { ...aTranslations, [activeLang]: enAnswer };
      setValue("questionTranslations", updatedQ, { shouldValidate: true, shouldDirty: true });
      setValue("answerTranslations", updatedA, { shouldValidate: true, shouldDirty: true });
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate English to all remaining 4 languages at once
  const handleTranslateAll = async () => {
    const enQuestion = (qTranslations.en || "").trim();
    const enAnswer = (aTranslations.en || "").trim();

    if (!enQuestion && !enAnswer) {
      errorToast({ title: "Please enter English question or answer first." });
      return;
    }

    setIsTranslatingAll(true);
    try {
      const nonEnLangs = FAQ_SUPPORTED_LANGUAGES.filter((l) => l.code !== "en");

      const newQ = { ...qTranslations };
      const newA = { ...aTranslations };

      await Promise.all(
        nonEnLangs.map(async (lang) => {
          const [tQ, tA] = await Promise.all([
            enQuestion ? translateText(enQuestion, lang.code, "en") : Promise.resolve(""),
            enAnswer ? translateText(enAnswer, lang.code, "en") : Promise.resolve(""),
          ]);
          if (tQ) newQ[lang.code] = tQ;
          if (tA) newA[lang.code] = tA;
        }),
      );

      setValue("questionTranslations", newQ, { shouldValidate: true, shouldDirty: true });
      setValue("answerTranslations", newA, { shouldValidate: true, shouldDirty: true });

      successToast({
        title: "All languages translated",
        description:
          "English FAQ has been auto-translated into Hindi, Spanish, Portuguese, and French.",
      });
    } catch {
      errorToast({ title: "Failed to translate some languages" });
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleFormSubmit = (data: FaqFormValues) => {
    const enQuestion = data.questionTranslations?.en || data.question;
    const enAnswer = data.answerTranslations?.en || data.answer;

    const payload: FaqFormValues = {
      ...data,
      question: enQuestion.trim(),
      answer: enAnswer.trim(),
      questionTranslations: {
        ...(data.questionTranslations || {}),
        en: enQuestion.trim(),
      },
      answerTranslations: {
        ...(data.answerTranslations || {}),
        en: enAnswer.trim(),
      },
    };

    onSubmit(payload);
  };

  const handleFormError = (formErrors: typeof errors) => {
    // If any language tab has validation errors, automatically switch to that tab
    for (const lang of FAQ_SUPPORTED_LANGUAGES) {
      if (
        formErrors.questionTranslations?.[lang.code] ||
        formErrors.answerTranslations?.[lang.code] ||
        (lang.code === "en" && (formErrors.question || formErrors.answer))
      ) {
        setActiveLang(lang.code);
        break;
      }
    }
  };

  const currentLangMeta = FAQ_SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) ?? {
    code: "en" as const,
    label: "EN",
    fullName: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    required: true,
  };

  // Count completed languages using plain text length for rich text question & answer
  const completedCount = FAQ_SUPPORTED_LANGUAGES.filter((lang) => {
    const qVal =
      (lang.code === "en"
        ? qTranslations.en || watchQuestionFallback()
        : qTranslations[lang.code]) || "";
    const aVal =
      (lang.code === "en" ? aTranslations.en || watchAnswerFallback() : aTranslations[lang.code]) ||
      "";
    const hasQ = Boolean(getHtmlTextLength(qVal) >= 3);
    const hasA = Boolean(getHtmlTextLength(aVal) >= 5);
    return hasQ && hasA;
  }).length;

  function watchQuestionFallback() {
    return qTranslations.en ?? "";
  }
  function watchAnswerFallback() {
    return aTranslations.en ?? "";
  }

  const currentQError = isSubmitted
    ? errors.questionTranslations?.[activeLang]?.message ||
      (activeLang === "en" ? errors.question?.message : undefined)
    : undefined;

  const currentAError = isSubmitted
    ? errors.answerTranslations?.[activeLang]?.message ||
      (activeLang === "en" ? errors.answer?.message : undefined)
    : undefined;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="flex flex-col">
      <div className="space-y-6 p-4 sm:p-6">
        {/* 1. Category Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-sm font-semibold text-slate-800">
              Category <span className="text-red-500">*</span>
            </FieldLabel>
            <span className="text-xs text-slate-500">Choose category</span>
          </div>

          <Controller
            name="categoryKey"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {FAQ_STATIC_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.key];
                  const isSelected = field.value === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => field.onChange(cat.key)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all outline-none",
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20"
                          : "border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/70 hover:text-slate-900",
                      )}
                    >
                      {isSelected ? (
                        <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="size-2.5" />
                        </div>
                      ) : null}
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg transition-colors",
                          isSelected
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.categoryKey ? (
            <p className="text-xs font-medium text-red-500">{errors.categoryKey.message}</p>
          ) : null}
        </div>

        {/* 2. Multilingual Language Tabs (Responsive on mobile, 5-Grid on sm+) */}
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
                  onClick={handleTranslateAll}
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
                    onClick={() => setActiveLang(lang.code)}
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

          {/* Active Language Editor Card */}
          <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
            <div className="flex flex-col gap-2.5 border-b border-slate-200/80 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="shrink-0 text-xl">{currentLangMeta.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold text-slate-900">
                      {currentLangMeta.fullName}
                    </span>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] font-semibold uppercase"
                    >
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
                  onClick={copyAndTranslateFromEnglish}
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
                  {getHtmlTextLength(qTranslations[activeLang])} characters
                </span>
              </div>
              <RichTextEditor
                key={`q-${activeLang}`}
                value={qTranslations[activeLang] || ""}
                onChange={(val) => handleQuestionChange(activeLang, val)}
                placeholder={`Enter question in ${currentLangMeta.fullName} (${currentLangMeta.label})...`}
                hasError={Boolean(currentQError)}
                minHeight="60px"
                preset="minimal"
              />
              {currentQError ? (
                <p className="text-xs font-medium text-red-500">{currentQError}</p>
              ) : null}
            </div>

            {/* Answer Rich Text Editor for Active Language */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <FieldLabel className="text-xs font-semibold text-slate-800">
                  Answer ({currentLangMeta.fullName}) <span className="text-red-500">*</span>
                </FieldLabel>
                <span className="text-[11px] text-slate-400">
                  {getHtmlTextLength(aTranslations[activeLang])} characters
                </span>
              </div>
              <RichTextEditor
                key={`a-${activeLang}`}
                value={aTranslations[activeLang] || ""}
                onChange={(val) => handleAnswerChange(activeLang, val)}
                placeholder={`Enter answer in ${currentLangMeta.fullName} (${currentLangMeta.label})...`}
                hasError={Boolean(currentAError)}
                minHeight="140px"
                preset="compact"
              />
              {currentAError ? (
                <p className="text-xs font-medium text-red-500">{currentAError}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="text-secondary-foreground flex items-center gap-2 text-xs">
          <span>Active category:</span>
          <Badge variant="outline" className="font-semibold text-slate-700 capitalize">
            {selectedCategory || "General"}
          </Badge>
          <span>•</span>
          <span
            className={cn(
              "font-medium",
              completedCount === 5 ? "text-emerald-600" : "text-secondary-foreground",
            )}
          >
            {completedCount}/5 languages filled
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onSaveAndAddAnother && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-11 rounded-xl border-emerald-300 font-semibold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
              onClick={handleSubmit((data) => {
                const enQuestion = data.questionTranslations?.en || data.question;
                const enAnswer = data.answerTranslations?.en || data.answer;
                const payload: FaqFormValues = {
                  ...data,
                  question: enQuestion.trim(),
                  answer: enAnswer.trim(),
                  questionTranslations: {
                    ...(data.questionTranslations || {}),
                    en: enQuestion.trim(),
                  },
                  answerTranslations: {
                    ...(data.answerTranslations || {}),
                    en: enAnswer.trim(),
                  },
                };
                onSaveAndAddAnother(payload);
              }, handleFormError)}
            >
              <Plus className="mr-1 size-4" /> Add &amp; Add Another
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="h-11 min-w-36 rounded-xl px-10 font-semibold"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
