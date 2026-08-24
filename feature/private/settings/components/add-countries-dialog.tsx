"use client";

import { WorldCountrySelect } from "@/components/common/world-country-select";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, FlagIcon, Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateCountry } from "../hooks/use-create-country";
import { useGetCountriesDropdown } from "../hooks/use-get-countries-dropdown";
import { useUpdateCountry } from "../hooks/use-update-country";
import { CountryFormValues, countrySchema } from "../schema/country.schema";
import type { CountryData } from "../types/settings.types";
import { findWorldCountryByName, toCreateCountryPayload } from "@/lib/world-locations";

interface AddCountriesDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  country?: CountryData | null;
}

export function AddCountriesDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  country = null,
}: AddCountriesDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isDialogOpen = isControlled ? controlledOpen : internalOpen;
  const setIsDialogOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { countries: existingCountries } = useGetCountriesDropdown();
  const { mutateAsync: createCountry, isPending: isCreating } = useCreateCountry();
  const { mutateAsync: updateCountry, isPending: isUpdating } = useUpdateCountry(country?.id ?? "");

  const isPending = mode === "add" ? isCreating : isUpdating;

  const excludedCountryNames = useMemo(() => {
    if (mode === "edit" && country) {
      return existingCountries.filter((item) => item.id !== country.id).map((item) => item.name);
    }
    return existingCountries.map((item) => item.name);
  }, [existingCountries, mode, country]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: { countryName: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (mode === "edit" && country) {
        reset({
          countryName: country.countryName || country.name || "",
        });
      } else {
        reset({
          countryName: "",
        });
      }
    }
  }, [isDialogOpen, mode, country, reset]);

  const onSubmit = async (data: CountryFormValues) => {
    const selectedCountry = findWorldCountryByName(data.countryName);
    if (!selectedCountry) return;

    const payload = toCreateCountryPayload(selectedCountry);

    try {
      if (mode === "edit" && country) {
        const response = await updateCountry(payload);
        handleDialogOpenChange(false);
        successToast({
          title: "Country Updated",
          description:
            response?.message || `"${selectedCountry.name}" has been updated successfully.`,
        });
      } else {
        const response = await createCountry(payload);
        handleDialogOpenChange(false);
        successToast({
          title: "Country Added",
          description:
            response?.message || `"${selectedCountry.name}" has been added successfully.`,
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
              Add Country
            </Button>
          }
        />
      )}

      <DialogContent>
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              {mode === "add" ? (
                <FlagIcon className="h-5 w-5 text-emerald-600" />
              ) : (
                <Edit3 className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {mode === "add" ? "Add New Country" : "Edit Country"}
              </DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                {mode === "add"
                  ? "Search and select a country from the global list"
                  : "Update the country selection below"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <Controller
            name="countryName"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="countryName" className="text-sm font-semibold">
                  Country Name <span className="text-red-500">*</span>
                </FieldLabel>
                <WorldCountrySelect
                  id="countryName"
                  value={field.value}
                  onValueChange={(selected) => field.onChange(selected.name)}
                  placeholder="Search and select country"
                  invalid={!!errors.countryName}
                  disabled={isPending}
                  excludeNames={excludedCountryNames}
                />
                {errors.countryName && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                    {errors.countryName.message}
                  </p>
                )}
              </div>
            )}
          />

          <DialogFooter className="gap-2 pt-2">
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
            <Button type="submit" disabled={isPending} className="flex-1 gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                <>
                  <Plus size={20} />
                  Add Country
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

export default AddCountriesDialog;
