"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { type StoreData } from "@/feature/private/store-management/types/store-management";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateStore } from "../hooks/use-update-store";
import { useDeleteStore } from "../hooks/use-delete-store";
import { EditStoreDialog } from "./edit-store-dialog";

export function StoreActionsCell({ store }: { store: StoreData }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateStore = useUpdateStore(store.id);
  const { mutateAsync: deleteStore, isPending: isDeleting } = useDeleteStore(store.id);
  const [isActive, setIsActive] = useState(store.status === "Active");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleStatusChange = async (checked: boolean) => {
    const previousState = isActive;
    setIsActive(checked);

    try {
      await updateStore.mutateAsync({
        status: checked ? "ACTIVE" : "INACTIVE",
      });
      successToast({
        title: `${store.storeName} is now ${checked ? "Active" : "Inactive"}`,
      });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
    } catch {
      setIsActive(previousState);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteStore();
      setDeleteOpen(false);
      successToast({
        title: "Store Deleted",
        description: response?.message || "Store has been deleted successfully.",
      });
    } catch {}
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => router.push(`${ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}/${store.id}`)}
          title="View store details"
        >
          <Eye className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => setEditOpen(true)}
          title="Edit store"
        >
          <Pencil className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          onClick={() => setDeleteOpen(true)}
          disabled={isDeleting}
          title="Delete store"
        >
          <Trash2 className="size-4" />
        </Button>

        <Switch
          checked={isActive}
          onCheckedChange={handleStatusChange}
          disabled={updateStore.isPending}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
          title={isActive ? "Active" : "Inactive"}
        />
      </div>

      <EditStoreDialog store={store} open={editOpen} onOpenChange={setEditOpen} />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Store"
        description={`Are you sure you want to delete ${store.storeName}? This action cannot be undone.`}
        confirmLabel="Delete Store"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
