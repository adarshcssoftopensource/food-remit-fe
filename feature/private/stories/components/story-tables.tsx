"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { type AllStory, type DraftStory, type MyStory } from "@/constants/stories-management";
import { allStoriesColumns } from "../columns/all-stories-columns";
import { draftStoriesColumns } from "../columns/draft-stories-columns";
import { myStoriesColumns } from "../columns/my-stories-columns";

export function AllStoriesTable({ data }: { data: AllStory[] }) {
  return <DataTable columns={allStoriesColumns} data={data} searchKey="storyName" />;
}
export function MyStoriesTable({ data }: { data: MyStory[] }) {
  return <DataTable columns={myStoriesColumns} data={data} searchKey="storyName" />;
}
export function DraftStoriesTable({ data }: { data: DraftStory[] }) {
  return <DataTable columns={draftStoriesColumns} data={data} searchKey="storyName" />;
}
