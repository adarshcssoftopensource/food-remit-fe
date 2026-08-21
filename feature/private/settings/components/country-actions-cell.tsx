"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteCountry } from "../hooks/use-delete-country";
import type { CountryData } from "../types/settings.types";
import { AddCountriesDialog } from "./add-countries-dialog";

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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => setIsEditDialogOpen(true)}
          title="Edit country"
        >
          <Edit className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          title="Delete country"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

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
