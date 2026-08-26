import { z } from "zod/v3";

import type { LandingPageContent, LandingSectionKey } from "../types";

const required = (label: string) => z.string().min(1, `${label} is required`);

export const heroSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  ctaLabel: required("CTA label"),
  backgroundImage: z.string().optional().or(z.literal("")),
  backgroundImageAlt: required("Image alt text"),
});

export const statsSchema = z.object({
  items: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
});

export const whyJoinSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  highlight: required("Highlight"),
  points: z.array(z.string().min(1, "Point is required")).min(1, "Add at least one point"),
  image: z.string().optional().or(z.literal("")),
  imageAlt: required("Image alt"),
});

export const revenueSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  marketLabel: required("Market label"),
  markets: z
    .array(
      z.object({
        name: required("Country name"),
        isoCode: z.string().default(""),
        flag: z.string().default("🌍"),
      }),
    )
    .default([]),
});

export const howItWorksSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  steps: z
    .array(
      z.object({
        step: required("Step"),
        title: required("Title"),
        description: required("Description"),
      }),
    )
    .min(1, "Add at least one step"),
});

export const benefitsSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  items: z
    .array(
      z.object({
        title: required("Title"),
        description: required("Description"),
      }),
    )
    .min(1, "Add at least one item"),
});

export const businessTypesSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  types: z.array(z.string().min(1, "Type is required")).min(1, "Add at least one type"),
});

export const opportunitySchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  stories: z
    .array(
      z.object({
        from: required("From"),
        habit: required("Habit"),
        for: required("For"),
      }),
    )
    .min(1, "Add at least one story"),
  closing: required("Closing line"),
});

export const differentSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  items: z
    .array(
      z.object({
        unlike: required("Unlike"),
        point: required("Point"),
      }),
    )
    .min(1, "Add at least one item"),
});

export const successSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
  investments: z
    .array(z.string().min(1, "Investment is required"))
    .min(1, "Add at least one investment"),
  image: z.string().optional().or(z.literal("")),
  imageAlt: required("Image alt"),
});

export const trustSchema = z.object({
  title: required("Title"),
  items: z
    .array(
      z.object({
        title: required("Title"),
        description: required("Description"),
      }),
    )
    .min(1, "Add at least one item"),
});

export const testimonialsSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  items: z
    .array(
      z.object({
        quote: required("Quote"),
        name: required("Name"),
        role: required("Role"),
      }),
    )
    .min(1, "Add at least one testimonial"),
});

export const faqSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  items: z
    .array(
      z.object({
        question: required("Question"),
        answer: required("Answer"),
      }),
    )
    .min(1, "Add at least one FAQ"),
});

export const joinSchema = z.object({
  title: required("Title"),
  subtitle: required("Subtitle"),
  description: required("Description"),
});

export const footerSchema = z.object({
  tagline: required("Tagline"),
  copyright: required("Copyright"),
});

export const SECTION_SCHEMAS = {
  hero: heroSchema,
  stats: statsSchema,
  whyJoin: whyJoinSchema,
  revenue: revenueSchema,
  howItWorks: howItWorksSchema,
  benefits: benefitsSchema,
  businessTypes: businessTypesSchema,
  opportunity: opportunitySchema,
  different: differentSchema,
  success: successSchema,
  trust: trustSchema,
  testimonials: testimonialsSchema,
  faq: faqSchema,
  join: joinSchema,
  footer: footerSchema,
} as const;

export type HeroFormValues = z.infer<typeof heroSchema>;
export type StatsFormValues = z.infer<typeof statsSchema>;
export type WhyJoinFormValues = z.infer<typeof whyJoinSchema>;
export type RevenueFormValues = z.infer<typeof revenueSchema>;
export type HowItWorksFormValues = z.infer<typeof howItWorksSchema>;
export type BenefitsFormValues = z.infer<typeof benefitsSchema>;
export type BusinessTypesFormValues = z.infer<typeof businessTypesSchema>;
export type OpportunityFormValues = z.infer<typeof opportunitySchema>;
export type DifferentFormValues = z.infer<typeof differentSchema>;
export type SuccessFormValues = z.infer<typeof successSchema>;
export type TrustFormValues = z.infer<typeof trustSchema>;
export type TestimonialsFormValues = z.infer<typeof testimonialsSchema>;
export type FaqFormValues = z.infer<typeof faqSchema>;
export type JoinFormValues = z.infer<typeof joinSchema>;
export type FooterFormValues = z.infer<typeof footerSchema>;

export type SectionFormValuesMap = {
  hero: HeroFormValues;
  stats: StatsFormValues;
  whyJoin: WhyJoinFormValues;
  revenue: RevenueFormValues;
  howItWorks: HowItWorksFormValues;
  benefits: BenefitsFormValues;
  businessTypes: BusinessTypesFormValues;
  opportunity: OpportunityFormValues;
  different: DifferentFormValues;
  success: SuccessFormValues;
  trust: TrustFormValues;
  testimonials: TestimonialsFormValues;
  faq: FaqFormValues;
  join: JoinFormValues;
  footer: FooterFormValues;
};

const EMPTY: LandingPageContent = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    ctaLabel: "",
    backgroundImage: "",
    backgroundImageAlt: "",
  },
  stats: { items: [] },
  whyJoin: {
    title: "",
    subtitle: "",
    description: "",
    highlight: "",
    points: [],
    image: "",
    imageAlt: "",
  },
  revenue: {
    title: "",
    subtitle: "",
    description: "",
    marketLabel: "",
    markets: [],
  },
  howItWorks: { title: "", subtitle: "", description: "", steps: [] },
  benefits: { title: "", subtitle: "", items: [] },
  businessTypes: { title: "", subtitle: "", description: "", types: [] },
  opportunity: { title: "", subtitle: "", stories: [], closing: "" },
  different: { title: "", subtitle: "", items: [] },
  success: {
    title: "",
    subtitle: "",
    description: "",
    investments: [],
    image: "",
    imageAlt: "",
  },
  trust: { title: "", items: [] },
  testimonials: { title: "", subtitle: "", items: [] },
  faq: { title: "", subtitle: "", items: [] },
  join: { title: "", subtitle: "", description: "" },
  footer: { tagline: "", copyright: "" },
};

export function normalizeSectionData<K extends LandingSectionKey>(
  section: K,
  raw: unknown,
): SectionFormValuesMap[K] {
  const base = EMPTY[section];
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  // Backwards compatibility migration for legacy data using eyebrow
  if ("eyebrow" in data && typeof data.eyebrow === "string" && data.eyebrow) {
    if (!data.title) {
      data.title = data.eyebrow;
      if (data.title && !data.subtitle) {
        data.subtitle = (raw as Record<string, unknown>).title || "";
      }
      if (data.subtitle && !data.description && (raw as Record<string, unknown>).subtitle) {
        data.description = (raw as Record<string, unknown>).subtitle || "";
      }
    }
  }

  const merged = { ...base, ...data } as Record<string, unknown>;

  // Guarantee arrays so .map never crashes
  for (const key of Object.keys(merged)) {
    const emptyVal = (base as Record<string, unknown>)[key];
    if (Array.isArray(emptyVal) && !Array.isArray(merged[key])) {
      merged[key] = [];
    }
  }

  if (section === "revenue") {
    const markets = Array.isArray(merged.markets) ? merged.markets : [];
    merged.markets = markets;
    delete merged.countryIds;
  }

  return merged as SectionFormValuesMap[K];
}

export const SECTION_NOTES: Partial<Record<LandingSectionKey, string>> = {
  hero: "Navbar and Become a Vendor Partner are not editable here. Images upload to S3.",
  stats: "Calculated live from DB — not editable.",
  join: "Become a Vendor Partner / Sign In buttons stay system-controlled.",
  footer: "Only tagline and copyright are editable. Nav links stay system-controlled.",
};

export const IMAGE_SECTIONS = new Set<LandingSectionKey>(["hero", "whyJoin", "success"]);
