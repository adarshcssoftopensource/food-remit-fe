export type ContentPageKey = "about-us" | "privacy-policy" | "terms-of-use";

export type ContentPageData = {
  id: string;
  key: ContentPageKey;
  label: string;
  title: string;
  description: string;
  updatedAt: string;
  createdAt?: string;
};

export type FaqData = {
  id: string;
  question: string;
  answer: string;
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
