"use client";

import { format, isBefore, startOfToday } from "date-fns";
import { CalendarClock, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { Basket } from "../../types/basket.types";

interface ScheduleInactiveDialogProps {
  basket: Basket | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (at: string | null) => Promise<unknown>;
  isPending?: boolean;
}

function initialState(basket: Basket | null) {
  const at = basket?.scheduledInactiveAt ? new Date(basket.scheduledInactiveAt) : null;
  return { date: at ?? undefined, time: at ? format(at, "HH:mm") : "23:59" };
}

/** Pick a future date & time when an Active basket becomes Inactive */
export function ScheduleInactiveDialog({
  basket,
  onOpenChange,
  onSubmit,
  isPending,
}: ScheduleInactiveDialogProps) {
  const [state, setState] = useState(() => initialState(basket));
  const [error, setError] = useState<string | null>(null);
  const [lastBasketId, setLastBasketId] = useState(basket?.id);
  if (basket?.id !== lastBasketId) {
    setLastBasketId(basket?.id);
    setState(initialState(basket));
    setError(null);
  }

  const submit = async () => {
    if (!state.date) return setError("Choose a date.");
    const [h = 0, m = 0] = state.time.split(":").map(Number);
    const at = new Date(state.date);
    at.setHours(h, m, 0, 0);
    if (isBefore(at, new Date())) return setError("Choose a date and time in the future.");
    await onSubmit(at.toISOString());
  };

  return (
    <Dialog open={Boolean(basket)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="text-primary size-5" /> Schedule Inactive
          </DialogTitle>
          <DialogDescription>
            &ldquo;{basket?.name}&rdquo; stays visible to customers until this date and time, then
            becomes Inactive automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_120px]">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Date</p>
            <DatePicker
              date={state.date}
              setDate={(date) => {
                setState((s) => ({ ...s, date }));
                setError(null);
              }}
              minDate={startOfToday()}
              placeholder="Select date"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Time</p>
            <Input
              type="time"
              value={state.time}
              onChange={(e) => {
                setState((s) => ({ ...s, time: e.target.value }));
                setError(null);
              }}
              className="h-10 rounded-xl"
            />
          </div>
          {error && <p className="text-destructive text-xs font-medium sm:col-span-2">{error}</p>}
        </div>
        <DialogFooter className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          {basket?.scheduledInactiveAt && (
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => onSubmit(null)}
              className="mr-auto h-10 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Cancel schedule
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button type="button" className="h-10 rounded-xl" disabled={isPending} onClick={submit}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
