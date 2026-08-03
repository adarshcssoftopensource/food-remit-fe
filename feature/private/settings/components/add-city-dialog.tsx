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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CityData, MOCK_CITIES, MOCK_COUNTRIES_FOR_SELECT } from "@/constants/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CityFormValues, citySchema } from "../schema/city.schema";

function AddCityDialog() {
  const [cities, setCities] = useState<CityData[]>(MOCK_CITIES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: { countryId: "", cityName: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: CityFormValues) => {
    const country = MOCK_COUNTRIES_FOR_SELECT.find((c) => c.id === data.countryId);
    const newCity: CityData = {
      id: String(cities.length + 1),
      countryId: data.countryId,
      countryName: country?.countryName || "",
      cityName: data.cityName,
      addedOn: new Date().toISOString(),
    };

    setCities([...cities, newCity]);
    setIsAddDialogOpen(false);
    reset();
    successToast({
      title: "City Added",
      description: `"${data.cityName}" has been added to ${country?.countryName ?? "the list"}.`,
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) reset();
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger>
        <Button size="lg">
          <Plus size={20} />
          Add City
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Add New City</DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">Select country and enter city</p>
            </div>
          </div>
        </DialogHeader>

        <div className="-mx-6 h-px bg-slate-100" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="countryId" className="text-sm font-semibold">
                  Country <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={!!errors.countryId}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Countries</SelectLabel>
                      {MOCK_COUNTRIES_FOR_SELECT.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                <div className="relative">
                  <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    id="cityName"
                    placeholder="e.g. Manchester"
                    aria-invalid={!!errors.cityName}
                    className="h-11 pl-9"
                  />
                </div>
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="shadow-primary/20 flex-1 gap-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add City
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCityDialog;
