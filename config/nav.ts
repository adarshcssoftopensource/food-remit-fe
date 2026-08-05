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
    title: "Foundation And Charitables Management",
    url: ROUTES.ADMIN.FOUNDATION_MANAGEMENT,
    icon: Building,
  },
  {
    title: "Philanthropist Management",
    url: ROUTES.ADMIN.PHILANTHROPIST_MANAGEMENT,
    icon: Users,
  },
  {
    title: "Sub-admin Management",
    url: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT,
    icon: UserCog,
  },
  {
    title: "Stories",
    url: ROUTES.ADMIN.STORIES.LIST,
    icon: RefreshCcw,
  },
  {
    title: "Donation Logs",
    url: ROUTES.ADMIN.DONATION_LOGS,
    icon: List,
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
        url: ROUTES.ADMIN.STORE_MANAGEMENT.ALL,
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
        title: "Countries",
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
    items: [
      {
        title: "Sent Orders",
        url: ROUTES.ADMIN.ORDER_MANAGEMENT.SENT_ORDERS,
      },
      {
        title: "Requested Orders",
        url: ROUTES.ADMIN.ORDER_MANAGEMENT.REQUESTED_ORDERS,
      },
      {
        title: "Partial Orders",
        url: ROUTES.ADMIN.ORDER_MANAGEMENT.PARTIAL_ORDERS,
      },
      {
        title: "Completed Orders",
        url: ROUTES.ADMIN.ORDER_MANAGEMENT.COMPLETED_ORDERS,
      },
      {
        title: "History",
        url: ROUTES.ADMIN.ORDER_MANAGEMENT.HISTORY,
      },
    ],
  },
  {
    title: "Content Management",
    url: ROUTES.ADMIN.CONTENT_MANAGEMENT.ROOT,
    icon: FileText,
    items: [
      {
        title: "About Us",
        url: ROUTES.ADMIN.CONTENT_MANAGEMENT.ABOUT_US,
      },
      {
        title: "Privacy Policy",
        url: ROUTES.ADMIN.CONTENT_MANAGEMENT.PRIVACY_POLICY,
      },
      {
        title: "Terms Of Use",
        url: ROUTES.ADMIN.CONTENT_MANAGEMENT.TERMS_OF_USE,
      },
      {
        title: "FAQ",
        url: ROUTES.ADMIN.CONTENT_MANAGEMENT.FAQ,
      },
    ],
  },
  {
    title: "Ticket Management",
    url: ROUTES.ADMIN.TICKET_MANAGEMENT.ROOT,
    icon: Ticket,
    items: [
      {
        title: "Tickets",
        url: ROUTES.ADMIN.TICKET_MANAGEMENT.LIST,
      },
    ],
  },
  {
    title: "Report Management",
    url: ROUTES.ADMIN.REPORT_MANAGEMENT.ROOT,
    icon: ClipboardList,
    items: [
      {
        title: "Reports",
        url: ROUTES.ADMIN.REPORT_MANAGEMENT.LIST,
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
    url: ROUTES.ADMIN.CREDITS_MANAGEMENT.ROOT,
    icon: CreditCard,
    items: [
      {
        title: "Credits",
        url: ROUTES.ADMIN.CREDITS_MANAGEMENT.LIST,
      },
    ],
  },
  {
    title: "Tutorial Management",
    url: ROUTES.ADMIN.TUTORIAL_MANAGEMENT,
    icon: GraduationCap,
  },
];
