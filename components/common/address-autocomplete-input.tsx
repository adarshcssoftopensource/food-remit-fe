"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import type { PlaceDetails, PlacePrediction } from "@/hooks/use-google-places";
import { useGooglePlaces } from "@/hooks/use-google-places";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type AddressFormat = "street" | "full";

export type AddressAutocompleteInputProps = {
  value?: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  addressFormat?: AddressFormat;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
};

export function AddressAutocompleteInput({
  value = "",
  onChange,
  onPlaceSelect,
  addressFormat = "street",
  placeholder = "Enter Address",
  id,
  disabled = false,
  invalid = false,
  className,
}: AddressAutocompleteInputProps) {
  const reactId = useId();
  const inputId = id ?? reactId;

  const { isReady, error: placesError, getSuggestions, getPlaceDetails } = useGooglePlaces();

  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suppressFetchRef = useRef(false);
  const userEditedRef = useRef(false);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (placesError) {
      console.error("[AddressAutocomplete]", placesError);
    }
  }, [placesError]);

  const query = debouncedValue.trim();
  const visibleSuggestions = query ? suggestions : [];
  const showDropdown = isOpen && visibleSuggestions.length > 0;

  useEffect(() => {
    if (!isReady || !query) return;

    // Prefill on edit/open must not auto-open suggestions.
    if (!userEditedRef.current) return;

    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    let cancelled = false;

    const fetchSuggestions = async () => {
      await Promise.resolve();
      if (cancelled) return;

      setIsFetching(true);
      try {
        const results = await getSuggestions(query);
        if (cancelled) return;
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setIsOpen(false);
        }
      } finally {
        setIsFetching(false);
      }
    };

    void fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [query, isReady, getSuggestions]);

  useEffect(() => {
    // Kept for backward compatibility if needed, but Popover handles outside clicks
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    userEditedRef.current = true;
    suppressFetchRef.current = false;
    onChange(e.target.value);
  }

  function handleClear() {
    userEditedRef.current = false;
    suppressFetchRef.current = false;
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  async function handleSelect(prediction: PlacePrediction) {
    userEditedRef.current = false;
    suppressFetchRef.current = true;
    setSuggestions([]);
    setIsOpen(false);

    const details = await getPlaceDetails(prediction.placeId);

    if (addressFormat === "street") {
      const street = details?.streetAddress?.trim() || details?.name?.trim() || prediction.mainText;
      onChange(street);
    } else {
      onChange(details?.formattedAddress?.trim() || prediction.description);
    }

    if (details && onPlaceSelect) {
      onPlaceSelect(details);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <Popover
      open={showDropdown}
      onOpenChange={(open) => setIsOpen(open && visibleSuggestions.length > 0)}
    >
      <PopoverTrigger
        render={<div ref={wrapperRef} className={cn("relative w-full", className)} />}
      >
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-slate-400">
            {query && isFetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MapPin className="size-4" />
            )}
          </span>

          <Input
            ref={inputRef}
            id={inputId}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={disabled}
            aria-invalid={invalid}
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (userEditedRef.current && visibleSuggestions.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className={cn(
              "h-11 rounded-xl border-slate-200 bg-slate-50/80 pr-8 pl-9 text-sm",
              "focus-visible:ring-primary/10 transition-all duration-200 focus-visible:bg-white",
              invalid && "border-red-400 bg-red-50/30 focus-visible:ring-red-100",
            )}
          />

          {value && !disabled ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear address"
              onClick={handleClear}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            isReady &&
            !(query && isFetching) && (
              <span className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-slate-300">
                <Search className="size-3.5" />
              </span>
            )
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="z-50 w-[var(--radix-popover-trigger-width)] border-none bg-transparent p-0 shadow-none"
      >
        <div
          className={cn(
            "w-full overflow-hidden rounded-xl border border-slate-100 bg-white",
            "shadow-lg shadow-slate-200/60",
            "animate-in fade-in-0 slide-in-from-top-1 duration-150",
          )}
        >
          <div className="flex items-center justify-end border-b border-slate-50 px-3 py-1.5">
            <span className="text-[10px] font-medium tracking-wide text-slate-300 uppercase">
              powered by Google
            </span>
          </div>

          <Command shouldFilter={false} className="rounded-none! border-none! bg-transparent!">
            <CommandList className="max-h-65 py-1">
              <CommandEmpty className="py-4 text-sm text-slate-400">No results found.</CommandEmpty>

              <CommandGroup>
                {visibleSuggestions.map((prediction, index) => {
                  const matchQuery = value.toLowerCase();
                  const mainLower = prediction.mainText.toLowerCase();
                  const matchStart = mainLower.indexOf(matchQuery);

                  return (
                    <CommandItem
                      key={prediction.placeId}
                      value={`${prediction.placeId}-${index}`}
                      onSelect={() => void handleSelect(prediction)}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 aria-selected:bg-slate-50"
                    >
                      <span className="aria-selected:bg-primary/10 aria-selected:text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors">
                        <MapPin className="size-3.5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm leading-snug text-slate-800">
                          {matchStart >= 0 && matchQuery.length > 0 ? (
                            <>
                              {prediction.mainText.slice(0, matchStart)}
                              <span className="font-semibold text-slate-900">
                                {prediction.mainText.slice(
                                  matchStart,
                                  matchStart + matchQuery.length,
                                )}
                              </span>
                              {prediction.mainText.slice(matchStart + matchQuery.length)}
                            </>
                          ) : (
                            <span className="font-semibold">{prediction.mainText}</span>
                          )}
                        </span>

                        {prediction.secondaryText && (
                          <span className="block truncate text-xs leading-tight text-slate-400">
                            {prediction.secondaryText}
                          </span>
                        )}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
}
