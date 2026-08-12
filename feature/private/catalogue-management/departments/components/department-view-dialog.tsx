import { Building2, Calendar, MapPin, Tag } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DepartmentData } from "../types/department.types";
import { format } from "date-fns";

interface DepartmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: DepartmentData | null;
}

export function DepartmentViewDialog({
  open,
  onOpenChange,
  department,
}: DepartmentViewDialogProps) {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 p-0">
        <DialogHeader className="border-b border-slate-100 px-6 py-5 sm:px-7 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1">
              {department.departmentIcon ? (
                <Image
                  key={department.id}
                  src={department.departmentIcon}
                  alt={department.departmentName}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <Building2 className="h-7 w-7" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {department.departmentName}
              </DialogTitle>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    department.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span
                    className={`inline-block size-1.5 rounded-full ${
                      department.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {department.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 sm:px-7">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Country</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {department.country?.name || "-"}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Tag className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Department ID</span>
                </div>
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {department.id}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Created On</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {department.createdAt
                    ? format(new Date(department.createdAt), "MMM d, yyyy h:mm a")
                    : "-"}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Updated On</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {department.updatedAt
                    ? format(new Date(department.updatedAt), "MMM d, yyyy h:mm a")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
