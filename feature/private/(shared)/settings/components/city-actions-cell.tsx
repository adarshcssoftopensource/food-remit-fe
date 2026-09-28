"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteCity } from "../hooks/use-delete-city";
import type { CityData } from "../types/settings.types";
import { AddCityDialog } from "./add-city-dialog";

import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

export function CityActionsCell({ city }: { city: CityData }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutateAsync: deleteCity, isPending: isDeleting } = useDeleteCity(city.id);

  const handleDelete = async () => {
    try {
      const response = await deleteCity();
      setIsDeleteDialogOpen(false);
      successToast({
        description:
          response?.message || `"${city.cityName || city.name}" has been deleted successfully.`,
      });
    } catch {}
  };

  const displayName = city.cityName || city.name || "this city";

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "Edit City",
      icon: <Edit className="size-4" />,
      onClick: () => setIsEditDialogOpen(true),
    },
    {
      label: "Delete City",
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
        <AddCityDialog
          mode="edit"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          city={city}
        />
      )}

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete City"
        description={`Are you sure you want to delete "${displayName}"? This action cannot be undone.`}
        confirmLabel="Delete City"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
