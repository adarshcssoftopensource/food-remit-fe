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
        className="w-75 rounded-xl border-slate-200 p-0 shadow-xl sm:w-100"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="custom-scrollbar max-h-62.5 overflow-y-auto">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.label}
                  onSelect={(currentValue) => {
                    const actualValue =
                      languages.find((l) => l.label.toLowerCase() === currentValue.toLowerCase())
                        ?.value || currentValue;

                    if (selected.includes(actualValue)) {
                      onChange(selected.filter((item) => item !== actualValue));
                    } else {
                      onChange([...selected, actualValue]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-emerald-600",
                      selected.includes(language.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
