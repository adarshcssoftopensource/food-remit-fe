"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { errorToast, successToast } from "@/components/toaster";
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
    } catch (error: any) {
      errorToast({
        title: "Failed to delete country",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Could not delete this country. Make sure no cities or departments depend on it.",
      });
    }
  };

  const displayName = country.countryName || country.name || "this country";

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={() => setIsEditDialogOpen(true)}
          title="Edit country"
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          title="Delete country"
        >
          <Trash2 className="h-4 w-4" />
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
