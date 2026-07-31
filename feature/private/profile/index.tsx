"use client";

import { PageHeader } from "@/components/common/page-header";
import { ProfileForm } from "./components/profile-form";
import { ProfileHeader } from "./components/profile-header";

export function ProfilePage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings, personal details, and security preferences."
      />

      <ProfileHeader />

      <ProfileForm />
    </div>
  );
}
