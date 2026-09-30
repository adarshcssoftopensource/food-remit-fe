"use client";

import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type ItemOptionRow = {
  id?: string;
  optionName: string;
  price: string;
  quantityPerPack?: string;
  netWeight?: string;
  weightUnit?: string;
  stockQuantity?: string;
  upcCode?: string;
};

type ItemOptionsFieldProps = {
  value: ItemOptionRow[];
  onChange: (rows: ItemOptionRow[]) => void;
  invalid?: boolean;
  className?: string;
};

function createOptionId() {
  return `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ItemOptionsField({ value, onChange, invalid, className }: ItemOptionsFieldProps) {
  const rows = Array.isArray(value) ? value : [];
  const [draftName, setDraftName] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftQty, setDraftQty] = useState("");
  const [draftWeight, setDraftWeight] = useState("");
  const [draftUnit, setDraftUnit] = useState("");

  const handleAdd = () => {
    if (!draftName || !draftPrice) {
      toast.error("Variant Name and Price are required.");
      return;
    }

    const duplicate = rows.some((row) => row.optionName.toLowerCase() === draftName.toLowerCase());
    if (duplicate) {
      toast.error("A variant with this name already exists.");
      return;
    }

    onChange([
      ...rows,
      {
        id: createOptionId(),
        optionName: draftName,
        price: draftPrice,
        quantityPerPack: draftQty || undefined,
        netWeight: draftWeight || undefined,
        weightUnit: draftUnit || undefined,
      },
    ]);

    setDraftName("");
    setDraftPrice("");
    setDraftQty("");
    setDraftWeight("");
    setDraftUnit("");
  };

  const updateField = (id: string | undefined, field: keyof ItemOptionRow, val: string) => {
    if (!id) return;
    onChange(rows.map((row) => (row.id === id ? { ...row, [field]: val } : row)));
  };

  const removeRow = (id: string | undefined) => {
    if (!id) return;
    onChange(rows.filter((row) => row.id !== id));
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid items-end gap-3 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold">Variant Name *</label>
          <Input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="e.g. 500g Pack"
            className="h-11"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Price *</label>
          <Input
            value={draftPrice}
            onChange={(e) => setDraftPrice(e.target.value)}
            type="number"
            placeholder="0.00"
            className="h-11"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Qty/Pack</label>
          <Input
            value={draftQty}
            onChange={(e) => setDraftQty(e.target.value)}
            type="number"
            placeholder="Optional"
            className="h-11"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Weight & Unit</label>
          <div className="flex">
            <Input
              value={draftWeight}
              onChange={(e) => setDraftWeight(e.target.value)}
              type="number"
              placeholder="0"
              className="h-11 w-2/3 rounded-r-none border-r-0"
            />
            <Input
              value={draftUnit}
              onChange={(e) => setDraftUnit(e.target.value)}
              placeholder="kg"
              className="h-11 w-1/3 rounded-l-none px-2 text-center"
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="h-11 rounded-xl font-semibold sm:col-span-1"
        >
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
          invalid && "border-destructive ring-destructive/20 ring-3",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/50">
              <TableHead className="w-[30%]">Variant Name</TableHead>
              <TableHead className="w-[20%]">Price</TableHead>
              <TableHead className="w-[15%]">Qty/Pack</TableHead>
              <TableHead className="w-[25%]">Net Weight</TableHead>
              <TableHead className="w-[10%] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-sm text-slate-400">
                  No variants added. The default base item settings will be used.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.optionName}
                      onChange={(e) => updateField(row.id, "optionName", e.target.value)}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.price}
                      onChange={(e) => updateField(row.id, "price", e.target.value)}
                      className="h-9 font-semibold text-emerald-600"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.quantityPerPack || ""}
                      onChange={(e) => updateField(row.id, "quantityPerPack", e.target.value)}
                      className="h-9"
                      placeholder="-"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Input
                        type="number"
                        value={row.netWeight || ""}
                        onChange={(e) => updateField(row.id, "netWeight", e.target.value)}
                        className="h-9 w-2/3 rounded-r-none border-r-0"
                        placeholder="-"
                      />
                      <Input
                        value={row.weightUnit || ""}
                        onChange={(e) => updateField(row.id, "weightUnit", e.target.value)}
                        className="h-9 w-1/3 rounded-l-none px-1 text-center"
                        placeholder="-"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
