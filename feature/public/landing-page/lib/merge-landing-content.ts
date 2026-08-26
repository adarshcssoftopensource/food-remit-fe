import type { LandingPageContent } from "@/feature/private/content-management/landing-page/types";

/** Safe empty shell so public UI never maps over undefined. */
export const EMPTY_LANDING_CONTENT: LandingPageContent = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    ctaLabel: "",
    backgroundImage: "/vendor/hero-store.jpg",
    backgroundImageAlt: "",
  },
  stats: { items: [] },
  whyJoin: {
    title: "",
    subtitle: "",
    description: "",
    highlight: "",
    points: [],
    image: "/vendor/grocery.jpg",
    imageAlt: "",
  },
  revenue: {
    title: "",
    subtitle: "",
    description: "",
    marketLabel: "Available Market",
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
    image: "/vendor/payment.jpg",
    imageAlt: "",
  },
  trust: { title: "", items: [] },
  testimonials: { title: "", subtitle: "", items: [] },
  faq: { title: "", subtitle: "", items: [] },
  join: { title: "", subtitle: "", description: "" },
  footer: { tagline: "", copyright: "" },
};

export function mergeLandingContent(raw?: Partial<LandingPageContent> | null): LandingPageContent {
  const c = raw ?? {};
  return {
    ...EMPTY_LANDING_CONTENT,
    ...c,
    hero: { ...EMPTY_LANDING_CONTENT.hero, ...c.hero },
    stats: { items: c.stats?.items ?? [] },
    whyJoin: {
      ...EMPTY_LANDING_CONTENT.whyJoin,
      ...c.whyJoin,
      points: c.whyJoin?.points ?? [],
    },
    revenue: {
      ...EMPTY_LANDING_CONTENT.revenue,
      ...c.revenue,
      markets: c.revenue?.markets ?? [],
    },
    howItWorks: {
      ...EMPTY_LANDING_CONTENT.howItWorks,
      ...c.howItWorks,
      steps: c.howItWorks?.steps ?? [],
    },
    benefits: {
      ...EMPTY_LANDING_CONTENT.benefits,
      ...c.benefits,
      items: c.benefits?.items ?? [],
    },
    businessTypes: {
      ...EMPTY_LANDING_CONTENT.businessTypes,
      ...c.businessTypes,
      types: c.businessTypes?.types ?? [],
    },
    opportunity: {
      ...EMPTY_LANDING_CONTENT.opportunity,
      ...c.opportunity,
      stories: c.opportunity?.stories ?? [],
    },
    different: {
      ...EMPTY_LANDING_CONTENT.different,
      ...c.different,
      items: c.different?.items ?? [],
    },
    success: {
      ...EMPTY_LANDING_CONTENT.success,
      ...c.success,
      investments: c.success?.investments ?? [],
    },
    trust: {
      ...EMPTY_LANDING_CONTENT.trust,
      ...c.trust,
      items: c.trust?.items ?? [],
    },
    testimonials: {
      ...EMPTY_LANDING_CONTENT.testimonials,
      ...c.testimonials,
      items: c.testimonials?.items ?? [],
    },
    faq: {
      ...EMPTY_LANDING_CONTENT.faq,
      ...c.faq,
      items: c.faq?.items ?? [],
    },
    join: { ...EMPTY_LANDING_CONTENT.join, ...c.join },
    footer: { ...EMPTY_LANDING_CONTENT.footer, ...c.footer },
  };
}
