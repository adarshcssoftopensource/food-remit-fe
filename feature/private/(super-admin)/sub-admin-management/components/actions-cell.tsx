"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";
import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteSubAdmin } from "../hooks/use-delete-sub-admin";
import { useUpdateSubAdminStatus } from "../hooks/use-update-sub-admin-status";
import { SubAdminData } from "../types/sub-admin.types";
import { SubAdminDialog } from "./sub-admin-dialog";

export function SubAdminActionsCell({ admin }: { admin: SubAdminData }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(admin.status === "Active");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutateAsync: updateStatus, isPending: isStatusUpdating } = useUpdateSubAdminStatus(
    admin.id,
  );
  const deleteMutation = useDeleteSubAdmin();

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

  const handleDelete = async () => {
    try {
      const response = await deleteMutation.mutateAsync(admin.id);
      setDeleteOpen(false);
      successToast({
        title: response.message || `${admin.userName} deleted successfully`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const roleLabel = admin.role === "CO_ADMIN" ? "Co-Admin" : "Sub-Admin";

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
    {
      label: `Delete ${roleLabel}`,
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: deleteMutation.isPending,
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

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${roleLabel}`}
        description={`Are you sure you want to delete ${admin.userName}? They will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </>
  );
}
