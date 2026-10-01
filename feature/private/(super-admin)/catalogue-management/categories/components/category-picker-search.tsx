"use client";

import { Loader2, Search, X } from "lucide-react";
import type React from "react";

export function PickerSearchInput({
  inputRef,
  search,
  onSearchChange,
  onKeyDown,
  activeOptionId,
  isSearching,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  search: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  activeOptionId: string | undefined;
  isSearching: boolean;
}) {
  return (
    <div className="px-5 pb-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search categories by name…"
          autoFocus
          aria-label="Search categories"
          role="combobox"
          aria-expanded
          aria-controls="category-picker-list"
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          maxLength={100}
          className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-11 pl-10 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center">
          {isSearching ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-slate-400" />
          ) : search ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
