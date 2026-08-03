"use client";

import { BadgeDollarSign, DollarSign, Globe2 } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_PROCESSING_FEES } from "@/constants/settings";
import { processingFeeColumns } from "../columns/processing-fee-columns";

export function ProcessingFee() {
  const totalFees = MOCK_PROCESSING_FEES.length;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-700">
          Click the <span className="font-semibold">edit icon</span> next to any country to update
          its processing fee. Changes apply to future transactions only.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between border-b bg-slate-50/70 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl">
              <BadgeDollarSign className="text-primary h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Processing Fees</h2>
              <p className="text-sm text-slate-500">Configure processing fees for each country.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <Globe2 className="text-primary h-4 w-4" />
            <span className="text-sm font-medium text-slate-700">{totalFees} Countries</span>
          </div>
        </div>
        <CardContent className="p-4">
          <DataTable
            columns={processingFeeColumns}
            data={MOCK_PROCESSING_FEES}
            searchKey="countryName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
