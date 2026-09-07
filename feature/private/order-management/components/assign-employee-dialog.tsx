"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetEmployees } from "@/feature/private/employee-management/hooks/use-get-employees";
import { getInitials } from "@/lib/get-initials";
import {
  CheckCircle,
  ClipboardList,
  Loader2,
  Search,
  UserCheck,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/lib/debounce";
import { OrderData } from "../types/order.types";
import { useAssignOrder } from "@/feature/private/employee-management/hooks/use-assign-order";

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData;
}

export function AssignEmployeeDialog({ open, onOpenChange, order }: AssignEmployeeDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: employees, isLoading: loadingEmployees } = useGetEmployees({
    page: 1,
    limit: 50,
    search: debouncedSearch || undefined,
    status: "ACTIVE",
  });

  const { mutateAsync: assignOrder, isPending: isAssigning } = useAssignOrder(
    selectedEmployeeId || "",
  );

  const handleAssign = async () => {
    if (!selectedEmployeeId) return;
    try {
      await assignOrder(order.id);
      onOpenChange(false);
      setSelectedEmployeeId(null);
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-0 shadow-2xl sm:max-w-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="relative px-8 pb-10">
          <DialogHeader className="mb-7 space-y-4 text-center">
            <div className="bg-primary/10 text-primary ring-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ring-1">
              <UserRoundPlus className="h-8 w-8" strokeWidth={2.2} />
            </div>

            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Assign to Employee
            </DialogTitle>

            <DialogDescription className="mx-auto max-w-90 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Choose an employee to handle this order and keep the delivery process moving smoothly.
            </DialogDescription>

            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <ClipboardList className="text-primary h-4 w-4" />
              <span>Order</span>
              <span className="font-bold text-slate-900 dark:text-white">
                #{order.refrenceNumber || order.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
          </DialogHeader>

          <div className="mb-8 space-y-5">
            <div className="group relative">
              <Input
                placeholder="Search employees..."
                className="h-14 rounded-2xl border-slate-200 bg-white pl-12 text-base shadow-sm group-hover:border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-emerald-500" />
            </div>

            <ScrollArea className="h-80 rounded-2xl border border-slate-100 bg-slate-50/50 p-2 shadow-inner dark:border-slate-800 dark:bg-slate-900/30">
              {loadingEmployees ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-emerald-500" />
                </div>
              ) : employees && employees.length > 0 ? (
                <div className="flex flex-col gap-2 px-2">
                  {employees.map((emp: any) => {
                    const isSelected = selectedEmployeeId === emp.id;
                    const fullName = `${emp.firstName} ${emp.lastName}`.trim() || "N/A";
                    const initials = getInitials(fullName);
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        className={`flex w-full items-center gap-4 rounded-xl p-3 transition-all duration-200 ${
                          isSelected
                            ? "border-2 border-emerald-500 bg-white shadow-md ring-4 ring-emerald-50 dark:bg-slate-900 dark:ring-emerald-950/30"
                            : "border-2 border-transparent bg-white shadow-sm hover:border-emerald-100 hover:shadow-md dark:bg-slate-900 dark:hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-[0.8rem] text-lg font-bold text-white shadow-sm transition-colors ${
                            isSelected
                              ? "bg-linear-to-br from-emerald-500 to-teal-600"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                            {fullName}
                          </p>
                          <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                            {emp.email}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <CheckCircle size={20} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center gap-2 text-slate-500">
                  <UserCheck className="size-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">No employees found.</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="h-14 flex-1 rounded-[1.25rem] border-2 border-slate-200 text-base font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-14 flex-[1.5] rounded-[1.25rem] bg-linear-to-r from-emerald-500 to-teal-600 text-base font-bold text-white hover:from-emerald-600 hover:to-teal-700"
              onClick={handleAssign}
              disabled={isAssigning || !selectedEmployeeId}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 size-5" />
                  Confirm Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
