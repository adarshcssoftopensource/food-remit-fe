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

export const CONTENT_PAGES: Record<ContentPageKey, ContentPageData> = {
  "about-us": {
    key: "about-us",
    label: "About Us",
    title: "About Us",
    description: `FoodRemit is a mobile application for food ordering and delivery that connects customers with stores across cities.

Our platform makes it easy to discover meals, place orders, and support communities through food remittance and charitable giving.

We focus on reliable delivery, transparent pricing, and a seamless experience for customers, store partners, and city managers.`,
    updatedAt: "2026-03-10 12:00:00",
  },
  "privacy-policy": {
    key: "privacy-policy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    description: `Last Modified: [Oct/03/2022]

Acceptance of the Terms of Use
By accessing or using FoodRemit, you agree to our collection and use of information as described in this Privacy Policy.

Information We Collect
We may collect account details, contact information, order history, device data, and usage analytics to operate and improve the platform.

How We Use Information
Data is used to fulfill orders, provide support, personalize experiences, prevent fraud, and comply with legal obligations.

Data Sharing
We share information with service providers, payment processors, and partners only as needed to deliver the service.

Your Choices
You may update profile information, request access or deletion where applicable, and manage notification preferences in the app.`,
    updatedAt: "2026-03-10 12:05:00",
  },
  "terms-of-use": {
    key: "terms-of-use",
    label: "Terms Of Use",
    title: "Terms & Conditions",
    description: `Last Modified: [Oct/03/2022]

Acceptance of the Terms of Use
These Terms govern your use of the FoodRemit website and mobile application. By using the service, you accept these Terms.

Accounts
You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.

Orders & Payments
Orders are subject to availability and store acceptance. Prices, fees, and taxes are shown at checkout.

Prohibited Use
You may not misuse the platform, attempt unauthorized access, or engage in fraudulent activity.

Limitation of Liability
To the fullest extent permitted by law, FoodRemit is not liable for indirect or consequential damages arising from use of the service.`,
    updatedAt: "2026-03-10 12:10:00",
  },
};

export const MOCK_FAQS: FaqData[] = [
  {
    id: "faq-001",
    question: "How can I contact customer support for FoodRemit?",
    answer:
      "To contact customer support for FoodRemit, open the app and look for the Support or Help section. You can also email support@foodremit.com for assistance.",
    createdAt: "2026-01-12 09:20:00",
  },
  {
    id: "faq-002",
    question: "Is FoodRemit available in my city?",
    answer:
      "FoodRemit availability depends on city coverage. Open the app, allow location access, or search your city to see if delivery and store partners are active in your area.",
    createdAt: "2026-01-14 11:05:00",
  },
  {
    id: "faq-003",
    question: "How do I place an order?",
    answer:
      "Browse stores or items, add products to your cart, choose a delivery address, select a payment method, and confirm your order.",
    createdAt: "2026-01-18 15:40:00",
  },
  {
    id: "faq-004",
    question: "Can I track my delivery in real time?",
    answer:
      "Yes. After placing an order, open Order Details to view live status updates from confirmation through delivery.",
    createdAt: "2026-01-22 08:15:00",
  },
  {
    id: "faq-005",
    question: "What payment methods are supported?",
    answer:
      "FoodRemit supports major cards, digital wallets, and other local payment options depending on your country and store settings.",
    createdAt: "2026-02-01 10:00:00",
  },
  {
    id: "faq-006",
    question: "How do refunds work?",
    answer:
      "Eligible refunds are processed according to order status and store policy. Approved refunds typically return to the original payment method within a few business days.",
    createdAt: "2026-02-05 13:25:00",
  },
  {
    id: "faq-007",
    question: "Can I cancel an order after placing it?",
    answer:
      "You may cancel before the store accepts the order. Once preparation or delivery has started, cancellation may not be available.",
    createdAt: "2026-02-10 16:50:00",
  },
  {
    id: "faq-008",
    question: "How do I update my delivery address?",
    answer:
      "Go to Profile or Addresses in the app, add or edit an address, and select it at checkout before confirming your order.",
    createdAt: "2026-02-14 09:35:00",
  },
  {
    id: "faq-009",
    question: "Are there delivery fees?",
    answer:
      "Delivery fees vary by distance, store, and promotions. Any applicable fees are shown clearly before you place the order.",
    createdAt: "2026-02-20 12:10:00",
  },
  {
    id: "faq-010",
    question: "How do philanthropists send food through FoodRemit?",
    answer:
      "Philanthropists can browse stories or foundations, choose items or credits, and complete checkout to remit food support to recipients.",
    createdAt: "2026-02-28 18:00:00",
  },
  {
    id: "faq-011",
    question: "How do I reset my password?",
    answer:
      "On the login screen, tap Forgot Password, enter your registered email, and follow the reset link sent to your inbox.",
    createdAt: "2026-03-02 07:45:00",
  },
];
