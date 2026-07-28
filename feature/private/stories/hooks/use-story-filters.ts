"use client";

import { useMemo, useState } from "react";
import {
  ALL_STORIES,
  DRAFT_STORIES,
  MY_STORIES,
  type StoryTab,
} from "@/constants/stories-management";

type DatedStory = { createdOn: string };

function filterByDate<T extends DatedStory>(data: T[], fromDate?: Date, toDate?: Date) {
  return data.filter((story) => {
    const createdOn = new Date(story.createdOn);
    if (fromDate && createdOn < fromDate) return false;
    if (toDate && createdOn > toDate) return false;
    return true;
  });
}

export function useStoryFilters() {
  const [activeTab, setActiveTab] = useState<StoryTab>("all");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const data = useMemo(
    () => ({
      all: filterByDate(ALL_STORIES, fromDate, toDate),
      mine: filterByDate(MY_STORIES, fromDate, toDate),
      drafts: filterByDate(DRAFT_STORIES, fromDate, toDate),
    }),
    [fromDate, toDate],
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return {
    activeTab,
    setActiveTab,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    data,
    hasFilters: Boolean(fromDate || toDate),
    clearFilters,
  };
}
