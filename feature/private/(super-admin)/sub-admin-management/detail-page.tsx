"use client";

import { PageHeader } from "@/components/common/page-header";
import { CalendarDays, Mail, Phone, User } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/get-initials";
import { useMemo, useState } from "react";

import { DetailSkeleton } from "./components/detail-skeleton";
import {
  ModulePermissionsCard,
  PersonalInfoCard,
  SubAdminProfileCard,
  type SubAdminDetailItem,
} from "./components/sub-admin-detail-sections";
import { useGetSubAdminById } from "./hooks/use-get-sub-admin-by-id";
import { useSubAdminPermissions } from "./hooks/use-sub-admin-permissions";
import type { SubAdminData } from "./types/sub-admin.types";

interface SubAdminDetailPageProps {
  id: string;
}

function getAdminDetails(admin: SubAdminData): SubAdminDetailItem[] {
  return [
    {
      label: "Full Name",
      value: admin.userName,
      icon: <User className="h-4.5 w-4.5" />,
      color: "emerald",
    },
    {
      label: "Email Address",
      value: admin.email,
      icon: <Mail className="h-4.5 w-4.5" />,
      color: "primary",
    },
    {
      label: "Phone Number",
      value: `${admin.countryCode ?? ""} ${admin.contactNumber ?? ""}`.trim() || "—",
      icon: <Phone className="h-4.5 w-4.5" />,
      color: "emerald",
    },
    {
      label: "Joined On",
      value: admin.createdAt ? formatDate(admin.createdAt, { month: "long" }) : "—",
      icon: <CalendarDays className="h-4.5 w-4.5" />,
      color: "amber",
    },
  ];
}

export function SubAdminDetailPage({ id }: SubAdminDetailPageProps) {
  const { data, isLoading } = useGetSubAdminById(id);
  const { data: permissionsData } = useSubAdminPermissions(true);
  const admin = data?.data;
  const allPermissions = useMemo(() => permissionsData?.data || [], [permissionsData?.data]);

  const [isNotGrantedOpen, setIsNotGrantedOpen] = useState(false);

  const grantedPermissions = useMemo(() => {
    if (!admin?.permissions) return [];
    return allPermissions.filter((p) => admin.permissions.some((ap) => ap.key === p.key));
  }, [allPermissions, admin]);

  const notGrantedPermissions = useMemo(() => {
    return allPermissions.filter((p) => !admin?.permissions?.some((ap) => ap.key === p.key));
  }, [allPermissions, admin]);

  if (isLoading) return <DetailSkeleton />;
  if (!admin) return null;

  const initials = getInitials(admin.userName);
  const isActive = admin.status === "Active";

  const details = getAdminDetails(admin);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          breadcrumbs={[
            { label: "Sub/Co Admin Management", href: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT },
            { label: "Sub/Co Admin Details" },
          ]}
        />
      </div>

      <SubAdminProfileCard admin={admin} initials={initials} isActive={isActive} />

      <div className="grid gap-5">
        <PersonalInfoCard details={details} />

        <ModulePermissionsCard
          admin={admin}
          allPermissions={allPermissions}
          grantedPermissions={grantedPermissions}
          notGrantedPermissions={notGrantedPermissions}
          isNotGrantedOpen={isNotGrantedOpen}
          setIsNotGrantedOpen={setIsNotGrantedOpen}
        />
      </div>
    </div>
  );
}
