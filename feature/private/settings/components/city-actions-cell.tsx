"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteCity } from "../hooks/use-delete-city";
import type { CityData } from "../types/settings.types";
import { AddCityDialog } from "./add-city-dialog";

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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => setIsEditDialogOpen(true)}
          title="Edit city"
        >
          <Edit className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          title="Delete city"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

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
