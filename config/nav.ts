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
} from "lucide-react";

import { ROUTES } from "@/config/routes";

export const navigationItems = [
  {
    title: "Dashboard",
    url: ROUTES.ADMIN.DASHBOARD,
    icon: Monitor,
  },
  {
    title: "Users Management",
    url: ROUTES.ADMIN.USERS_MANAGEMENT,
    icon: User,
  },
  {
    title: "Recycle Bin",
    url: ROUTES.ADMIN.RECYCLE_BIN,
    icon: Trash2,
  },

  {
    title: "Foundations & Charities Management",
    url: ROUTES.ADMIN.FOUNDATION_MANAGEMENT,
    icon: Building,
    isComingSoon: true,
  },
  {
    title: "Philanthropist Management",
    url: ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT,
    icon: Users,
    isComingSoon: true,
  },
  {
    title: "Sub/Co-admin Management",
    url: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT,
    icon: UserCog,
  },
  {
    title: "Stories",
    url: ROUTES.ADMIN.STORIES.LIST,
    icon: RefreshCcw,
    isComingSoon: true,
  },
  {
    title: "Donation Logs",
    url: ROUTES.ADMIN.DONATION_LOGS,
    icon: List,
    isComingSoon: true,
  },
  {
    title: "Catalogue Management",
    url: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ROOT,
    icon: BookOpen,
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
    title: "Store Management",
    url: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
    icon: Store,
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
  {
    title: "Country Management",
    url: ROUTES.ADMIN.COUNTRY_MANAGEMENT.ROOT,
    icon: Globe,
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
    items: [
      {
        title: "City Managers",
        url: ROUTES.ADMIN.CITY_MANAGEMENT.LIST,
      },
    ],
  },
  {
    title: "Order Management",
    url: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
    icon: Box,
  },
  {
    title: "Ticket Management",
    url: ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT,
    icon: Ticket,
    items: [
      {
        title: "Active Requests",
        url: ROUTES.ADMIN.TICKET_MANAGEMENT.ACTIVE_REQUESTS,
      },
      {
        title: "Closed Requests",
        url: ROUTES.ADMIN.TICKET_MANAGEMENT.CLOSED_REQUESTS,
      },
    ],
  },
  {
    title: "Report Management",
    url: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT,
    icon: ClipboardList,
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
    title: "Feedback Management",
    url: ROUTES.ADMIN.FEEDBACK_MANAGEMENT,
    icon: MessageSquare,
  },
  {
    title: "Send Notification",
    url: ROUTES.ADMIN.SEND_NOTIFICATION,
    icon: Bell,
  },
  {
    title: "Coupons Management",
    url: ROUTES.ADMIN.COUPONS_MANAGEMENT,
    icon: Gift,
  },
  {
    title: "Amount Limit Management",
    url: ROUTES.ADMIN.AMOUNT_LIMIT_MANAGEMENT,
    icon: DollarSign,
  },
  {
    title: "Credits Management",
    url: ROUTES.ADMIN.CREDITS_MANAGEMENT.PENDING_CREDITS,
    icon: CreditCard,
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
  {
    title: "Flash Images Management",
    url: ROUTES.ADMIN.TUTORIAL_MANAGEMENT,
    icon: GraduationCap,
  },
  {
    title: "Partner Leads CRM",
    url: ROUTES.ADMIN.PARTNER_LEADS,
    icon: Building,
    isNewFeature: true,
  },
];

export const cmsNavigationItems = [
  {
    title: "About Us",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.ABOUT_US,
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.PRIVACY_POLICY,
    icon: FileText,
  },
  {
    title: "Terms Of Use",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.TERMS_OF_USE,
    icon: FileText,
  },
  {
    title: "FAQ",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.FAQ,
    icon: FileText,
  },
];
