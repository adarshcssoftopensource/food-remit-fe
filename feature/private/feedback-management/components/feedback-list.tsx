"use client";

import { MessageSquare } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FEEDBACK } from "@/constants/feedback";
import { feedbackColumns } from "../columns/feedback-columns";

export function FeedbackList() {
  const filteredFeedback = MOCK_FEEDBACK;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b bg-linear-to-r from-slate-50 to-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <MessageSquare className="text-primary h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-semibold">FEEDBACK MANAGEMENT</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable columns={feedbackColumns} data={filteredFeedback} searchKey="subject" />
      </CardContent>
    </Card>
  );
}
