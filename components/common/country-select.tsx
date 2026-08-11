"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ISO_COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );

const countryNameFormatter = new Intl.DisplayNames(["en"], { type: "region" });

export const COUNTRIES = ISO_COUNTRY_CODES.map((code) => ({
  code,
  name: countryNameFormatter.of(code) ?? code,
})).sort((first, second) => first.name.localeCompare(second.name));

function countryFlag(code: string) {
  return String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0)));
}

type CountrySelectProps = {
  className?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function CountrySelect({
  className,
  disabled,
  id,
  invalid,
  onValueChange,
  placeholder = "Select country",
  value,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCountry = COUNTRIES.find((country) => country.name === value);
  const filteredCountries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    if (!normalizedQuery) return COUNTRIES;

    return COUNTRIES.filter(
      (country) =>
        country.name.toLocaleLowerCase().includes(normalizedQuery) ||
        country.code.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid}
            className={cn(
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 hover:bg-white",
              !selectedCountry && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selectedCountry && (
                <span aria-hidden="true" className="text-base leading-none">
                  {countryFlag(selectedCountry.code)}
                </span>
              )}
              <span className="truncate">{selectedCountry?.name ?? placeholder}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-slate-500" />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-[min(32rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search country or code..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>
        <div className="max-h-64 overflow-y-auto rounded-md">
          {filteredCountries.length ? (
            filteredCountries.map((country) => {
              const isSelected = country.name === value;
              return (
                <Button
                  key={country.code}
                  variant={"ghost"}
                  onClick={() => {
                    onValueChange(country.name);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {countryFlag(country.code)}
                  </span>
                  <span className="flex-1">{country.name}</span>
                  {isSelected && <Check className="size-4" />}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No country found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
