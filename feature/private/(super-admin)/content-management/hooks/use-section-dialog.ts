"use client";

import { useState } from "react";

import { errorToast, successToast } from "@/components/toaster";
import { getHtmlTextLength } from "@/components/ui/rich-text-editor";
import { translateText } from "@/lib/translate";
import { FAQ_SUPPORTED_LANGUAGES, type ContentPageSection, type FaqLanguageCode } from "../types";

export interface UseSectionDialogParams {
  section?: ContentPageSection | null;
  sectionIndex?: number;
  onSave: (section: ContentPageSection, options?: { keepOpen?: boolean }) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}

export function useSectionDialog({
  section,
  sectionIndex,
  onSave,
  onOpenChange,
}: UseSectionDialogParams) {
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

  return {
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
  };
}
