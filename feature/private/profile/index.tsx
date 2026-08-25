"use client";

import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePassword } from "./components/change-password";
import { ProfileForm } from "./components/profile-form";
import { ProfileHeader } from "./components/profile-header";
import { ProfilePermissions } from "./components/profile-permissions";

export function ProfilePage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings, personal details, and security preferences."
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
          <ProfilePermissions />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
}
