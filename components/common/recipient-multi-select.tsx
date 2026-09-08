"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

export type RecipientOption = {
  id: string;
  name: string;
  email?: string | null;
  meta?: string;
};

type RecipientMultiSelectProps = {
  options: RecipientOption[];
  value: RecipientOption[];
  onChange: (value: RecipientOption[]) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  placeholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function RecipientMultiSelect({
  options,
  value,
  onChange,
  onSearchChange,
  searchValue,
  placeholder = "Search and select recipients…",
  emptyText = "No recipients found.",
  isLoading = false,
  disabled = false,
  className,
}: RecipientMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const search = searchValue ?? internalSearch;
  const debouncedSearch = useDebounce(search, 300);

  const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  const handleSearch = (next: string) => {
    if (searchValue === undefined) setInternalSearch(next);
    onSearchChange?.(next);
  };

  const toggle = (option: RecipientOption) => {
    if (selectedIds.has(option.id)) {
      onChange(value.filter((v) => v.id !== option.id));
      return;
    }
    onChange([...value, option]);
  };

  const remove = (id: string) => {
    onChange(value.filter((v) => v.id !== id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "h-12 w-full justify-between rounded-xl border-gray-200 bg-gray-50 px-3 font-normal",
                "hover:bg-white",
              )}
            >
              <span className="truncate text-left text-sm text-slate-600">
                {value.length > 0
                  ? `${value.length} recipient${value.length > 1 ? "s" : ""} selected`
                  : placeholder}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          }
        />

        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-[320px] p-0 sm:w-105"
        >
          <Command shouldFilter={false} className="rounded-xl border-0">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
              <Search className="size-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type name, email, or phone…"
                className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <CommandList className="max-h-64">
              <CommandEmpty className="py-6 text-sm text-slate-400">
                {isLoading
                  ? "Searching…"
                  : debouncedSearch
                    ? emptyText
                    : "Start typing to search recipients."}
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const selected = selectedIds.has(option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => toggle(option)}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5"
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                          selected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {selected && <Check className="size-3" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{option.name}</p>
                        {option.email && (
                          <p className="truncate text-xs text-slate-500">{option.email}</p>
                        )}
                        {option.meta && (
                          <p className="truncate text-[11px] text-slate-400">{option.meta}</p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="max-w-full gap-1 rounded-lg py-1 pr-1 pl-2.5"
            >
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                className="rounded-md p-0.5 hover:bg-slate-200"
                onClick={() => remove(item.id)}
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
