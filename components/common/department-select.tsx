"use client";

import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetDepartmentsDropdown } from "@/feature/private/catalogue-management/departments/hooks/use-get-departments-dropdown";
import { DepartmentDropdownItem } from "@/feature/private/catalogue-management/departments/types/department.types";
import { cn } from "@/lib/utils";

interface DepartmentSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  countryId?: string;
}

import { useProfile } from "@/components/providers/profile-provider";

function formatDepartmentLabel(raw?: string | null) {
  if (!raw) return "";
  return raw.replace(/([^\s])\(/g, "$1 (");
}

function getDepartmentLabel(dept: DepartmentDropdownItem, isStoreScoped?: boolean) {
  if (isStoreScoped) {
    if (dept.departmentName) return formatDepartmentLabel(dept.departmentName);
    const label = dept.displayName || dept.name || "";
    return formatDepartmentLabel(label.replace(/\s*\(.*?\)$/, ""));
  }

  if (dept.displayName || dept.name) {
    return formatDepartmentLabel(dept.displayName || dept.name);
  }
  const base = dept.departmentName || "";
  if (!base) return "";
  if (dept.scopeLabel) return `${base} (${dept.isGlobal ? "All Cities" : dept.cityName || "City"})`;
  return formatDepartmentLabel(base);
}

export function DepartmentSelect({
  value,
  onValueChange,
  placeholder = "Select department...",
  className,
  disabled,
  countryId,
}: DepartmentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { profile } = useProfile();
  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";

  const { data, isLoading } = useGetDepartmentsDropdown(countryId);
  const departments: DepartmentDropdownItem[] = Array.isArray(data?.data) ? data.data : [];

  const sortedDepartments = useMemo(() => {
    return [...departments].sort((a, b) =>
      getDepartmentLabel(a, isStoreScoped).localeCompare(
        getDepartmentLabel(b, isStoreScoped),
        undefined,
        {
          sensitivity: "base",
        },
      ),
    );
  }, [departments, isStoreScoped]);

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sortedDepartments;
    return sortedDepartments.filter((dept) =>
      getDepartmentLabel(dept, isStoreScoped).toLowerCase().includes(query),
    );
  }, [sortedDepartments, searchQuery, isStoreScoped]);

  const selectedLabel = useMemo(() => {
    const selected = departments.find((d) => d.id === value);
    return selected ? getDepartmentLabel(selected, isStoreScoped) : "";
  }, [departments, value, isStoreScoped]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSearchQuery("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isLoading}
            className={cn(
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 shadow-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950",
              !selectedLabel && "text-slate-500",
              className,
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading departments...
              </span>
            ) : (
              <span className="truncate">{selectedLabel || placeholder}</span>
            )}
            <ChevronDown className="size-4 shrink-0 text-slate-500" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        side="bottom"
        className="z-[200] w-[var(--anchor-width)] min-w-[min(28rem,calc(100vw-2rem))] gap-2 p-2"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search department..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <div
          className="max-h-60 overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading departments...
            </div>
          ) : filteredDepartments.length ? (
            filteredDepartments.map((dept) => {
              const label = getDepartmentLabel(dept, isStoreScoped);
              const isSelected = value === dept.id;
              return (
                <Button
                  key={dept.id}
                  variant="ghost"
                  onClick={() => {
                    onValueChange(dept.id);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <span className="flex-1 truncate">{label}</span>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No departments found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
