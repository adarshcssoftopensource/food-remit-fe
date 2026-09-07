"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteAmountLimit } from "../hooks/use-delete-amount-limit";
import type { AmountLimitData } from "../types/amount-limit.types";
import { AmountLimitDialog } from "./amount-limit-dialog";

export function AmountLimitActionsCell({ data }: { data: AmountLimitData }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteAmountLimit();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(data.id);
      setDeleteOpen(false);
      successToast({
        title: "Amount limit deleted successfully",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setEditOpen(true)}
          title="Edit amount limit"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          onClick={() => setDeleteOpen(true)}
          disabled={deleteMutation.isPending}
          title="Delete amount limit"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <AmountLimitDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        limitId={data.id}
        initialValues={{
          countryName: data.countryName,
          amount: data.amount,
        }}
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Amount Limit"
        description={`Are you sure you want to delete the amount limit for ${data.countryName}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </>
  );
}
