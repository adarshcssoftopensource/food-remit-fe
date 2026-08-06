"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { SubAdminData } from "../types/sub-admin.types";
import { SubAdminDetailDialog } from "./sub-admin-detail-dialog";
import { SubAdminDialog } from "./sub-admin-dialog";

export function SubAdminActionsCell({ admin }: { admin: SubAdminData }) {
  const [isActive, setIsActive] = useState(admin.status === "Active");
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10 size-8 rounded-lg transition-colors"
          onClick={() => setViewOpen(true)}
          title="View details"
        >
          <Eye className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setEditOpen(true)}
          title="Edit sub admin"
        >
          <Pencil className="size-4" />
        </Button>

        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <SubAdminDetailDialog admin={admin} open={viewOpen} onOpenChange={setViewOpen} />
      <SubAdminDialog mode="edit" open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
