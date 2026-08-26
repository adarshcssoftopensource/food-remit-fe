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
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  backgroundImage: string;
  backgroundImageAlt: string;
};

export type LandingStat = { value: string; label: string };

export type LandingWhyJoin = {
  title: string;
  subtitle: string;
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
  title: string;
  subtitle: string;
  description: string;
  marketLabel: string;
  markets: LandingMarket[];
};

export type LandingHowItWorks = {
  title: string;
  subtitle: string;
  description: string;
  steps: { step: string; title: string; description: string }[];
};

export type LandingBenefits = {
  title: string;
  subtitle: string;
  items: { title: string; description: string }[];
};

export type LandingBusinessTypes = {
  title: string;
  subtitle: string;
  description: string;
  types: string[];
};

export type LandingOpportunity = {
  title: string;
  subtitle: string;
  stories: { from: string; habit: string; for: string }[];
  closing: string;
};

export type LandingDifferent = {
  title: string;
  subtitle: string;
  items: { unlike: string; point: string }[];
};

export type LandingSuccess = {
  title: string;
  subtitle: string;
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
  title: string;
  subtitle: string;
  items: { quote: string; name: string; role: string }[];
};

export type LandingFaq = {
  title: string;
  subtitle: string;
  items: { question: string; answer: string }[];
};

export type LandingJoin = {
  title: string;
  subtitle: string;
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
