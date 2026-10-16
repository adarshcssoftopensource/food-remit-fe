"use client";

import { useFaqForm } from "../hooks/use-faq-form";
import { type FaqFormValues } from "../schema/content.schema";
import { FaqCategorySelector } from "./faq-form/faq-category-selector";
import { FaqLanguageTabs } from "./faq-form/faq-language-tabs";
import { FaqLanguageEditor } from "./faq-form/faq-language-editor";
import { FaqFormFooter } from "./faq-form/faq-form-footer";

export type FaqFormProps = {
  initialValues?: Partial<FaqFormValues>;
  onSubmit: (values: FaqFormValues) => void;
  onSaveAndAddAnother?: (values: FaqFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export function FaqForm({
  initialValues,
  onSubmit,
  onSaveAndAddAnother,
  submitLabel = "Add",
  isSubmitting = false,
}: FaqFormProps) {
  const {
    control,
    handleSubmit,
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
  } = useFaqForm({
    initialValues,
    onSubmit,
    onSaveAndAddAnother,
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-6 p-4 sm:p-6">
        <FaqCategorySelector control={control} error={errors.categoryKey?.message} />

        <div className="space-y-3">
          <FaqLanguageTabs
            activeLang={activeLang}
            onSelectLang={setActiveLang}
            completedCount={completedCount}
            qTranslations={qTranslations}
            aTranslations={aTranslations}
            onTranslateAll={handleTranslateAll}
            isTranslatingAll={isTranslatingAll}
            isSubmitted={isSubmitted}
            errors={errors}
          />

          <FaqLanguageEditor
            activeLang={activeLang}
            currentLangMeta={currentLangMeta}
            qTranslations={qTranslations}
            aTranslations={aTranslations}
            onQuestionChange={handleQuestionChange}
            onAnswerChange={handleAnswerChange}
            onCopyFromEnglish={copyAndTranslateFromEnglish}
            isTranslating={isTranslating}
            currentQError={currentQError}
            currentAError={currentAError}
          />
        </div>
      </div>

      <FaqFormFooter
        selectedCategory={selectedCategory}
        completedCount={completedCount}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        onSaveAndAddAnother={onSaveAndAddAnother ? handleSaveAndAddAnotherSubmit : undefined}
      />
    </form>
  );
}
