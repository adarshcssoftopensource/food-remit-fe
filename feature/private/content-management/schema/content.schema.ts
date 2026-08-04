import { z } from "zod";

export const contentPageSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
});

export type ContentPageFormValues = z.infer<typeof contentPageSchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(5, "Question must be at least 5 characters."),
  answer: z.string().trim().min(10, "Answer must be at least 10 characters."),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
