export type AllStory = {
  serialNumber: number;
  storyName: string;
  foundationName: string;
  foundationEmail: string;
  foundationAddress: string;
  amountOrProductRequest: string;
  createdOn: string;
};

export type MyStory = {
  serialNumber: number;
  storyId: string;
  storyName: string;
  createdBy: string;
  amountOrProductRequest: string;
  createdOn: string;
};

export type DraftStory = {
  serialNumber: number;
  storyId: string;
  storyName: string;
  amountOrProductRequest: string;
  createdOn: string;
};

export const ALL_STORIES: AllStory[] = [];
export const MY_STORIES: MyStory[] = [];
export const DRAFT_STORIES: DraftStory[] = [];

export const STORY_TABS = [
  { value: "all", label: "All Stories" },
  { value: "mine", label: "My Stories" },
  { value: "drafts", label: "My Drafts" },
] as const;

export type StoryTab = (typeof STORY_TABS)[number]["value"];
