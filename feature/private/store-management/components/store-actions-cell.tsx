"use client";

import { AdminPasswordDialog } from "@/components/common/admin-password-dialog";
import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { type StoreData } from "@/feature/private/store-management/types/store-management";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeleteStore } from "../hooks/use-delete-store";
import { useImpersonateStore } from "../hooks/use-impersonate-store";
import { useUpdateStore } from "../hooks/use-update-store";
import { EditStoreDialog } from "./edit-store-dialog";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

export function StoreActionsCell({ store }: { store: StoreData }) {
  const router = useRouter();
  const { isSuperAdmin } = useProfile();
  const queryClient = useQueryClient();
  const updateStore = useUpdateStore(store.id);
  const impersonate = useImpersonateStore();
  const { mutateAsync: deleteStore, isPending: isDeleting } = useDeleteStore(store.id);
  const isActive = store.status === "Active";
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<boolean>(!isActive);

  const handleStatusSwitchClick = () => {
    setTargetStatus(!isActive);
    setStatusOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    const nextStatus = targetStatus;
    await updateStore.mutateAsync({
      status: nextStatus ? "ACTIVE" : "INACTIVE",
    });
    successToast({
      title: `${store.storeName} is now ${nextStatus ? "Active" : "Inactive"}`,
    });
    queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
  };

  const handleConfirmDelete = async () => {
    const response = await deleteStore();
    successToast({
      title: "Store Deleted",
      description: response?.message || "Store has been deleted successfully.",
    });
  };

  const handleImpersonate = async () => {
    try {
      await impersonate.mutateAsync(store.id);
      successToast({ title: "Impersonating Store Manager..." });
    } catch {}
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(`${ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}/${store.id}`),
    },
    {
      label: "Edit Store",
      icon: <Pencil className="size-4" />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Go to portal",
      icon: <ExternalLink className="size-4" />,
      onClick: handleImpersonate,
      disabled: impersonate.isPending,
      hidden: !isSuperAdmin,
    },
    {
      label: "Delete Store",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          onCheckedChange={handleStatusSwitchClick}
          disabled={updateStore.isPending}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
          title={isActive ? "Active" : "Inactive"}
        />

        <DataTableRowActions items={actionItems} />
      </div>

      <EditStoreDialog store={store} open={editOpen} onOpenChange={setEditOpen} />

      <AdminPasswordDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={targetStatus ? "Activate Store" : "Deactivate Store"}
        description={`Are you sure you want to ${targetStatus ? "activate" : "deactivate"} "${store.storeName}"? Please enter your admin password to proceed.`}
        confirmLabel={targetStatus ? "Activate Store" : "Deactivate Store"}
        variant={targetStatus ? "default" : "destructive"}
        onConfirm={handleConfirmStatusChange}
      />

      <AdminPasswordDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Store"
        description={`Are you sure you want to delete "${store.storeName}"? It will be moved to the Recycle Bin and can be restored later. Please enter your admin password to proceed.`}
        confirmLabel="Delete Store"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
