"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FaqData } from "@/constants/content-management";
import { getFaqColumns } from "./columns/faq-columns";
import { AddFaqDialog } from "./components/add-faq-dialog";
import { EditFaqDialog } from "./components/edit-faq-dialog";
import { useFaqManagement } from "./hooks/use-faq-management";

export function FaqManagementPage() {
  const { addFaq, faqs, updateFaq } = useFaqManagement();

  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const columns = useMemo(
    () =>
      getFaqColumns({
        onEdit: (faq) => {
          setEditingFaq(faq);
          setIsEditOpen(true);
        },
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Manage frequently asked questions shown to customers."
        action={<AddFaqDialog onSubmit={addFaq} />}
      />

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">FAQ&apos;s</CardTitle>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} found
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={faqs} searchKey="question" />
        </CardContent>
      </Card>

      <EditFaqDialog
        faq={editingFaq}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={updateFaq}
      />
    </div>
  );
}
