export type ContentPageKey = "about-us" | "privacy-policy" | "terms-of-use";

export interface ContentPageSection {
  id: string;
  title: string;
  description: string;
  titleTranslations: Record<string, string>;
  descriptionTranslations: Record<string, string>;
}

export type ContentPageData = {
  id: string;
  key: ContentPageKey;
  label: string;
  title: string;
  description: string;
  sections?: ContentPageSection[];
  contactEmail?: string;
  supportEmail?: string;
  updatedAt: string;
  createdAt?: string;
};

export type FaqCategoryKey = "order" | "payments" | "account" | "pickup" | "general";

export type FaqLanguageCode = "en" | "hi" | "es" | "pt" | "fr";

export interface FaqCategoryMeta {
  key: FaqCategoryKey;
  label: string;
  description: string;
  icon: string;
}

export const FAQ_STATIC_CATEGORIES: FaqCategoryMeta[] = [
  {
    key: "order",
    label: "Order",
    description: "Placing orders, status, item availability, schedules",
    icon: "order",
  },
  {
    key: "payments",
    label: "Payments",
    description: "Payment methods, cards, currency conversions, refunds",
    icon: "payments",
  },
  {
    key: "account",
    label: "Account",
    description: "Profile, 2FA security, recipient management, login",
    icon: "account",
  },
  {
    key: "pickup",
    label: "Pickup",
    description: "Store locations, pickup codes, collection times, pickup agents",
    icon: "pickup",
  },
  {
    key: "general",
    label: "General",
    description: "About FoodRemit, coverage, operating hours, support",
    icon: "general",
  },
];

export interface FaqLanguageMeta {
  code: FaqLanguageCode;
  label: string;
  fullName: string;
  nativeLabel: string;
  flag: string;
  required: boolean;
}

export const FAQ_SUPPORTED_LANGUAGES: FaqLanguageMeta[] = [
  {
    code: "en",
    label: "EN",
    fullName: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    required: true,
  },
  { code: "hi", label: "HI", fullName: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳", required: true },
  {
    code: "es",
    label: "ES",
    fullName: "Spanish",
    nativeLabel: "Español",
    flag: "🇪🇸",
    required: true,
  },
  {
    code: "pt",
    label: "PT",
    fullName: "Portuguese",
    nativeLabel: "Português",
    flag: "🇵🇹",
    required: true,
  },
  {
    code: "fr",
    label: "FR",
    fullName: "French",
    nativeLabel: "Français",
    flag: "🇫🇷",
    required: true,
  },
];

export type FaqData = {
  id: string;
  question: string;
  answer: string;
  categoryKey?: FaqCategoryKey;
  category?: Record<string, string>;
  icon?: string;
  questionTranslations?: Record<string, string>;
  answerTranslations?: Record<string, string>;
  sortOrder?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export const CONTENT_PAGE_LABELS: Record<ContentPageKey, string> = {
  "about-us": "About Us",
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms Of Use",
};
