"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { AddStoryForm } from "./components/add-story-form";

export function AddStoryPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Story"
        description="Fill in the details below to create and publish a new family support story."
        action={
          <Button variant="outline" onClick={() => router.push(ROUTES.STORIES.LIST)}>
            <ArrowLeft className="size-4" />
            Back to Stories
          </Button>
        }
      />

      <AddStoryForm />
    </div>
  );
}
