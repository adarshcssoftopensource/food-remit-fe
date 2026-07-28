"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { STORY_TABS, type StoryTab } from "@/constants/stories-management";
import { StoryFilters } from "./components/story-filters";
import { AllStoriesTable, DraftStoriesTable, MyStoriesTable } from "./components/story-tables";
import { useStoryFilters } from "./hooks/use-story-filters";

function StoriesCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="border-b px-6 py-5">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

export default function StoriesManagement() {
  const router = useRouter();
  const filters = useStoryFilters();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stories Management"
        description="Review, manage, and create platform stories."
        action={
          <Button onClick={() => router.push(ROUTES.STORIES.ADD)}>
            <Plus /> Add Story
          </Button>
        }
      />

      <Tabs
        value={filters.activeTab}
        onValueChange={(value) => value && filters.setActiveTab(value as StoryTab)}
        className="gap-6"
      >
        <TabsList className="bg-muted grid h-11 w-full grid-cols-3 rounded-lg p-1">
          {STORY_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground rounded-md"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card className="overflow-hidden rounded-xl border-t p-4">
          <StoryFilters
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            hasFilters={filters.hasFilters}
            onFromDateChange={filters.setFromDate}
            onToDateChange={filters.setToDate}
            onClearFilters={filters.clearFilters}
          />
        </Card>
        <TabsContent value="all" className="m-0">
          <StoriesCard title="All Stories">
            <AllStoriesTable data={filters.data.all} />
          </StoriesCard>
        </TabsContent>
        <TabsContent value="mine" className="m-0">
          <StoriesCard title="My Stories">
            <MyStoriesTable data={filters.data.mine} />
          </StoriesCard>
        </TabsContent>
        <TabsContent value="drafts" className="m-0">
          <StoriesCard title="My Drafts">
            <DraftStoriesTable data={filters.data.drafts} />
          </StoriesCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
