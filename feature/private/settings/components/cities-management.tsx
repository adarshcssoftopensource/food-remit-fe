"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CityData, MOCK_CITIES, MOCK_COUNTRIES_FOR_SELECT } from "@/constants/settings";
import { citiesColumns } from "../columns/cities-columns";
import AddCityDialog from "./add-city-dialog";

export function CitiesManagement() {
  const [cities, setCities] = useState<CityData[]>(MOCK_CITIES);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");

  const filteredCities =
    selectedCountry === "All"
      ? cities
      : cities.filter((city) => city.countryId === selectedCountry);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">Cities Management</h3>
              <p className="text-sm text-slate-500">Manage cities available in the platform.</p>
            </div>

            <span className="ml-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {filteredCities.length} Cities
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Select
              value={selectedCountry}
              onValueChange={(value) => setSelectedCountry(value || "All")}
            >
              <SelectTrigger className="h-10 w-56 rounded-lg border bg-white shadow-sm">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Countries</SelectItem>

                  {MOCK_COUNTRIES_FOR_SELECT.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.countryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <AddCityDialog />
          </div>
        </div>
        <CardContent className="p-6">
          <DataTable columns={citiesColumns} data={filteredCities} searchKey="cityName" />
        </CardContent>
      </Card>
    </div>
  );
}
