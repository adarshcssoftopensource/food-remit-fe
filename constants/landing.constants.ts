export const VENDOR_NAV_LINKS = [
  { href: "#why-join", label: "Why Join" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#faq", label: "FAQ" },
] as const;

export const WHY_JOIN_POINTS = [
  "More customers",
  "More sales",
  "More repeat business",
  "No international shipping",
  "No delivery risk",
  "Guaranteed payment",
] as const;

export const MARKETS = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🌍", name: "Middle East" },
  { flag: "🌍", name: "Africa" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Customer Abroad",
    description: "A son in New York buys groceries for his mother in Cameroon.",
  },
  {
    step: "02",
    title: "Food Remit",
    description: "The order is securely transmitted to your store.",
  },
  {
    step: "03",
    title: "Your Store",
    description: "You prepare the order like any local purchase.",
  },
  {
    step: "04",
    title: "Pickup or Delivery",
    description: "The recipient receives the groceries locally.",
  },
  {
    step: "05",
    title: "You Get Paid",
    description: "Guaranteed settlement through Food Remit’s payment system.",
  },
] as const;

export const VENDOR_LOVES = [
  {
    title: "More Customers",
    description: "Access international buyers purchasing locally at your store.",
  },
  {
    title: "Higher Sales",
    description: "Receive orders throughout the day from people living overseas.",
  },
  {
    title: "Guaranteed Payments",
    description: "Food Remit processes customer payments before your order is fulfilled.",
  },
  {
    title: "Easy to Use",
    description: "Upload products. Receive orders. Prepare groceries. Get paid.",
  },
  {
    title: "Keep Your Brand",
    description: "Customers know they’re shopping at your store. We simply connect the buyers.",
  },
] as const;

export const BUSINESS_TYPES = [
  "Grocery Stores",
  "Supermarkets",
  "Restaurants",
  "Bakeries",
  "Meat Markets",
  "Seafood Markets",
  "Produce Markets",
  "Pharmacies",
  "Convenience Stores",
  "Specialty Food Shops",
  "Wholesale Food Suppliers",
] as const;

export const OPPORTUNITY_STORIES = [
  {
    from: "Chicago",
    habit: "Buying groceries every month",
    for: "family in Lagos",
  },
  {
    from: "London",
    habit: "Ordering meals every weekend",
    for: "parents in Ghana",
  },
  {
    from: "Paris",
    habit: "Sending groceries every payday",
    for: "relatives in Cameroon",
  },
] as const;

export const DIFFERENTIATORS = [
  {
    unlike: "Unlike food delivery apps",
    point: "Food Remit creates NEW customers.",
  },
  {
    unlike: "Unlike advertising",
    point: "You only prepare actual orders.",
  },
  {
    unlike: "Unlike marketplaces",
    point:
      "We specialize in food support between families living in the same or different countries.",
  },
] as const;

export const INVESTMENTS = [
  "Global marketing",
  "Customer acquisition",
  "Secure payments",
  "Technology",
  "Mobile applications",
  "International expansion",
] as const;

export const TRUST_ITEMS = [
  {
    title: "Secure payments",
    description: "Customer payments are processed before fulfillment begins.",
  },
  {
    title: "Transparent settlements",
    description: "Completed orders settle directly to your registered business account.",
  },
  {
    title: "Reliable partner support",
    description: "A dedicated team helps you onboard, grow, and succeed on the network.",
  },
] as const;

export const STATS = [
  { value: "12+", label: "Countries Launching" },
  { value: "500+", label: "Vendor Partners" },
  { value: "25k+", label: "Products Available" },
  { value: "100k+", label: "Orders Completed" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Food Remit brought us customers we never could have reached from our neighborhood store alone.",
    name: "Amina Okoro",
    role: "Owner, Fresh Basket Groceries",
  },
  {
    quote:
      "Orders arrive prepaid, fulfillment is simple, and our weekly revenue has grown steadily since joining.",
    name: "Jean-Baptiste Nguema",
    role: "Manager, Marché Central",
  },
  {
    quote:
      "We kept our brand and our way of working. Food Remit just opened the door to families abroad.",
    name: "Sara Mensah",
    role: "Founder, Home Kitchen Meals",
  },
] as const;

export const FAQS = [
  {
    question: "How much does it cost?",
    answer:
      "Creating a vendor account is free. Fees apply only when orders are processed through the platform.",
  },
  {
    question: "How do I receive payment?",
    answer:
      "Food Remit securely settles completed orders directly to your registered business account.",
  },
  {
    question: "Can I manage inventory?",
    answer: "Yes. You control your products, prices, availability, and promotions.",
  },
  {
    question: "Can restaurants participate?",
    answer:
      "Absolutely. Grocery stores, restaurants, bakeries, pharmacies, and specialty food businesses are all welcome.",
  },
  {
    question: "Is Food Remit available worldwide?",
    answer:
      "We’re expanding country by country and are actively onboarding vendor partners in each new market.",
  },
] as const;
