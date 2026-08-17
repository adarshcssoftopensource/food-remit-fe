"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type StoreData } from "@/feature/private/store-management/types/store-management";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { EditStoreDialog } from "./edit-store-dialog";
import { useUpdateStore } from "../hooks/use-update-store";
import { useQueryClient } from "@tanstack/react-query";
import { errorToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { ROUTES } from "@/config/routes";
import { useRouter } from "next/navigation";

export function StoreActionsCell({ store }: { store: StoreData }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateStore = useUpdateStore(store.id);
  const [isActive, setIsActive] = useState(store.status === "Active");
  const [editOpen, setEditOpen] = useState(false);

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

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="text-primary hover:bg-primary/10 size-8 rounded-lg transition-colors"
          onClick={() => router.push(`${ROUTES.ADMIN.STORE_MANAGEMENT.ROOT}/${store.id}`)}
          title="View store details"
        >
          <Eye size={20} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setEditOpen(true)}
          title="Edit store"
        >
          <Pencil size={20} />
        </Button>

        <Switch
          checked={isActive}
          onCheckedChange={handleStatusChange}
          disabled={updateStore.isPending}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
          title={isActive ? "Deactivate store" : "Activate store"}
        />
      </div>

      <EditStoreDialog store={store} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
