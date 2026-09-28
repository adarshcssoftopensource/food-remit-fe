"use client";

import { PageHeader } from "@/components/common/page-header";
import { FeedbackList } from "./components/feedback-list";

export default function FeedbackManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Management"
        description="View and manage user feedback and reviews."
      />
      <FeedbackList />
    </div>
  );
}
