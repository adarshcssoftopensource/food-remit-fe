"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { TUTORIAL_DATA } from "@/constants/tutorial-management";
import { BookOpen, Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EditTutorialDialog } from "./components/edit-tutorial-dialog";

export function TutorialManagement() {
  const [editingTutorial, setEditingTutorial] = useState<(typeof TUTORIAL_DATA)[number] | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (tutorial: (typeof TUTORIAL_DATA)[number]) => {
    setEditingTutorial(tutorial);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTutorial(null);
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutorial Images"
        description="Manage tutorial images and descriptions for the app onboarding experience."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TUTORIAL_DATA.map((tutorial) => (
          <Card
            key={tutorial.id}
            className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-lg"
          >
            <CardHeader>
              <div className="relative h-60 w-full">
                <Image src={tutorial.image} alt={tutorial.title} fill className="object-cover" />
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

            <CardFooter className="border-t bg-slate-50/50 p-5">
              <Button className="w-full gap-2" onClick={() => handleEdit(tutorial)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingTutorial && (
        <EditTutorialDialog
          open={isEditDialogOpen}
          onOpenChange={handleCloseDialog}
          tutorial={editingTutorial}
        />
      )}
    </div>
  );
}
