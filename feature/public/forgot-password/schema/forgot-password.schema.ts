import { z } from "zod/v3";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
