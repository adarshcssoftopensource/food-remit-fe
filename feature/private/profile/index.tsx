"use client";

import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChangePassword } from "./components/change-password";
import { ProfileForm } from "./components/profile-form";
import { ProfileHeader } from "./components/profile-header";
import { ProfilePermissions } from "./components/profile-permissions";

export function ProfilePage() {
  const { profile } = useProfile();
  const isEmployee = profile?.roleCode === "EMPLOYEE" || profile?.role === "employee";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings, personal details, and security preferences."
        action={
          isEmployee && (
            <Link href={ROUTES.ADMIN.MY_ORDERS}>
              <Button
                variant="outline"
                className="h-10 rounded-xl px-4 text-sm font-semibold shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Orders
              </Button>
            </Link>
          )
        }
      />

      <ProfileHeader />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 grid h-auto w-full max-w-md grid-cols-2 gap-1.5 rounded-2xl border border-white/80 bg-white/70 p-1.5 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
          <TabsTrigger value="general" className="h-10 rounded-xl text-xs font-semibold sm:text-sm">
            General Details
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="h-10 rounded-xl text-xs font-semibold sm:text-sm"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0 space-y-6">
          <ProfileForm />
          {!isEmployee && <ProfilePermissions />}
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
}
