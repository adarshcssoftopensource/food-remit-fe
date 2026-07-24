import { Globe, LucideIcon, ShieldCheck, Users, Zap } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
};

export const AUTH_FEATURES: Feature[] = [
  {
    icon: Globe,
    title: "Global Remittance",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
  },
  {
    icon: Users,
    title: "Connect & Support",
  },
];
