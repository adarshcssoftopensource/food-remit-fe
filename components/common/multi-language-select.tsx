import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import isoLangs from "@cospired/i18n-iso-languages";
import enLocale from "@cospired/i18n-iso-languages/langs/en.json";
import * as countryLanguage from "country-language";
import { Country } from "country-state-city";

isoLangs.registerLocale(enLocale);

import { languageToCountry } from "@/constants/language-country-map";

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

interface MultiLanguageSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
  countryName?: string;
}

export function MultiLanguageSelect({
  selected = [],
  onChange,
  placeholder = "Select languages...",
  className,
  invalid,
  countryName,
}: MultiLanguageSelectProps) {
  const [open, setOpen] = React.useState(false);

  const languages = React.useMemo(() => {
    const allLangs = isoLangs.getNames("en");
    let codes = Object.keys(allLangs);

    if (countryName) {
      const countries = Country.getAllCountries();
      const countryObj = countries.find((c) => c.name === countryName);
      if (countryObj) {
        try {
          const countryLangs = countryLanguage.getCountry(countryObj.isoCode).languages;
          if (countryLangs && countryLangs.length > 0) {
            const countryIsoCodes = countryLangs.map((l: any) => l.iso639_1);
            const filteredCodes = codes.filter((code) => countryIsoCodes.includes(code));
            // Only filter if there are matching languages found, else show all
            if (filteredCodes.length > 0) {
              codes = filteredCodes;
            }
          }
        } catch (e) {
          // If country not found or API fails, fallback to all codes
        }
      }
    }

    return codes
      .map((code) => {
        const countryCode = languageToCountry[code];
        const flag = countryCode ? getFlagEmoji(countryCode) : "🌐";
        const langName = allLangs[code];
        return {
          value: langName,
          label: `${flag} ${langName}`,
          name: langName,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countryName]);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-auto min-h-11 w-full justify-between rounded-xl border-slate-200 px-3 py-2 font-normal hover:bg-transparent",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {selected.length === 0 && (
                <span className="text-sm text-slate-500">{placeholder}</span>
              )}
              {selected.map((item) => {
                const langObj = languages.find((l) => l.value === item);
                const displayLabel = langObj ? langObj.label : item;

                return (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-normal hover:bg-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    {displayLabel}
                    <X className="h-3 w-3 cursor-pointer text-slate-500 hover:text-slate-900" />
                  </Badge>
                );
              })}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent
        className="flex w-(--anchor-width) flex-col overflow-hidden rounded-xl border-slate-200 p-0 shadow-xl"
        align="start"
      >
        <div className="border-b border-slate-100 p-2">
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-base outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 md:text-sm"
            placeholder="Search language..."
            onChange={(e) => {
              const val = e.target.value.toLowerCase();
              const items = document.querySelectorAll(".lang-item");
              let found = false;
              items.forEach((item) => {
                const label = item.getAttribute("data-label")?.toLowerCase() || "";
                if (label.includes(val)) {
                  (item as HTMLElement).style.display = "flex";
                  found = true;
                } else {
                  (item as HTMLElement).style.display = "none";
                }
              });
              const empty = document.getElementById("lang-empty");
              if (empty) empty.style.display = found ? "none" : "block";
            }}
          />
        </div>
        <div className="custom-scrollbar max-h-62.5 overflow-y-auto p-1">
          <div id="lang-empty" className="hidden py-6 text-center text-sm text-slate-500">
            No language found.
          </div>
          <div className="flex flex-col">
            {languages.map((language) => (
              <button
                type="button"
                key={language.value}
                data-label={language.label}
                className="lang-item flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                onClick={() => {
                  if (selected.includes(language.value)) {
                    onChange(selected.filter((item) => item !== language.value));
                  } else {
                    onChange([...selected, language.value]);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 shrink-0 text-emerald-600",
                    selected.includes(language.value) ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">{language.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
