"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Bell,
  Building,
  Building2,
  CheckCircle2,
  Coins,
  FileText,
  FolderOpen,
  Globe,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Sliders,
  Store,
  Tag,
  Ticket,
  Users,
  Video,
} from "lucide-react";

// Mapping of permission keys to user-friendly labels and icons
const PERMISSION_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  userManagement: { label: "User Management", icon: Users },
  countryManagement: { label: "Country Management", icon: Globe },
  donationLogs: { label: "Donation Logs", icon: FileText },
  philanthropistsManagement: { label: "Philanthropist Management", icon: Heart },
  cityManagement: { label: "City Management", icon: Building },
  storeManagement: { label: "Store Management", icon: Store },
  ticketManagement: { label: "Ticket Management", icon: Ticket },
  feedbacks: { label: "Feedback Management", icon: MessageSquare },
  sendNotifications: { label: "Send Notifications", icon: Bell },
  creditsManagement: { label: "Credits Management", icon: Coins },
  catalogueManagement: { label: "Catalogue Management", icon: FolderOpen },
  contentManagement: { label: "Content Management", icon: Video },
  reportManagement: { label: "Report Management", icon: BarChart3 },
  couponManagement: { label: "Coupon Management", icon: Tag },
  amountLimits: { label: "Amount Limits", icon: Sliders },
  imageManagement: { label: "Image Management", icon: ImageIcon },
  organization: { label: "Organization Management", icon: Building2 },
};

export function ProfilePermissions() {
  const { profile, isSuperAdmin } = useProfile();

  // If the user is Super Admin, don't show the permissions section
  if (isSuperAdmin) {
    return null;
  }

  const permissions = (profile?.permissions || {}) as Record<string, number>;

  return (
    <Card className="rounded-[2rem] border-0 shadow-2xl ring-1 shadow-black/5 ring-slate-200">
      <CardHeader className="border-b bg-slate-50/50 px-8 py-6">
        <CardTitle className="text-xl font-bold tracking-tight text-slate-800">
          Module Access Permissions
        </CardTitle>
        <CardDescription className="text-sm font-medium text-slate-500">
          Read-only view of access controls assigned to your sub-admin account.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(PERMISSION_CONFIG).map(([key, config]) => {
            const hasAccess = permissions[key] === 1;
            const Icon = config.icon;

            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  hasAccess
                    ? "border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/40"
                    : "border-slate-100 bg-slate-50/30 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      hasAccess ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{config.label}</span>
                </div>

                <div>
                  {hasAccess ? (
                    <Badge className="gap-1 rounded-lg border-0 bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700 hover:bg-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Allowed
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 rounded-lg border-0 bg-slate-100 px-2.5 py-1 font-bold text-slate-500"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Restricted
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
