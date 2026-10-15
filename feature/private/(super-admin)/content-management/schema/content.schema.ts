import { z } from "zod/v3";

export const REQUIRED_CONTENT_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "fr", label: "French" },
] as const;

export const contentPageSectionSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(2, "Title must be at least 2 characters."),
    description: z.string().trim().min(5, "Description must be at least 5 characters."),
    titleTranslations: z.record(z.string(), z.string()).optional(),
    descriptionTranslations: z.record(z.string(), z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    for (const lang of REQUIRED_CONTENT_LANGUAGES) {
      const t = (
        lang.code === "en"
          ? data.title || data.titleTranslations?.en
          : data.titleTranslations?.[lang.code]
      )?.trim();

      const d = (
        lang.code === "en"
          ? data.description || data.descriptionTranslations?.en
          : data.descriptionTranslations?.[lang.code]
      )?.trim();

      if (!t || t.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${lang.label} title is required (min 2 chars).`,
          path: ["titleTranslations", lang.code],
        });
      }

      if (!d || d.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${lang.label} description is required (min 5 chars).`,
          path: ["descriptionTranslations", lang.code],
        });
      }
    }
  });

export type ContentPageSectionFormValues = z.infer<typeof contentPageSectionSchema>;

export const contentPageSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  contactEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .or(z.literal(""))
    .optional(),
  supportEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .or(z.literal(""))
    .optional(),
  sections: z.array(z.any()).optional(),
});

export type ContentPageFormValues = z.infer<typeof contentPageSchema>;

export const REQUIRED_FAQ_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "fr", label: "French" },
] as const;

export const faqSchema = z
  .object({
    categoryKey: z.enum(["order", "payments", "account", "pickup", "general"], {
      required_error: "Please select a category.",
    }),
    question: z.string().trim().min(3, "Question must be at least 3 characters."),
    answer: z.string().trim().min(5, "Answer must be at least 5 characters."),
    questionTranslations: z.record(z.string(), z.string()).optional(),
    answerTranslations: z.record(z.string(), z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    for (const lang of REQUIRED_FAQ_LANGUAGES) {
      const q = (
        lang.code === "en"
          ? data.question || data.questionTranslations?.en
          : data.questionTranslations?.[lang.code]
      )?.trim();

      const a = (
        lang.code === "en"
          ? data.answer || data.answerTranslations?.en
          : data.answerTranslations?.[lang.code]
      )?.trim();

      const plainQuestion = (q || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const plainAnswer = (a || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!q || plainQuestion.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${lang.label} question is required (min 3 chars).`,
          path: ["questionTranslations", lang.code],
        });
      }

      if (!a || plainAnswer.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${lang.label} answer is required (min 5 chars).`,
          path: ["answerTranslations", lang.code],
        });
      }
    }
  });

export type FaqFormValues = z.infer<typeof faqSchema>;
