import {
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
  Info,
  Shield,
  Scale,
  List,
  MapPin,
  MessageSquare,
  Monitor,
  RefreshCcw,
  Store,
  Ticket,
  Trash2,
  User,
  UserCog,
  Users,
  Package,
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
  { id: "MAIN", label: "MAIN", collapsible: false },
  { id: "PRODUCTS & INVENTORY", label: "PRODUCTS & INVENTORY", collapsible: true },
  { id: "ORDERS & CUSTOMERS", label: "ORDERS & CUSTOMERS", collapsible: true },
  { id: "PEOPLE", label: "PEOPLE", collapsible: true },
  { id: "REPORTS", label: "REPORTS", collapsible: true },
  { id: "UTILITIES", label: "UTILITIES", collapsible: true },
] as const;

export const navigationItems: NavItem[] = [
  // MAIN
  {
    title: "Dashboard",
    url: ROUTES.ADMIN.DASHBOARD,
    icon: Monitor,
    group: "MAIN",
  },

  // PRODUCTS & INVENTORY
  {
    title: "Catalogue Management",
    url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ROOT,
    icon: BookOpen,
    group: "PRODUCTS & INVENTORY",
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
    title: "Product Boxes Management",
    url: ROUTES.ADMIN.PRODUCT_BOXES,
    icon: Package,
    group: "PRODUCTS & INVENTORY",
  },
  {
    title: "Store Management",
    url: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
    icon: Store,
    group: "PRODUCTS & INVENTORY",
    items: [
      {
        title: "Store",
        url: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
      },
      {
        title: "Assign City-Manager To Stores",
        url: ROUTES.ADMIN.STORE_MANAGEMENT.ASSIGN_CITY_MANAGER,
      },
    ],
  },

  // ORDERS & CUSTOMERS
  {
    title: "Order Management",
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
    title: "Ticket Management",
    url: ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT,
    icon: Ticket,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Coupons Management",
    url: ROUTES.ADMIN.COUPONS_MANAGEMENT,
    icon: Gift,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Amount Limit Management",
    url: ROUTES.ADMIN.AMOUNT_LIMIT_MANAGEMENT,
    icon: DollarSign,
    group: "ORDERS & CUSTOMERS",
  },
  {
    title: "Credits Management",
    url: ROUTES.ADMIN.CREDITS_MANAGEMENT.PENDING_CREDITS,
    icon: CreditCard,
    group: "ORDERS & CUSTOMERS",
    items: [
      {
        title: "Pending Credits",
        url: ROUTES.ADMIN.CREDITS_MANAGEMENT.PENDING_CREDITS,
      },
      {
        title: "Completed Credits",
        url: ROUTES.ADMIN.CREDITS_MANAGEMENT.COMPLETED_CREDITS,
      },
    ],
  },

  // PEOPLE
  {
    title: "Employee Management",
    url: ROUTES.ADMIN.EMPLOYEE_MANAGEMENT,
    icon: Users,
    group: "PEOPLE",
  },
  {
    title: "Users Management",
    url: ROUTES.ADMIN.USERS_MANAGEMENT,
    icon: User,
    group: "PEOPLE",
  },
  {
    title: "Sub/Co-admin Management",
    url: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT,
    icon: UserCog,
    group: "PEOPLE",
  },
  {
    title: "Foundations & Charities Management",
    url: ROUTES.ADMIN.FOUNDATION_MANAGEMENT,
    icon: Building,
    group: "PEOPLE",
    isComingSoon: true,
  },
  {
    title: "Philanthropist Management",
    url: ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT,
    icon: Users,
    group: "PEOPLE",
    isComingSoon: true,
  },

  // REPORTS
  {
    title: "Report Management",
    url: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT,
    icon: ClipboardList,
    group: "REPORTS",
    items: [
      {
        title: "Store Report",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT,
      },
      {
        title: "Customer Report",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT,
      },
      {
        title: "Orders Report",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.ORDERS_REPORT,
      },
      {
        title: "Coupons Report",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.COUPONS_REPORT,
      },
    ],
  },
  {
    title: "Donation Logs",
    url: ROUTES.ADMIN.DONATION_LOGS,
    icon: List,
    group: "REPORTS",
    isComingSoon: true,
  },

  // UTILITIES
  {
    title: "Partner Leads CRM",
    url: ROUTES.ADMIN.PARTNER_LEADS,
    icon: Building,
    group: "UTILITIES",
    isNewFeature: true,
  },
  {
    title: "Country Management",
    url: ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT,
    icon: Globe,
    group: "UTILITIES",
    items: [
      {
        title: "Country Managers",
        url: ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST,
      },
    ],
  },
  {
    title: "City Management",
    url: ROUTES.ADMIN.CITY_MANAGEMENT.ROOT,
    icon: MapPin,
    group: "UTILITIES",
    items: [
      {
        title: "City Managers",
        url: ROUTES.ADMIN.CITY_MANAGEMENT.LIST,
      },
    ],
  },
  {
    title: "Feedback Management",
    url: ROUTES.ADMIN.FEEDBACK_MANAGEMENT,
    icon: MessageSquare,
    group: "UTILITIES",
  },
  {
    title: "Send Notification",
    url: ROUTES.ADMIN.SEND_NOTIFICATION,
    icon: Bell,
    group: "UTILITIES",
  },
  {
    title: "Flash Images Management",
    url: ROUTES.ADMIN.TUTORIAL_MANAGEMENT,
    icon: GraduationCap,
    group: "UTILITIES",
  },
  {
    title: "Stories",
    url: ROUTES.ADMIN.STORIES.LIST,
    icon: RefreshCcw,
    group: "UTILITIES",
    isComingSoon: true,
  },
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
