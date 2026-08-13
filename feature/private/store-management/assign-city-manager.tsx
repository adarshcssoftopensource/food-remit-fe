"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, UserCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_SELECT_OPTIONS } from "@/constants/store-management";
import {
  assignCityManagerSchema,
  type AssignCityManagerFormValues,
} from "./schema/assign-city-manager.schema";

const CITY_MANAGERS_BY_COUNTRY: Record<string, Array<{ id: string; name: string }>> = {
  "United States": [
    { id: "CM001", name: "James Wilson" },
    { id: "CM002", name: "Sarah Johnson" },
    { id: "CM003", name: "Michael Brown" },
  ],
  Canada: [
    { id: "CM004", name: "Emily Davis" },
    { id: "CM005", name: "Robert Taylor" },
  ],
  "United Kingdom": [
    { id: "CM006", name: "Charlotte Moore" },
    { id: "CM007", name: "Oliver Jackson" },
  ],
  Australia: [{ id: "CM008", name: "Liam Anderson" }],
  Germany: [{ id: "CM009", name: "Hans Müller" }],
  France: [{ id: "CM010", name: "Sophie Laurent" }],
  India: [
    { id: "CM011", name: "Arjun Sharma" },
    { id: "CM012", name: "Priya Patel" },
  ],
};

export function AssignCityManagerToStore() {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignCityManagerFormValues>({
    resolver: zodResolver(assignCityManagerSchema),
    defaultValues: {
      country: "",
      cityManagerId: "",
    },
    mode: "onSubmit",
  });

  const selectedCountry = watch("country");
  const availableManagers = selectedCountry
    ? (CITY_MANAGERS_BY_COUNTRY[selectedCountry] ?? [])
    : [];

  const onSubmit = async (data: AssignCityManagerFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Assigned City Manager:", data);
    successToast({ title: "City Manager assigned to stores successfully!" });
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign City-Manager To Stores"
        description="Assign a city manager to oversee stores in a specific country."
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
              <UserCheck className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Assign City Manager
              </CardTitle>
              <p className="text-sm text-slate-500">
                Select a country and a city manager to assign
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Globe className="size-3.5 text-slate-400" />
                Select Country
                <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                    }}
                  >
                    <SelectTrigger
                      id="assign-country"
                      className="h-12! w-full rounded-xl border-slate-200 bg-slate-50"
                    >
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {COUNTRY_SELECT_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-xs font-medium text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <UserCheck className="size-3.5 text-slate-400" />
                Select City Manager
                <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cityManagerId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger
                      id="assign-city-manager"
                      className="h-12! w-full rounded-xl border-slate-200 bg-slate-50"
                    >
                      <SelectValue
                        placeholder={
                          !selectedCountry
                            ? "Select a country first"
                            : availableManagers.length === 0
                              ? "No City Manager in this country"
                              : "Select a city manager"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableManagers.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No City Manager in this country
                          </SelectItem>
                        ) : (
                          availableManagers.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cityManagerId && (
                <p className="text-xs font-medium text-red-500">{errors.cityManagerId.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="h-12 w-full rounded-xl font-semibold shadow-sm sm:w-auto sm:min-w-[160px]"
              >
                Assign
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
