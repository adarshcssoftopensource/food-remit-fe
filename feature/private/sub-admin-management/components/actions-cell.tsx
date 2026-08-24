"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUpdateSubAdminStatus } from "../hooks/use-update-sub-admin-status";
import { SubAdminData } from "../types/sub-admin.types";
import { SubAdminDialog } from "./sub-admin-dialog";

export function SubAdminActionsCell({ admin }: { admin: SubAdminData }) {
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          title="View details"
          asChild
        >
          <Link href={ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.DETAILS(admin.id)}>
            <Eye className="size-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => setEditOpen(true)}
          title="Edit sub/co admin"
        >
          <Pencil className="size-4" />
        </Button>

        <Switch
          checked={isActive}
          disabled={isStatusUpdating}
          onCheckedChange={handleStatusToggle}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <SubAdminDialog mode="edit" admin={admin} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
