import {
  BarChart3,
  Bell,
  BookOpen,
  Box,
  Building,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  Info,
  List,
  MapPin,
  Megaphone,
  MessageSquare,
  Monitor,
  Package,
  RefreshCcw,
  Scale,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Ticket,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";

import { ROUTES } from "@/config/routes";

export interface NavItem {
  title: string;
  url: string;
  icon: any;
  items?: { title: string; url: string }[];
  isComingSoon?: boolean;
  isNewFeature?: boolean;
  group?: string;
}

export const NAVIGATION_GROUPS = [
  { id: "MAIN", label: "MAIN", collapsible: false, hideHeader: true },
  { id: "PEOPLE & ORGANIZATION", label: "People & Organization", collapsible: true },
  { id: "STORES & CATALOG", label: "Stores & Catalog", collapsible: true },
  { id: "ORDERS & CUSTOMERS", label: "Orders & Customers", collapsible: true },
  { id: "DONATIONS & CHARITIES", label: "Donations & Charities", collapsible: true },
  {
    id: "COMMUNICATION & CONTENT",
    label: "Communication & Content",
    collapsible: true,
  },
  { id: "REPORTS & FEEDBACK", label: "Reports & Feedback", collapsible: true },
  { id: "UTILITIES", label: "Utilities", collapsible: true },
] as const;

export const navigationItems: NavItem[] = [
  // MAIN
  {
    title: "Dashboard",
    url: ROUTES.ADMIN.DASHBOARD,
    icon: Monitor,
    group: "MAIN",
  },

  // PEOPLE & ORGANIZATION
  {
    title: "Users",
    url: ROUTES.ADMIN.USERS_MANAGEMENT,
    icon: User,
    group: "PEOPLE & ORGANIZATION",
  },
  {
    title: "Employees",
    url: ROUTES.ADMIN.EMPLOYEE_MANAGEMENT,
    icon: Users,
    group: "PEOPLE & ORGANIZATION",
  },
  {
    title: "Sub-Admins",
    url: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT,
    icon: UserCog,
    group: "PEOPLE & ORGANIZATION",
  },
  {
    title: "Partner Leads",
    url: ROUTES.ADMIN.PARTNER_LEADS,
    icon: Building,
    group: "PEOPLE & ORGANIZATION",
    isNewFeature: true,
  },

  // STORES & CATALOG
  {
    title: "Stores",
    url: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
    icon: Store,
    group: "STORES & CATALOG",
    items: [
      {
        title: "All Stores",
        url: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
      },
      {
        title: "Assign City Managers",
        url: ROUTES.ADMIN.STORE_MANAGEMENT.ASSIGN_CITY_MANAGER,
      },
    ],
  },
  {
    title: "Catalog",
    url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ROOT,
    icon: BookOpen,
    group: "STORES & CATALOG",
    items: [
      {
        title: "Departments",
        url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.DEPARTMENTS,
      },
      {
        title: "Categories",
        url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES,
      },
      {
        title: "Items",
        url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS,
      },
    ],
  },
  {
    title: "Product Boxes",
    url: ROUTES.ADMIN.PRODUCT_BOXES,
    icon: Package,
    group: "STORES & CATALOG",
  },
  {
    title: "Country Managers",
    url: ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST,
    icon: Globe,
    group: "STORES & CATALOG",
  },
  {
    title: "City Managers",
    url: ROUTES.ADMIN.CITY_MANAGEMENT.LIST,
    icon: MapPin,
    group: "STORES & CATALOG",
  },

  // ORDERS & CUSTOMERS
  {
    title: "Orders",
    url: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
    icon: Box,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "My Orders",
    url: ROUTES.ADMIN.MY_ORDERS,
    icon: Box,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Support Tickets",
    url: ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT,
    icon: Ticket,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Coupons",
    url: ROUTES.ADMIN.COUPONS_MANAGEMENT,
    icon: Gift,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Credits",
    url: ROUTES.ADMIN.CREDITS_MANAGEMENT,
    icon: CreditCard,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Amount Limits",
    url: ROUTES.ADMIN.AMOUNT_LIMIT_MANAGEMENT,
    icon: DollarSign,
    group: "ORDERS & CUSTOMERS",
  },

  // DONATIONS & CHARITIES
  {
    title: "Charities & Foundations",
    url: ROUTES.ADMIN.FOUNDATION_MANAGEMENT,
    icon: Heart,
    group: "DONATIONS & CHARITIES",
    isComingSoon: true,
  },
  {
    title: "Philanthropists",
    url: ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT,
    icon: HandHeart,
    group: "DONATIONS & CHARITIES",
    isComingSoon: true,
  },
  {
    title: "Donation Logs",
    url: ROUTES.ADMIN.DONATION_LOGS,
    icon: List,
    group: "DONATIONS & CHARITIES",
    isComingSoon: true,
  },

  // COMMUNICATION & CONTENT
  {
    title: "Stories",
    url: ROUTES.ADMIN.STORIES.LIST,
    icon: FileText,
    group: "COMMUNICATION & CONTENT",
    isComingSoon: true,
  },
  {
    title: "Send Notification",
    url: ROUTES.ADMIN.SEND_NOTIFICATION,
    icon: Bell,
    group: "COMMUNICATION & CONTENT",
  },
  {
    title: "Banners & Tutorials",
    url: ROUTES.ADMIN.TUTORIAL_MANAGEMENT,
    icon: GraduationCap,
    group: "COMMUNICATION & CONTENT",
  },

  // REPORTS & FEEDBACK
  {
    title: "Reports",
    url: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT,
    icon: ClipboardList,
    group: "REPORTS & FEEDBACK",
    items: [
      {
        title: "Store Reports",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT,
      },
      {
        title: "Customer Reports",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT,
      },
      {
        title: "Orders Reports",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.ORDERS_REPORT,
      },
      {
        title: "Coupons Reports",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.COUPONS_REPORT,
      },
    ],
  },
  {
    title: "Feedback",
    url: ROUTES.ADMIN.FEEDBACK_MANAGEMENT,
    icon: MessageSquare,
    group: "REPORTS & FEEDBACK",
  },

  // UTILITIES
  {
    title: "Recycle Bin",
    url: ROUTES.ADMIN.RECYCLE_BIN,
    icon: Trash2,
    group: "UTILITIES",
  },
];

export const cmsNavigationItems = [
  {
    title: "Landing Page",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.LANDING_PAGE,
    icon: Monitor,
  },
  {
    title: "About Us",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.ABOUT_US,
    icon: Info,
  },
  {
    title: "Privacy Policy",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.PRIVACY_POLICY,
    icon: Shield,
  },
  {
    title: "Terms Of Use",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.TERMS_OF_USE,
    icon: Scale,
  },
  {
    title: "FAQ",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.FAQ,
    icon: FileText,
  },
];
