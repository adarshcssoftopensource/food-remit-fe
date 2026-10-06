import { Controller } from "react-hook-form";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { StoreImageField } from "./store-image-field";

type BusinessDetailsFieldsProps = Pick<
  PartnerLeadFormState,
  "control" | "errors" | "isOtherBusinessType" | "watch" | "setValue"
>;

export function BusinessDetailsFields({
  control,
  errors,
  isOtherBusinessType,
  watch,
  setValue,
}: BusinessDetailsFieldsProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
      <Controller
        name="businessName"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="businessName" className="text-xs font-semibold text-slate-700">
              Business Name <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="businessName"
              placeholder="Enter business name"
              aria-invalid={!!errors.businessName}
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                errors.businessName && "border-red-400 bg-red-50/30",
              )}
            />
            {errors.businessName && (
              <p className="text-xs font-medium text-red-500">{errors.businessName.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="businessType"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="businessType" className="text-xs font-semibold text-slate-700">
              Business Type <span className="text-red-500">*</span>
            </FieldLabel>
            <Select value={field.value} onValueChange={(val) => field.onChange(val ?? "")}>
              <SelectTrigger
                id="businessType"
                className={cn(
                  "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                  errors.businessType && "border-red-400 bg-red-50/30",
                )}
              >
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-xs font-medium text-red-500">{errors.businessType.message}</p>
            )}
          </div>
        )}
      />

      {isOtherBusinessType && (
        <Controller
          name="otherBusinessType"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel
                htmlFor="otherBusinessType"
                className="text-xs font-semibold text-slate-700"
              >
                Please Specify Business Type <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="otherBusinessType"
                placeholder="e.g. Food Truck, Specialty Bakery, Cloud Kitchen"
                aria-invalid={!!errors.otherBusinessType}
                className={cn(
                  "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                  errors.otherBusinessType && "border-red-400 bg-red-50/30",
                )}
              />
              {errors.otherBusinessType && (
                <p className="text-xs font-medium text-red-500">
                  {errors.otherBusinessType.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      <StoreImageField control={control} watch={watch} setValue={setValue} />

      <HasBusinessAccountField control={control} />
    </div>
  );
}

function HasBusinessAccountField({ control }: Pick<PartnerLeadFormState, "control">) {
  return (
    <Controller
      name="hasBusinessAccount"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <FieldLabel className="block text-xs font-semibold text-slate-700">
            Does your Business have a Business Account?{" "}
            <span className="font-normal text-slate-400">(Bank Account - Optional)</span>
          </FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors",
                field.value === true
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <input
                type="radio"
                name="hasBusinessAccount"
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                className="sr-only"
              />
              <span>Yes</span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors",
                field.value === false
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <input
                type="radio"
                name="hasBusinessAccount"
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                className="sr-only"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      )}
    />
  );
}
