"use client";

import { CountrySelect } from "@/components/common/country-select";
import { WorldCitySelect } from "@/components/common/world-city-select";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { resolveWorldCountryIsoCode } from "@/lib/world-locations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2, MapPin, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateCity } from "../hooks/use-create-city";
import { useGetCountriesDropdown } from "../hooks/use-get-countries-dropdown";
import { useUpdateCity } from "../hooks/use-update-city";
import { CityFormValues, citySchema } from "../schema/city.schema";
import type { CityData } from "../types/settings.types";

interface AddCityDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  city?: CityData | null;
  defaultCountryId?: string;
}

export function AddCityDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  city = null,
  defaultCountryId = "",
}: AddCityDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isDialogOpen = isControlled ? controlledOpen : internalOpen;
  const setIsDialogOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { countries } = useGetCountriesDropdown();
  const { mutateAsync: createCity, isPending: isCreating } = useCreateCity();
  const { mutateAsync: updateCity, isPending: isUpdating } = useUpdateCity(city?.id ?? "");

  const isPending = mode === "add" ? isCreating : isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      countryId: defaultCountryId || "",
      countryIsoCode: "",
      cityName: "",
    },
    mode: "onChange",
  });

  const selectedCountryId = watch("countryId");
  const selectedCountryIsoCode = watch("countryIsoCode");

  const resolvedCountryIso = useMemo(() => {
    if (selectedCountryIsoCode) return selectedCountryIsoCode;
    const selected = countries.find((item) => item.id === selectedCountryId);
    return resolveWorldCountryIsoCode(selected?.name, selected?.countryCode) ?? "";
  }, [countries, selectedCountryId, selectedCountryIsoCode]);

  useEffect(() => {
    if (isDialogOpen) {
      if (mode === "edit" && city) {
        const matchedCountry = countries.find((item) => item.id === city.countryId);
        reset({
          countryId: city.countryId || "",
          countryIsoCode:
            resolveWorldCountryIsoCode(
              matchedCountry?.name ?? city.countryName,
              matchedCountry?.countryCode ?? city.countryCode,
            ) ?? "",
          cityName: city.cityName || city.name || "",
        });
      } else {
        const matchedCountry = countries.find((item) => item.id === defaultCountryId);
        reset({
          countryId: defaultCountryId || "",
          countryIsoCode:
            resolveWorldCountryIsoCode(matchedCountry?.name, matchedCountry?.countryCode) ?? "",
          cityName: "",
        });
      }
    }
  }, [isDialogOpen, mode, city, defaultCountryId, countries, reset]);

  const onSubmit = async (data: CityFormValues) => {
    try {
      if (mode === "edit" && city) {
        const response = await updateCity({
          countryId: data.countryId,
          name: data.cityName.trim(),
        });
        handleDialogOpenChange(false);
        successToast({
          title: "City Updated",
          description: response?.message || `"${data.cityName}" has been updated successfully.`,
        });
      } else {
        const response = await createCity({
          countryId: data.countryId,
          name: data.cityName.trim(),
        });
        handleDialogOpenChange(false);
        successToast({
          title: "City Added",
          description: response?.message || `"${data.cityName}" has been added successfully.`,
        });
      }
    } catch {}
  };

  const handleDialogOpenChange = (openState: boolean) => {
    setIsDialogOpen(openState);
    if (!openState) reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      {mode === "add" && !isControlled && (
        <DialogTrigger
          render={
            <Button size="lg">
              <Plus size={20} />
              Add City
            </Button>
          }
        />
      )}

      <DialogContent>
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              {mode === "add" ? (
                <MapPin className="h-5 w-5 text-emerald-600" />
              ) : (
                <Edit3 className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {mode === "add" ? "Add New City" : "Edit City"}
              </DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                {mode === "add"
                  ? "Select country and choose a city from its list"
                  : "Update the city information below"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="countryId" className="text-sm font-semibold">
                  Country Name <span className="text-red-500">*</span>
                </FieldLabel>
                <CountrySelect
                  id="countryId"
                  value={field.value}
                  onValueChange={(value, countryOption) => {
                    field.onChange(value);
                    setValue(
                      "countryIsoCode",
                      resolveWorldCountryIsoCode(countryOption?.name, countryOption?.countryCode) ??
                        "",
                      { shouldValidate: true },
                    );
                    setValue("cityName", "", { shouldValidate: true });
                  }}
                  valueKey="id"
                  placeholder="Select a country"
                  invalid={!!errors.countryId}
                  disabled={isPending}
                />
                {errors.countryId && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                    {errors.countryId.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="cityName"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="cityName" className="text-sm font-semibold">
                  City Name <span className="text-red-500">*</span>
                </FieldLabel>
                <WorldCitySelect
                  id="cityName"
                  countryIsoCode={resolvedCountryIso}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search and select city"
                  invalid={!!errors.cityName}
                  disabled={isPending}
                />
                {errors.cityName && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                    {errors.cityName.message}
                  </p>
                )}
              </div>
            )}
          />

          <DialogFooter className="gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              className="flex-1"
              disabled={isPending}
            >
              <X size={20} />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="shadow-primary/20 flex-1 gap-2 shadow-md"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                <>
                  <Plus className="h-4 w-4" />
                  Add City
                </>
              ) : (
                <>
                  <Edit3 size={18} />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCityDialog;
