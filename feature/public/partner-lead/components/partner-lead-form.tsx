"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Globe,
  Mail,
  MessageSquare,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { CountrySelect } from "@/components/common/country-select";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/config/routes";
import {
  BUSINESS_TYPES,
  INVENTORY_MANAGEMENT_OPTIONS,
  NUMBER_OF_LOCATIONS_OPTIONS,
  STEPS,
  WORK_PREFERENCES_OPTIONS,
} from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import { useCreatePartnerLead } from "../hooks/create-partner";
import { PartnerLeadFormValues, partnerLeadSchema } from "../schema/partner-lead.schema";

interface PartnerLeadFormProps {
  onSuccess: (referenceNumber: string) => void;
  className?: string;
}

export function PartnerLeadForm({ onSuccess, className }: PartnerLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const { mutateAsync, isPending } = useCreatePartnerLead();

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PartnerLeadFormValues>({
    resolver: zodResolver(partnerLeadSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      locationsCount: "",
      country: "",
      businessCity: "",
      stateProvinceRegion: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      businessEmail: "",
      phoneNumber: "",
      workPreferences: [],
      inventoryManagement: "",
      websiteOrSocial: "",
      additionalNotes: "",
      agreeToContact: false,
    },
    mode: "onChange",
  });

  async function handleNextStep() {
    let fieldsToValidate: (keyof PartnerLeadFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["businessName", "businessType", "locationsCount", "country"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["firstName", "lastName", "businessEmail", "phoneNumber"];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "workPreferences",
        "inventoryManagement",
        "websiteOrSocial",
        "additionalNotes",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  }

  function handlePrevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function onSubmit(data: PartnerLeadFormValues) {
    try {
      const res = await mutateAsync(data);
      successToast({
        title: "Interest Registered",
        description: "Your partnership request has been submitted successfully.",
      });
      onSuccess(res?.data?.referenceNumber ?? "");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={cn(
        "relative z-10 w-full overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-black/30 sm:p-10",
        className,
      )}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
          <Clock className="size-3.5 text-emerald-600" />
          Takes less than 2 minutes
        </div>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Become a Food Remit Partner
        </h1>
        <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">
          Join the Food Remit marketplace and reach customers worldwide.
        </p>
      </div>

      <div className="mt-6 border-b border-slate-100 pb-6">
        <div className="relative flex">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-1 flex-col items-center">
                {step.id < STEPS.length && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-4.5 left-1/2 z-0 h-0.5 w-full",
                      isCompleted ? "bg-emerald-600" : "bg-slate-200",
                    )}
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (step.id < currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                    isCompleted && "bg-emerald-600 text-white shadow-sm",
                    isActive && "scale-110 bg-emerald-700 text-white ring-4 ring-emerald-100",
                    !isCompleted &&
                      !isActive &&
                      "border-2 border-slate-200 bg-white text-slate-400",
                  )}
                >
                  {isCompleted ? <Check className="size-4 stroke-3" /> : step.id}
                </button>
                <span
                  className={cn(
                    "mt-2 hidden text-[11px] font-semibold sm:block",
                    isActive
                      ? "text-emerald-700"
                      : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400",
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
        {/* STEP 1: Business Information */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="size-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 1: Business Information</h2>
                <p className="text-xs text-slate-400">Tell us about your business details</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="businessName"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <FieldLabel
                      htmlFor="businessName"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Business Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="businessName"
                      placeholder="Enter business name"
                      aria-invalid={!!errors.businessName}
                      className={cn(
                        "h-11 rounded-xl border-slate-200 bg-white text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                        errors.businessName && "border-red-400 bg-red-50/30",
                      )}
                    />
                    {errors.businessName && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.businessName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="businessType"
                      className="text-xs font-semibold text-slate-700"
                    >
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
                      <p className="text-xs font-medium text-red-500">
                        {errors.businessType.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="locationsCount"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="locationsCount"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Number of Locations <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={(val) => field.onChange(val ?? "")}>
                      <SelectTrigger
                        id="locationsCount"
                        className={cn(
                          "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                          errors.locationsCount && "border-red-400 bg-red-50/30",
                        )}
                      >
                        <SelectValue placeholder="Select location count" />
                      </SelectTrigger>
                      <SelectContent>
                        {NUMBER_OF_LOCATIONS_OPTIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.locationsCount && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.locationsCount.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="businessCity"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="businessCity"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Business City <span className="font-normal text-slate-400">(Optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="businessCity"
                      placeholder="Enter city"
                      className="h-11 rounded-xl border-slate-200 bg-white text-sm"
                    />
                  </div>
                )}
              />

              <Controller
                name="stateProvinceRegion"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="stateProvinceRegion"
                      className="text-xs font-semibold text-slate-700"
                    >
                      State / Province / Region{" "}
                      <span className="font-normal text-slate-400">(Optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="stateProvinceRegion"
                      placeholder="Enter state or region"
                      className="h-11 rounded-xl border-slate-200 bg-white text-sm"
                    />
                  </div>
                )}
              />

              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <FieldLabel htmlFor="country" className="text-xs font-semibold text-slate-700">
                      Country <span className="text-red-500">*</span>
                    </FieldLabel>
                    <CountrySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      id="country"
                      invalid={Boolean(errors.country)}
                      valueKey="name"
                    />
                    {errors.country && (
                      <p className="text-xs font-medium text-red-500">{errors.country.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Your Information */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="size-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 2: Contact Information</h2>
                <p className="text-xs text-slate-400">How should our team contact you?</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="firstName"
                      className="text-xs font-semibold text-slate-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter first name"
                      aria-invalid={!!errors.firstName}
                      className={cn(
                        "h-11 rounded-xl border-slate-200 bg-white text-sm",
                        errors.firstName && "border-red-400 bg-red-50/30",
                      )}
                    />
                    {errors.firstName && (
                      <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter last name"
                      aria-invalid={!!errors.lastName}
                      className={cn(
                        "h-11 rounded-xl border-slate-200 bg-white text-sm",
                        errors.lastName && "border-red-400 bg-red-50/30",
                      )}
                    />
                    {errors.lastName && (
                      <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <FieldLabel htmlFor="jobTitle" className="text-xs font-semibold text-slate-700">
                      Job Title / Role{" "}
                      <span className="font-normal text-slate-400">(Optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="jobTitle"
                      placeholder="e.g. Owner, Store Manager, Director of Operations"
                      className="h-11 rounded-xl border-slate-200 bg-white text-sm"
                    />
                  </div>
                )}
              />

              <Controller
                name="businessEmail"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="businessEmail"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Business Email <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        {...field}
                        id="businessEmail"
                        type="email"
                        placeholder="name@company.com"
                        aria-invalid={!!errors.businessEmail}
                        className={cn(
                          "h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm",
                          errors.businessEmail && "border-red-400 bg-red-50/30",
                        )}
                      />
                    </div>
                    {errors.businessEmail && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.businessEmail.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="phoneNumber"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </FieldLabel>
                    <PhoneInputComponent
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                      error={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Tell Us About Your Business */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="size-4 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Step 3: Tell Us About Your Business
                </h2>
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
                      <FieldLabel className="text-sm font-semibold text-slate-800">
                        How would you like to work with Food Remit?{" "}
                        <span className="font-normal text-slate-400">(Select all that apply)</span>
                      </FieldLabel>

                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {WORK_PREFERENCES_OPTIONS.map((opt) => {
                          const isChecked = values.includes(opt);
                          return (
                            <label
                              key={opt}
                              className={cn(
                                "flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 shadow-sm transition-all",
                                isChecked
                                  ? "border-emerald-500 bg-emerald-50 font-medium text-emerald-950 shadow-emerald-100"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30",
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
                    </div>
                  );
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
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
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
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
                      <MessageSquare className="pointer-events-none absolute top-2.5 left-3 z-10 size-3.5 text-slate-400" />
                      <Textarea
                        {...field}
                        id="additionalNotes"
                        placeholder="Tell us about your business goals..."
                        rows={3}
                        className="min-h-16 rounded-xl border-slate-200 bg-white pl-9 text-sm"
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 4: Review & Complete</h2>
                <p className="text-xs text-slate-400">Confirm your details and submit interest</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-medium text-slate-500">Business:</span>
                <span className="font-semibold text-slate-900">
                  {getValues("businessName") || "N/A"} ({getValues("businessType") || "N/A"})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-medium text-slate-500">Contact Person:</span>
                <span className="font-semibold text-slate-900">
                  {getValues("firstName")} {getValues("lastName")}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-medium text-slate-500">Email / Phone:</span>
                <span className="font-semibold text-slate-900">
                  {getValues("businessEmail")} | {getValues("phoneNumber")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Locations / Country:</span>
                <span className="font-semibold text-slate-900">
                  {getValues("locationsCount")} | {getValues("country")}
                </span>
              </div>
            </div>

            <Controller
              name="agreeToContact"
              control={control}
              render={({ field }) => (
                <div className="mt-2 flex flex-col gap-1.5">
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all",
                      field.value
                        ? "border-emerald-500 bg-emerald-50/40"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed font-medium text-slate-800">
                      I agree to be contacted by Food Remit regarding partnership opportunities and
                      onboarding.
                    </span>
                  </label>
                  {errors.agreeToContact && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.agreeToContact.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="h-11 rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="mr-1.5 size-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="h-11 rounded-xl bg-emerald-700 px-6 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
            >
              Next Step
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isPending}
              className="h-12 rounded-xl bg-emerald-700 px-7 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-800"
            >
              I’m Interested — Join Food Remit
            </Button>
          )}
        </div>
      </form>

      <div className="mt-3 text-center text-xs font-medium text-slate-500">
        Already started your registration?{" "}
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Continue Your Application
        </Link>
      </div>
    </div>
  );
}
