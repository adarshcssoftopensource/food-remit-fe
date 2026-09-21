"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteCountry } from "../hooks/use-delete-country";
import type { CountryData } from "../types/settings.types";
import { AddCountriesDialog } from "./add-countries-dialog";

import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

export function CountryActionsCell({ country }: { country: CountryData }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutateAsync: deleteCountry, isPending: isDeleting } = useDeleteCountry(country.id);

  const handleDelete = async () => {
    try {
      const response = await deleteCountry();
      setIsDeleteDialogOpen(false);
      successToast({
        title: "Country Deleted",
        description:
          response?.message ||
          `"${country.countryName || country.name}" has been deleted successfully.`,
      });
    } catch {}
  };

  const displayName = country.countryName || country.name || "this country";

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "Edit Country",
      icon: <Edit className="size-4" />,
      onClick: () => setIsEditDialogOpen(true),
    },
    {
      label: "Delete Country",
      icon: <Trash2 className="size-4" />,
      onClick: () => setIsDeleteDialogOpen(true),
      variant: "destructive",
      disabled: isDeleting,
    },
  ];

  return (
    <>
      <DataTableRowActions items={actionItems} />

      {isEditDialogOpen && (
        <AddCountriesDialog
          mode="edit"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          country={country}
        />
      )}

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Country"
        description={`Are you sure you want to delete "${displayName}"? This action cannot be undone.`}
        confirmLabel="Delete Country"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
