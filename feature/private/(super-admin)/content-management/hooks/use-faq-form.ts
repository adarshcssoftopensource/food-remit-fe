"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { errorToast, successToast } from "@/components/toaster";
import { getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { translateText } from "@/lib/translate";
import { faqSchema, type FaqFormValues } from "../schema/content.schema";
import { FAQ_SUPPORTED_LANGUAGES, type FaqLanguageCode } from "../types";

export interface UseFaqFormParams {
  initialValues?: Partial<FaqFormValues>;
  onSubmit: (values: FaqFormValues) => void;
  onSaveAndAddAnother?: (values: FaqFormValues) => void;
}

export function useFaqForm({ initialValues, onSubmit, onSaveAndAddAnother }: UseFaqFormParams) {
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

  const handleSaveAndAddAnotherSubmit = () => {
    if (!onSaveAndAddAnother) return;
    handleSubmit((data) => {
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
    }, handleFormError)();
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
    const qVal = (lang.code === "en" ? qTranslations.en || "" : qTranslations[lang.code]) || "";
    const aVal = (lang.code === "en" ? aTranslations.en || "" : aTranslations[lang.code]) || "";
    const hasQ = Boolean(getHtmlTextLength(qVal) >= 3);
    const hasA = Boolean(getHtmlTextLength(aVal) >= 5);
    return hasQ && hasA;
  }).length;

  const currentQError = isSubmitted
    ? errors.questionTranslations?.[activeLang]?.message ||
      (activeLang === "en" ? errors.question?.message : undefined)
    : undefined;

  const currentAError = isSubmitted
    ? errors.answerTranslations?.[activeLang]?.message ||
      (activeLang === "en" ? errors.answer?.message : undefined)
    : undefined;

  return {
    control,
    handleSubmit: handleSubmit(handleFormSubmit, handleFormError),
    handleSaveAndAddAnotherSubmit,
    errors,
    isSubmitted,
    selectedCategory,
    activeLang,
    setActiveLang,
    currentLangMeta,
    completedCount,
    qTranslations,
    aTranslations,
    handleQuestionChange,
    handleAnswerChange,
    copyAndTranslateFromEnglish,
    handleTranslateAll,
    isTranslating,
    isTranslatingAll,
    currentQError,
    currentAError,
  };
}
