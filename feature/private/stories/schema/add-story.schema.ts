import { z } from "zod/v3";

const referenceSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  number: z.string().trim().min(7, "Enter a valid contact number"),
});

export const addStorySchema = z.object({
  storyName: z.string().trim().min(3, "Story name must be at least 3 characters"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  images: z
    .custom<File[]>()
    .refine((files) => Array.isArray(files) && files.length > 0, "Add at least one image"),
  referenceOne: referenceSchema,
  referenceTwo: referenceSchema,
  location: z.string().trim().min(2, "Location is required"),
  familyName: z.string().trim().min(2, "Family member name is required"),
  familyEmail: z.string().trim().email("Enter a valid email address"),
  familyNumber: z.string().trim().min(7, "Enter a valid contact number"),
  familyLocation: z.string().trim().min(2, "Family location is required"),
  requestedItems: z
    .array(
      z.object({
        productName: z.string().trim().min(2, "Product name is required"),
        unit: z.string().min(1, "Select a unit"),
        quantity: z.coerce.number().int().positive("Quantity must be greater than zero"),
      }),
    )
    .min(1, "Add at least one requested item"),
});

export type AddStoryFormValues = z.infer<typeof addStorySchema>;
