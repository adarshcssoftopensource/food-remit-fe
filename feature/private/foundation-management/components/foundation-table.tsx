"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { type FoundationData } from "@/constants/foundation-management";
import { foundationColumns } from "../columns/foundation-columns";

interface FoundationTableProps {
  data: FoundationData[];
}

export function FoundationTable({ data }: FoundationTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-4">
        <DataTable columns={foundationColumns} data={[]} searchKey="foundationName" />
      </CardContent>
    </Card>
  );
}
