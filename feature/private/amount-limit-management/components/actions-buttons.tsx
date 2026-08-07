import { Button } from "@/components/ui/button";
import { AmountLimitData } from "@/constants/amount-limit-management";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { AmountLimitDialog } from "../components/amount-limit-dialog";

export function AmountLimitActionsCell({ data }: { data: AmountLimitData }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        onClick={() => setEditOpen(true)}
        title="Edit amount limit"
      >
        <Pencil className="size-4" />
      </Button>
      <AmountLimitDialog
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={{
          countryName: data.countryName,
          amount: data.amount,
        }}
      />
    </>
  );
}
