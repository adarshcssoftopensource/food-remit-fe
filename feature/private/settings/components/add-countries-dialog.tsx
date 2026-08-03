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
import { CountryData, MOCK_COUNTRIES } from "@/constants/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CountryFormValues, countrySchema } from "../schema/country.schema";

function AddCountriesDialog() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>(MOCK_COUNTRIES);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: { countryName: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: CountryFormValues) => {
    const newCountry: CountryData = {
      id: String(countries.length + 1),
      countryName: data.countryName,
      addedOn: new Date().toISOString(),
    };

    setCountries([...countries, newCountry]);
    setIsAddDialogOpen(false);
    reset();
    successToast({
      title: "Country Added",
      description: `"${data.countryName}" has been added successfully.`,
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
          Add Country
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Add New Country</DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">Fill in the details below</p>
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
                <div className="relative mt-2">
                  <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    id="countryName"
                    placeholder="e.g. United Kingdom"
                    aria-invalid={!!errors.countryName}
                    className="h-11 pl-9"
                  />
                </div>
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
            >
              <X size={20} />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
              <Plus size={20} />
              Add Country
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCountriesDialog;
