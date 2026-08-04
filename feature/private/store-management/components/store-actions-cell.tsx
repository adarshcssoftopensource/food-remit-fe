"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type StoreData } from "@/constants/store-management";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { EditStoreDialog } from "./edit-store-dialog";
import { StoreDetailDialog } from "./store-detail-dialog";

export function StoreActionsCell({ store }: { store: StoreData }) {
  const [isActive, setIsActive] = useState(store.status === "Active");
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    successToast({
      title: `${store.storeName} is now ${checked ? "Active" : "Inactive"}`,
    });
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="text-primary hover:bg-primary/10 size-8 rounded-lg transition-colors"
          onClick={() => setViewOpen(true)}
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
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-200"
          title={isActive ? "Deactivate store" : "Activate store"}
        />

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          title="Open store link"
        >
          <ExternalLink size={20} />
        </Button>
      </div>

      <StoreDetailDialog store={store} open={viewOpen} onOpenChange={setViewOpen} />
      <EditStoreDialog store={store} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
