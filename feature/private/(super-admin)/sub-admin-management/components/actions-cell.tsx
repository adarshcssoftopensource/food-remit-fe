"use client";

import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { useUpdateSubAdminStatus } from "../hooks/use-update-sub-admin-status";
import { SubAdminData } from "../types/sub-admin.types";
import { SubAdminDialog } from "./sub-admin-dialog";

import { useRouter } from "next/navigation";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

export function SubAdminActionsCell({ admin }: { admin: SubAdminData }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(admin.status === "Active");
  const [editOpen, setEditOpen] = useState(false);

  const { mutateAsync: updateStatus, isPending: isStatusUpdating } = useUpdateSubAdminStatus(
    admin.id,
  );

  const handleStatusToggle = async (checked: boolean) => {
    setIsActive(checked);
    try {
      const response = await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({
        title:
          response.message || `Sub/Co Admin ${checked ? "activated" : "deactivated"} successfully`,
      });
    } catch {
      setIsActive(!checked);
    }
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.DETAILS(admin.id)),
    },
    {
      label: "Edit Sub-Admin",
      icon: <Pencil className="size-4" />,
      onClick: () => setEditOpen(true),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          disabled={isStatusUpdating}
          onCheckedChange={handleStatusToggle}
          className="data-[state=checked]:bg-emerald-500"
          title={isActive ? "Active" : "Inactive"}
        />

        <DataTableRowActions items={actionItems} />
      </div>

      <SubAdminDialog mode="edit" admin={admin} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
