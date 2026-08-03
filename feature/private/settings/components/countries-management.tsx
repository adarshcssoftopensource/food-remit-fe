"use client";

import { Database, Globe2 } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { CountryData, MOCK_COUNTRIES } from "@/constants/settings";
import { countriesColumns } from "../columns/countries-columns";
import AddCountriesDialog from "./add-countries-dialog";

export function CountriesManagement() {
  const [countries, setCountries] = useState<CountryData[]>(MOCK_COUNTRIES);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <Globe2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">Countries Management</h3>
              <p className="text-sm text-slate-500">
                Manage the list of available countries on the platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">{countries.length}</span>
              <span className="text-sm text-blue-600">Countries</span>
            </div>
            <AddCountriesDialog />
          </div>
        </div>
        <CardContent className="p-6">
          <DataTable columns={countriesColumns} data={countries} searchKey="countryName" />
        </CardContent>
      </Card>
    </div>
  );
}
