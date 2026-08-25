export type ContentPageKey = "about-us" | "privacy-policy" | "terms-of-use";

export type ContentPageData = {
  key: ContentPageKey;
  label: string;
  title: string;
  description: string;
  updatedAt: string;
};

export type FaqData = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export const CONTENT_PAGE_LABELS: Record<ContentPageKey, string> = {
  "about-us": "About Us",
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms Of Use",
};
