"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { WorldCountrySelect } from "@/components/common/world-country-select";
import { Button } from "@/components/ui/button";
import type { LandingMarket } from "../types";

type MarketsCountryPickerProps = {
  markets: LandingMarket[];
  onChange: (markets: LandingMarket[]) => void;
};

export function MarketsCountryPicker({ markets, onChange }: MarketsCountryPickerProps) {
  const [pickerKey, setPickerKey] = useState(0);

  return (
    <div className="space-y-3">
      <WorldCountrySelect
        key={pickerKey}
        value=""
        placeholder="Add market country"
        excludeNames={markets.map((m) => m.name)}
        onValueChange={(country) => {
          if (markets.some((m) => m.isoCode === country.isoCode || m.name === country.name)) {
            return;
          }
          onChange([
            ...markets,
            {
              name: country.name,
              isoCode: country.isoCode,
              flag: country.flag || "🌍",
            },
          ]);
          setPickerKey((k) => k + 1);
        }}
      />

      <div className="flex flex-wrap gap-2">
        {markets.map((market) => (
          <div
            key={market.isoCode || market.name}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm"
          >
            <span aria-hidden>{market.flag}</span>
            <span className="font-medium text-slate-800">{market.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5 rounded-full"
              onClick={() =>
                onChange(
                  markets.filter((m) => m.isoCode !== market.isoCode || m.name !== market.name),
                )
              }
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
        {markets.length === 0 ? (
          <p className="text-sm text-slate-500">No markets selected yet.</p>
        ) : null}
      </div>
    </div>
  );
}
