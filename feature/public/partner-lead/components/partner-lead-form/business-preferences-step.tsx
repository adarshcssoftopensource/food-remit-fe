import { CheckCircle2, Clock, Globe, Store, XCircle } from "lucide-react";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  INVENTORY_MANAGEMENT_OPTIONS,
  ORDER_PROCESSING_TIME_OPTIONS,
  WORK_PREFERENCES_OPTIONS,
} from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";

type BusinessPreferencesStepProps = Pick<
  PartnerLeadFormState,
  | "control"
  | "errors"
  | "setValue"
  | "clearErrors"
  | "sameDayDelivery"
  | "hasOtherWorkPreference"
  | "watch"
>;

export function BusinessPreferencesStep({
  control,
  errors,
  setValue,
  clearErrors,
  sameDayDelivery,
  hasOtherWorkPreference,
  watch,
}: BusinessPreferencesStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Store className="size-4 text-emerald-600" />
        <div>
          <h2 className="text-sm font-bold text-slate-900">Step 3: Tell Us About Your Business</h2>
          <p className="text-[11px] text-slate-400">
            Share preferences and management details (Optional)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Controller
          name="workPreferences"
          control={control}
          render={({ field }) => {
            const values = field.value || [];
            const toggleValue = (option: string) => {
              if (values.includes(option)) {
                field.onChange(values.filter((v) => v !== option));
              } else {
                field.onChange([...values, option]);
              }
            };
            return (
              <div className="flex flex-col gap-2.5">
                <FieldLabel className="block text-sm font-semibold text-slate-800">
                  How would you like to work with Food Remit?{" "}
                  <span className="font-normal text-slate-400">(Select all that apply)</span>
                </FieldLabel>

                <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
                  {WORK_PREFERENCES_OPTIONS.map((opt) => {
                    const isChecked = values.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={cn(
                          "flex min-h-16 items-center gap-3 rounded-xl border px-3 py-2.5 shadow-sm transition-colors",
                          isChecked
                            ? "cursor-pointer border-emerald-500 bg-emerald-50 font-medium text-emerald-950 shadow-emerald-100"
                            : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30",
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleValue(opt)}
                          className="size-4 rounded"
                        />
                        <span className="text-xs leading-5 font-medium">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {hasOtherWorkPreference && (
                  <Controller
                    name="otherWorkPreference"
                    control={control}
                    render={({ field }) => (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <FieldLabel
                          htmlFor="otherWorkPreference"
                          className="text-xs font-semibold text-slate-700"
                        >
                          Please Specify Other Preference <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="otherWorkPreference"
                          placeholder="e.g. Cross-border wholesale, Catering services, Custom logistics"
                          aria-invalid={!!errors.otherWorkPreference}
                          className={cn(
                            "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                            errors.otherWorkPreference && "border-red-400 bg-red-50/30",
                          )}
                        />
                        {errors.otherWorkPreference && (
                          <p className="text-xs font-medium text-red-500">
                            {errors.otherWorkPreference.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}
              </div>
            );
          }}
        />

        {/* Same-Day Delivery & Order Processing Time */}
        <SameDayDeliverySection
          control={control}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
          sameDayDelivery={sameDayDelivery}
        />

        {/* Product Screening Questions */}
        <ProductScreeningSection control={control} setValue={setValue} watch={watch} />

        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <Controller
            name="inventoryManagement"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  htmlFor="inventoryManagement"
                  className="text-sm font-semibold text-slate-800"
                >
                  Inventory Management{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={(val) => field.onChange(val ?? "")}>
                  <SelectTrigger
                    id="inventoryManagement"
                    className="h-11! w-full rounded-xl border-slate-200 bg-white text-sm"
                  >
                    <SelectValue placeholder="Select inventory method" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVENTORY_MANAGEMENT_OPTIONS.map((inv) => (
                      <SelectItem key={inv} value={inv}>
                        {inv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            name="websiteOrSocial"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  htmlFor="websiteOrSocial"
                  className="text-sm font-semibold text-slate-800"
                >
                  Website or Social Page{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </FieldLabel>
                <div className="relative">
                  <Globe className="pointer-events-none absolute top-1/2 left-3 z-10 size-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    id="websiteOrSocial"
                    placeholder="https://yourbusiness.com"
                    className="h-11 rounded-xl border-slate-200 bg-white pl-9 text-sm"
                  />
                </div>
                {errors.websiteOrSocial && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.websiteOrSocial.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <Controller
          name="additionalNotes"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <FieldLabel
                htmlFor="additionalNotes"
                className="text-sm font-semibold text-slate-800"
              >
                Anything else to know?{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </FieldLabel>
              <div className="relative">
                <Textarea
                  {...field}
                  id="additionalNotes"
                  placeholder="Tell us about your business goals..."
                  rows={4}
                  className="h-24 max-h-24 min-h-24 resize-none overflow-y-auto rounded-xl border-slate-200 bg-white px-4 py-3 text-sm leading-6 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

type SameDayDeliverySectionProps = Pick<
  PartnerLeadFormState,
  "control" | "errors" | "setValue" | "clearErrors" | "sameDayDelivery"
>;

function SameDayDeliverySection({
  control,
  errors,
  setValue,
  clearErrors,
  sameDayDelivery,
}: SameDayDeliverySectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel className="text-sm font-semibold text-slate-800">
            Does your Store offer same-day delivery? <span className="text-red-500">*</span>
          </FieldLabel>
          <p className="text-xs text-slate-500">
            Let customers know if their orders can be prepared and delivered or picked up on the
            same day.
          </p>

          <div className="grid max-w-sm grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setValue("sameDayDelivery", true, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                sameDayDelivery === true
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <CheckCircle2
                className={cn(
                  "size-4",
                  sameDayDelivery === true ? "text-emerald-600" : "text-slate-400",
                )}
              />
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("sameDayDelivery", false, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                setValue("orderProcessingTime", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("orderProcessingTime");
              }}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                sameDayDelivery === false
                  ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <XCircle
                className={cn(
                  "size-4",
                  sameDayDelivery === false ? "text-white" : "text-slate-400",
                )}
              />
              No
            </button>
          </div>
        </div>

        {sameDayDelivery && (
          <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-200/60 pt-4">
            <FieldLabel
              htmlFor="orderProcessingTime"
              className="text-sm font-semibold text-slate-800"
            >
              Estimated Order Processing Time <span className="text-red-500">*</span>
            </FieldLabel>
            <p className="text-xs text-slate-500">
              Required preparation time before an order is ready for fulfillment.
            </p>
            <Controller
              name="orderProcessingTime"
              control={control}
              render={({ field }) => (
                <div className="max-w-md pt-1">
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val ?? "");
                      clearErrors("orderProcessingTime");
                    }}
                  >
                    <SelectTrigger
                      id="orderProcessingTime"
                      aria-invalid={!!errors.orderProcessingTime}
                      className={cn(
                        "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                        errors.orderProcessingTime && "border-red-400 bg-red-50/30",
                      )}
                    >
                      <SelectValue placeholder="Select processing time" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_PROCESSING_TIME_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-emerald-600" />
                            <span>{opt}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.orderProcessingTime && (
              <p className="text-xs font-medium text-red-500">
                {errors.orderProcessingTime.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type ProductScreeningSectionProps = Pick<PartnerLeadFormState, "control" | "setValue" | "watch">;

function ProductScreeningSection({ setValue, watch }: ProductScreeningSectionProps) {
  const perishableProducts = watch("perishableProducts") ?? false;
  const refrigeratedProducts = watch("refrigeratedProducts") ?? false;
  const frozenProducts = watch("frozenProducts") ?? false;

  const questions = [
    {
      name: "perishableProducts" as const,
      label: "Do you carry perishable products?",
      value: perishableProducts,
    },
    {
      name: "refrigeratedProducts" as const,
      label: "Do you carry refrigerated products?",
      value: refrigeratedProducts,
    },
    {
      name: "frozenProducts" as const,
      label: "Do you carry frozen products?",
      value: frozenProducts,
    },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5">
      <div>
        <FieldLabel className="text-sm font-semibold text-slate-800">
          Product Screening Questions <span className="text-red-500">*</span>
        </FieldLabel>
        <p className="text-xs text-slate-500">
          Store - level product questions determine which inspection sections apply.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div
            key={q.name}
            className="flex flex-col gap-3 border-t border-slate-200/60 pt-4 first:border-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-medium text-slate-700">{q.label}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setValue(q.name, true, { shouldValidate: true, shouldDirty: true })}
                className={cn(
                  "flex w-24 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                  q.value === true
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <CheckCircle2
                  className={cn("size-4", q.value === true ? "text-emerald-600" : "text-slate-400")}
                />
                Yes
              </button>
              <button
                type="button"
                onClick={() => setValue(q.name, false, { shouldValidate: true, shouldDirty: true })}
                className={cn(
                  "flex w-24 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                  q.value === false
                    ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <XCircle
                  className={cn("size-4", q.value === false ? "text-white" : "text-slate-400")}
                />
                No
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
