"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table/data-table";
import { foundationColumns } from "../columns/foundation-columns";
import { type FoundationData } from "@/constants/foundation-management";

interface FoundationTableProps {
  data: FoundationData[];
}

export function FoundationTable({ data }: FoundationTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-4">
        <DataTable columns={foundationColumns} data={data} searchKey="foundationName" />
      </CardContent>
    </Card>
  );
}
