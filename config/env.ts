import { z } from "zod";

/**
 * Validated environment variables schema.
 * Throws a descriptive error at boot if required variables are missing.
 */
const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z
    .string({
      message: "NEXT_PUBLIC_BASE_URL is required",
    })
    .min(1, "NEXT_PUBLIC_BASE_URL cannot be empty"),

  NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_GOOGLE_MAPS_API_URL: z
    .string()
    .optional()
    .default("https://maps.googleapis.com/maps/api/js"),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.string().optional().default(""),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_URL,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});

if (!parsedEnv.success) {
  console.error("❌ [Environment Validation Error] Missing or invalid environment variables:");
  console.error(JSON.stringify(parsedEnv.error.flatten().fieldErrors, null, 2));
  throw new Error("Invalid environment variables. Check your .env file.");
}

export const env = parsedEnv.data;
