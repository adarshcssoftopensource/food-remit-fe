"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FlashImageDialog } from "./components/edit-tutorial-dialog";
import { Badge } from "@/components/ui/badge";

import { useGetFlashImages, FlashImageData } from "./hooks/use-get-flash-images";
import { useDeleteFlashImage } from "./hooks/use-delete-flash-image";
import { NoDataFound } from "@/components/common/no-data-found";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { successToast } from "@/components/toaster";

export function TutorialManagement() {
  const { data, isLoading } = useGetFlashImages();

  const [editingTutorial, setEditingTutorial] = useState<FlashImageData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [deletingTutorial, setDeletingTutorial] = useState<FlashImageData | null>(null);
  const { mutateAsync: deleteFlashImage, isPending: isDeleting } = useDeleteFlashImage(
    deletingTutorial?.id || "",
  );
  const queryClient = useQueryClient();

  const handleEdit = (tutorial: FlashImageData) => {
    setEditingTutorial(tutorial);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTutorial(null);
  };
  const handleDelete = async () => {
    if (!deletingTutorial) return;
    try {
      await deleteFlashImage(undefined);
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FLASH_IMAGES });
      successToast({ title: "Flash image deleted successfully" });
      setDeletingTutorial(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Flash Images"
          description="Manage flash images and descriptions for the app onboarding experience."
        />
        <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Flash Image
        </Button>
      </div>

      {!isLoading && data?.data.length === 0 ? (
        <div className="flex min-h-100 flex-col items-center justify-center pt-10">
          <NoDataFound className="border-none bg-transparent shadow-none" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full p-8 text-center text-gray-500">
              Loading flash images...
            </div>
          )}
          {data?.data.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-lg"
            >
              <CardHeader>
                <div className="relative h-60 w-full">
                  <Image
                    src={tutorial.imageUrl}
                    alt={tutorial.title || "Tutorial Image"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={tutorial.isActive ? "default" : "destructive"}
                      className="shadow-sm"
                    >
                      {tutorial.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{tutorial.title}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{tutorial.description}</p>
              </CardContent>

              <CardFooter className="flex gap-3 border-t bg-slate-50/50 p-5">
                <Button
                  className="flex-1 gap-2"
                  variant="outline"
                  onClick={() => setDeletingTutorial(tutorial)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button className="flex-1 gap-2" onClick={() => handleEdit(tutorial)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isEditDialogOpen && (
        <FlashImageDialog
          key={editingTutorial?.id || "new-flash-image"}
          open={isEditDialogOpen}
          onOpenChange={handleCloseDialog}
          tutorial={editingTutorial}
        />
      )}

      {deletingTutorial && (
        <ConfirmationDialog
          open={!!deletingTutorial}
          onOpenChange={(open) => !open && setDeletingTutorial(null)}
          title="Delete Flash Image"
          description={`Are you sure you want to delete the flash image "${deletingTutorial.title || "Untitled"}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
