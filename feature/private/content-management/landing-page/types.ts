export type LandingSectionKey =
  | "hero"
  | "stats"
  | "whyJoin"
  | "revenue"
  | "howItWorks"
  | "benefits"
  | "businessTypes"
  | "opportunity"
  | "different"
  | "success"
  | "trust"
  | "testimonials"
  | "faq"
  | "join"
  | "footer";

export type LandingHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  backgroundImage: string;
  backgroundImageAlt: string;
};

export type LandingStat = { value: string; label: string };

export type LandingWhyJoin = {
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export type LandingMarket = {
  name: string;
  isoCode: string;
  flag: string;
};

export type LandingRevenue = {
  eyebrow: string;
  title: string;
  description: string;
  marketLabel: string;
  markets: LandingMarket[];
};

export type LandingHowItWorks = {
  eyebrow: string;
  title: string;
  description: string;
  steps: { step: string; title: string; description: string }[];
};

export type LandingBenefits = {
  eyebrow: string;
  title: string;
  items: { title: string; description: string }[];
};

export type LandingBusinessTypes = {
  eyebrow: string;
  title: string;
  description: string;
  types: string[];
};

export type LandingOpportunity = {
  eyebrow: string;
  title: string;
  stories: { from: string; habit: string; for: string }[];
  closing: string;
};

export type LandingDifferent = {
  eyebrow: string;
  title: string;
  items: { unlike: string; point: string }[];
};

export type LandingSuccess = {
  eyebrow: string;
  title: string;
  description: string;
  investments: string[];
  image: string;
  imageAlt: string;
};

export type LandingTrust = {
  title: string;
  items: { title: string; description: string }[];
};

export type LandingTestimonials = {
  eyebrow: string;
  title: string;
  items: { quote: string; name: string; role: string }[];
};

export type LandingFaq = {
  eyebrow: string;
  title: string;
  items: { question: string; answer: string }[];
};

export type LandingJoin = {
  eyebrow: string;
  title: string;
  description: string;
};

export type LandingFooter = {
  tagline: string;
  copyright: string;
};

export type LandingPageContent = {
  hero: LandingHero;
  stats: { items: LandingStat[] };
  whyJoin: LandingWhyJoin;
  revenue: LandingRevenue;
  howItWorks: LandingHowItWorks;
  benefits: LandingBenefits;
  businessTypes: LandingBusinessTypes;
  opportunity: LandingOpportunity;
  different: LandingDifferent;
  success: LandingSuccess;
  trust: LandingTrust;
  testimonials: LandingTestimonials;
  faq: LandingFaq;
  join: LandingJoin;
  footer: LandingFooter;
};

export type LandingPageResponse = {
  message: string;
  data: {
    id: string;
    key: string;
    content: LandingPageContent;
    updatedAt: string;
  };
};

export const LANDING_CMS_SECTIONS: {
  key: LandingSectionKey;
  label: string;
  icon: string;
  readOnly?: boolean;
}[] = [
  { key: "hero", label: "Hero", icon: "Sparkles" },
  { key: "whyJoin", label: "Why Join", icon: "Heart" },
  { key: "revenue", label: "Revenue / Markets", icon: "TrendingUp" },
  { key: "howItWorks", label: "How It Works", icon: "Workflow" },
  { key: "benefits", label: "Benefits", icon: "Gift" },
  { key: "businessTypes", label: "Business Types", icon: "Building2" },
  { key: "opportunity", label: "Opportunity", icon: "Target" },
  { key: "different", label: "Differentiators", icon: "Badge" },
  { key: "success", label: "Success", icon: "Trophy" },
  { key: "trust", label: "Trust", icon: "ShieldCheck" },
  { key: "testimonials", label: "Testimonials", icon: "MessageSquare" },
  { key: "faq", label: "FAQ", icon: "HelpCircle" },
  { key: "join", label: "Join CTA", icon: "ArrowRight" },
  { key: "footer", label: "Footer", icon: "Layout" },
];
