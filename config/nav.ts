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
    url: "#",
    icon: Building,
  },
  {
    title: "Philanthropist Management",
    url: "#",
    icon: Users,
  },
  {
    title: "Sub-admin Management",
    url: "#",
    icon: UserCog,
  },
  {
    title: "Stories",
    url: "#",
    icon: RefreshCcw,
  },
  {
    title: "Donation Logs",
    url: "#",
    icon: List,
  },
  {
    title: "Catalogue Management",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Store",
        url: "#",
      },
      {
        title: "Assign City-Manager To Stores",
        url: "#",
      },
    ],
  },
  {
    title: "Store Management",
    url: "#",
    icon: Store,
    items: [
      {
        title: "All Stores",
        url: "#",
      },
    ],
  },
  {
    title: "Country Management",
    url: "#",
    icon: Globe,
    items: [
      {
        title: "Countries",
        url: "#",
      },
    ],
  },
  {
    title: "City Management",
    url: "#",
    icon: MapPin,
    items: [
      {
        title: "Cities",
        url: "#",
      },
    ],
  },
  {
    title: "Order Management",
    url: "#",
    icon: Box,
    items: [
      {
        title: "Orders",
        url: "#",
      },
    ],
  },
  {
    title: "Content Management",
    url: "#",
    icon: FileText,
    items: [
      {
        title: "Pages",
        url: "#",
      },
    ],
  },
  {
    title: "Ticket Management",
    url: "#",
    icon: Ticket,
    items: [
      {
        title: "Tickets",
        url: "#",
      },
    ],
  },
  {
    title: "Report Management",
    url: "#",
    icon: ClipboardList,
    items: [
      {
        title: "Reports",
        url: "#",
      },
    ],
  },
  {
    title: "Feedback Management",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Send Notification",
    url: "#",
    icon: Bell,
  },
  {
    title: "Coupons Management",
    url: "#",
    icon: Gift,
  },
  {
    title: "Amount Limit Management",
    url: "#",
    icon: DollarSign,
  },
  {
    title: "Credits Management",
    url: "#",
    icon: CreditCard,
    items: [
      {
        title: "Credits",
        url: "#",
      },
    ],
  },
  {
    title: "Tutorial Management",
    url: "#",
    icon: GraduationCap,
  },
];
