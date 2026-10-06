import { Building2, ChevronDown, Store } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { StoreScheduleEditor } from "@/components/common/store-schedule-editor";
import { parseTimeToMinutes } from "@/components/common/store-schedule-utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { BusinessDetailsFields } from "./business-details-fields";
import { RegionalSetupFields } from "./regional-setup-fields";

type BusinessInfoStepProps = Pick<
  PartnerLeadFormState,
  | "control"
  | "errors"
  | "setValue"
  | "clearErrors"
  | "trigger"
  | "watch"
  | "isOtherBusinessType"
  | "selectedCountryName"
  | "selectedCountryIsoCode"
  | "selectedStateIsoCode"
>;

export function BusinessInfoStep({
  control,
  errors,
  setValue,
  clearErrors,
  trigger,
  watch,
  isOtherBusinessType,
  selectedCountryName,
  selectedCountryIsoCode,
  selectedStateIsoCode,
}: BusinessInfoStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Building2 className="size-5 text-emerald-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 1: Business Information</h2>
          <p className="text-xs text-slate-400">Tell us about your business details</p>
        </div>
      </div>

      <BusinessDetailsFields
        control={control}
        errors={errors}
        isOtherBusinessType={isOtherBusinessType}
        watch={watch}
        setValue={setValue}
      />

      {/* Geographical Section Container */}
      <RegionalSetupFields
        control={control}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        selectedCountryName={selectedCountryName}
        selectedCountryIsoCode={selectedCountryIsoCode}
        selectedStateIsoCode={selectedStateIsoCode}
      />

      <StoreScheduleSection
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
        trigger={trigger}
        watch={watch}
      />
    </div>
  );
}

type StoreScheduleSectionProps = Pick<
  PartnerLeadFormState,
  "errors" | "setValue" | "clearErrors" | "trigger" | "watch"
>;

function StoreScheduleSection({
  errors,
  setValue,
  clearErrors,
  trigger,
  watch,
}: StoreScheduleSectionProps) {
  return (
    <Collapsible
      defaultOpen={true}
      className="group/collapsible mt-3 flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 sm:p-5"
    >
      <CollapsibleTrigger className="-mx-2 flex w-full cursor-pointer items-center justify-between rounded-lg border-b border-slate-200/60 px-2 pb-2 transition-colors hover:bg-slate-100/50">
        <div className="flex items-center gap-2">
          <Store className="size-4.5 text-emerald-600" />
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900">Store Schedule & Hours</h3>
            <p className="text-xs text-slate-500">
              Configure opening days and business operating hours for each day of the week.
            </p>
          </div>
        </div>
        <ChevronDown className="size-5 text-slate-400 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <StoreScheduleEditor
          daysOpen={watch("locations.0.daysOpen") || []}
          hoursOfOperation={watch("locations.0.hoursOfOperation") || ""}
          dailySchedule={watch("locations.0.dailySchedule" as any)}
          onChange={({ daysOpen, hoursOfOperation, dailySchedule }) => {
            setValue("locations.0.dailySchedule" as any, dailySchedule);
            setValue("locations.0.daysOpen" as const, daysOpen);
            setValue("locations.0.hoursOfOperation" as const, hoursOfOperation);

            const isComplete =
              dailySchedule.filter((d) => d.isOpen).length > 0 &&
              dailySchedule
                .filter((d) => d.isOpen)
                .every(
                  (d) =>
                    d.openTime === "24H" || // 24-hour days are always complete
                    (d.openTime &&
                      d.closeTime &&
                      d.openTime !== "00:00" &&
                      d.closeTime !== "00:00" &&
                      parseTimeToMinutes(d.closeTime, true) >=
                        parseTimeToMinutes(d.openTime, false)),
                );

            if (isComplete) {
              clearErrors([
                "locations",
                "locations.0",
                "locations.0.hoursOfOperation",
                "locations.0.daysOpen",
              ] as any);
              trigger("locations");
            }
          }}
          error={
            errors.locations?.[0]?.daysOpen?.message ||
            errors.locations?.[0]?.hoursOfOperation?.message ||
            (errors.locations as any)?.[0]?.message
          }
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
