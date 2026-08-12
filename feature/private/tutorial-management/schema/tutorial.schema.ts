import { z } from "zod/v3";

export const tutorialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  isActive: z.boolean(),
});

export type TutorialFormValues = z.infer<typeof tutorialSchema>;
