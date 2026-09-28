"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { successToast } from "@/components/toaster";
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

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "Edit Limit",
      icon: <Pencil className="size-4" />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Delete Limit",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: deleteMutation.isPending,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-1.5">
        <DataTableRowActions items={actionItems} />
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
