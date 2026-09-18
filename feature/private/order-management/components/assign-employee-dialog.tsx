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
  orders: OrderData[];
}

export function AssignEmployeeDialog({ open, onOpenChange, orders }: AssignEmployeeDialogProps) {
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
      await assignOrder(orders.map((o) => o.id));
      onOpenChange(false);
      setSelectedEmployeeId(null);
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-lg sm:max-w-lg dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-full max-h-[85vh] flex-col">
          <DialogHeader className="border-b border-slate-100 p-6 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary ring-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1">
                <UserRoundPlus className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Assign to Employee
                </DialogTitle>
                <DialogDescription className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Select an employee to handle {orders.length === 1 ? "this order" : "these orders"}
                  .
                </DialogDescription>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  <ClipboardList className="text-primary h-3 w-3 shrink-0" />
                  <span className="font-semibold">
                    #{o.refrenceNumber || o.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
              ))}
              {orders.length > 5 && (
                <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/60">
                  +{orders.length - 5} more
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 p-6 pb-2">
            <div className="group relative">
              <Input
                placeholder="Search employees..."
                className="h-10 rounded-lg border-slate-200 bg-slate-50/50 pl-9 text-sm shadow-sm group-hover:border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-emerald-500" />
            </div>

            <ScrollArea className="h-64 rounded-lg border border-slate-200 bg-slate-50/50 p-1.5 dark:border-slate-800 dark:bg-slate-900/30">
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
                        className={`flex w-full items-center gap-3 rounded-md p-2 transition-all duration-200 ${
                          isSelected
                            ? "border border-emerald-500 bg-emerald-50/50 shadow-sm dark:border-emerald-600 dark:bg-emerald-950/20"
                            : "border border-transparent bg-white shadow-sm hover:border-emerald-100 dark:bg-slate-900 dark:hover:border-slate-700"
                        }`}
                      >
                        {emp.image ? (
                          <div
                            className={`relative flex size-9 shrink-0 overflow-hidden rounded-md shadow-sm ${isSelected ? "ring-2 ring-emerald-500 ring-offset-1" : ""}`}
                          >
                            <img
                              src={emp.image}
                              alt={fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white shadow-sm transition-colors ${
                              isSelected ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                            }`}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {fullName}
                          </p>
                          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                            {emp.email}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <CheckCircle size={14} />
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

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-6 pt-4 dark:border-slate-800 dark:bg-slate-900/20">
            <Button
              variant="outline"
              className="h-10 rounded-md border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-10 rounded-md bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-600"
              onClick={handleAssign}
              disabled={isAssigning || !selectedEmployeeId}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>Confirm Assignment</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
