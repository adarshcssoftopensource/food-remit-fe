import {
  ChevronRight,
  Monitor,
  User,
  Building,
  Users,
  UserCog,
  RefreshCcw,
  List,
  BookOpen,
  Store,
  Globe,
  MapPin,
  Box,
  FileText,
  Ticket,
  ClipboardList,
  MessageSquare,
  Bell,
  Gift,
  DollarSign,
  CreditCard,
  GraduationCap,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Monitor,
  },
  {
    title: "Users Management",
    url: "/users-management",
    icon: User,
  },
  {
    title: "Foundation And Charitables Management",
    url: "/foundation-management",
    icon: Building,
  },
  {
    title: "Philanthropist Management",
    url: "/philanthropist-management",
    icon: Users,
  },
  {
    title: "Sub-admin Management",
    url: "/sub-admin-management",
    icon: UserCog,
  },
  {
    title: "Stories",
    url: "/stories",
    icon: RefreshCcw,
  },
  {
    title: "Donation Logs",
    url: "/donation-logs",
    icon: List,
  },
  {
    title: "Catalogue Management",
    url: "/catalogue-management",
    icon: BookOpen,
    items: [
      {
        title: "Store",
        url: "/catalogue-management/store",
      },
      {
        title: "Assign City-Manager To Stores",
        url: "/catalogue-management/assign-city-manager",
      },
    ],
  },
  {
    title: "Store Management",
    url: "/store-management",
    icon: Store,
    items: [
      {
        title: "All Stores",
        url: "/store-management/all",
      },
    ],
  },
  {
    title: "Country Management",
    url: "/country-management",
    icon: Globe,
    items: [
      {
        title: "Countries",
        url: "/country-management/list",
      },
    ],
  },
  {
    title: "City Management",
    url: "/city-management",
    icon: MapPin,
    items: [
      {
        title: "Cities",
        url: "/city-management/list",
      },
    ],
  },
  {
    title: "Order Management",
    url: "/order-management",
    icon: Box,
    items: [
      {
        title: "Orders",
        url: "/order-management/list",
      },
    ],
  },
  {
    title: "Content Management",
    url: "/content-management",
    icon: FileText,
    items: [
      {
        title: "Pages",
        url: "/content-management/pages",
      },
    ],
  },
  {
    title: "Ticket Management",
    url: "/ticket-management",
    icon: Ticket,
    items: [
      {
        title: "Tickets",
        url: "/ticket-management/list",
      },
    ],
  },
  {
    title: "Report Management",
    url: "/report-management",
    icon: ClipboardList,
    items: [
      {
        title: "Reports",
        url: "/report-management/list",
      },
    ],
  },
  {
    title: "Feedback Management",
    url: "/feedback-management",
    icon: MessageSquare,
  },
  {
    title: "Send Notification",
    url: "/send-notification",
    icon: Bell,
  },
  {
    title: "Coupons Management",
    url: "/coupons-management",
    icon: Gift,
  },
  {
    title: "Amount Limit Management",
    url: "/amount-limit-management",
    icon: DollarSign,
  },
  {
    title: "Credits Management",
    url: "/credits-management",
    icon: CreditCard,
    items: [
      {
        title: "Credits",
        url: "/credits-management/list",
      },
    ],
  },
  {
    title: "Tutorial Management",
    url: "/tutorial-management",
    icon: GraduationCap,
  },
];
