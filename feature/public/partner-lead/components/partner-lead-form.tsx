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
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [draftRestored, setDraftRestored] = useState(false);
  const DRAFT_KEY = "food_remit_partner_lead_draft";

  const { mutateAsync, isPending } = useCreatePartnerLead();

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm<PartnerLeadFormValues>({
    resolver: zodResolver(partnerLeadSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      otherBusinessType: "",
      locationsCount: "",
      hasBusinessAccount: undefined,
      country: "",
      businessCity: "",
      stateProvinceRegion: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      businessEmail: "",
      phoneNumber: "",
      workPreferences: [],
      otherWorkPreference: "",
      inventoryManagement: "",
      websiteOrSocial: "",
      additionalNotes: "",
      agreeToContact: false,
    },
    mode: "onChange",
  });

  const locationsCount = watch("locationsCount");
  const businessType = watch("businessType");
  const isOtherBusinessType = businessType === "Other";
  const isSingleLocation = locationsCount === "1 Location";
  const multipleLocationsOption = "Add multiple store locations";
  const workPreferences = watch("workPreferences") || [];
  const hasOtherWorkPreference = workPreferences.includes("Other");

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.values) {
          reset(parsed.values);
          if (parsed.step && parsed.step > 1 && parsed.step <= STEPS.length) {
            setCurrentStep(parsed.step);
          }
          setDraftRestored(true);
        }
      }
    } catch {
      // ignore storage access errors
    }
  }, [reset]);

  // Persist draft to sessionStorage on form value or step change
  const formValues = watch();
  useEffect(() => {
    try {
      const hasData = Object.values(formValues).some((v) =>
        Array.isArray(v) ? v.length > 0 : Boolean(v),
      );
      if (hasData && !isSubmitSuccessful) {
        sessionStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            step: currentStep,
            values: formValues,
          }),
        );
      }
    } catch {
      // ignore storage access errors
    }
  }, [formValues, currentStep, isSubmitSuccessful]);

  // Warn before leaving page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitSuccessful) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitSuccessful]);

  function handleResetForm() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    reset({
      businessName: "",
      businessType: "",
      otherBusinessType: "",
      locationsCount: "",
      hasBusinessAccount: undefined,
      country: "",
      businessCity: "",
      stateProvinceRegion: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      businessEmail: "",
      phoneNumber: "",
      workPreferences: [],
      otherWorkPreference: "",
      inventoryManagement: "",
      websiteOrSocial: "",
      additionalNotes: "",
      agreeToContact: false,
    });
    setCurrentStep(1);
    setDraftRestored(false);
  }

  useEffect(() => {
    if (!isOtherBusinessType && getValues("otherBusinessType")) {
      setValue("otherBusinessType", "");
    }
  }, [isOtherBusinessType, getValues, setValue]);

  useEffect(() => {
    if (!hasOtherWorkPreference && getValues("otherWorkPreference")) {
      setValue("otherWorkPreference", "");
    }
  }, [hasOtherWorkPreference, getValues, setValue]);

  // WEB-0004: keep Step 3 preference in sync with Step 1 location count
  useEffect(() => {
    if (!isSingleLocation) return;
    const current = getValues("workPreferences") || [];
    if (current.includes(multipleLocationsOption)) {
      setValue(
        "workPreferences",
        current.filter((v) => v !== multipleLocationsOption),
        { shouldValidate: true },
      );
    }
  }, [isSingleLocation, getValues, setValue]);

  async function handleNextStep() {
    let fieldsToValidate: (keyof PartnerLeadFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "businessName",
        "businessType",
        "locationsCount",
        "country",
        "businessCity",
        "stateProvinceRegion",
      ];
      if (getValues("businessType") === "Other") {
        fieldsToValidate.push("otherBusinessType");
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ["firstName", "lastName", "businessEmail", "phoneNumber"];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "workPreferences",
        "inventoryManagement",
        "websiteOrSocial",
        "additionalNotes",
      ];
      if (getValues("workPreferences")?.includes("Other")) {
        fieldsToValidate.push("otherWorkPreference");
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      clearErrors("agreeToContact");
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  }

  function handlePrevStep() {
    if (currentStep === STEPS.length) {
      setValue("agreeToContact", false, { shouldValidate: false });
      clearErrors("agreeToContact");
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function onSubmit(data: PartnerLeadFormValues) {
    if (currentStep !== STEPS.length) {
      return;
    }
    if (!data.agreeToContact) {
      return;
    }
    try {
      const mappedWorkPreferences = (data.workPreferences || []).map((pref) =>
        pref === "Other" && data.otherWorkPreference?.trim()
          ? `Other: ${data.otherWorkPreference.trim()}`
          : pref,
      );

      const payload = {
        ...data,
        workPreferences: mappedWorkPreferences,
        stateProvince: data.stateProvinceRegion?.trim() || undefined,
        website: data.websiteOrSocial?.trim() || undefined,
        additionalInfo: data.additionalNotes?.trim() || undefined,
        otherBusinessType: data.otherBusinessType?.trim() || undefined,
      };
      const res = await mutateAsync(payload);
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}
      successToast({
        title: "Interest Registered",
        description: "Your partnership request has been submitted successfully.",
      });
      onSuccess(res?.data?.referenceNumber ?? "");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={cn(
        "relative z-10 mt-auto w-full overflow-visible rounded-[2rem] bg-white p-4 shadow-2xl shadow-black/30 sm:mt-auto sm:rounded-[2.5rem] sm:p-10 md:mt-auto lg:mt-auto",
        className,
      )}
    >
      <div>
        <Link
          href={ROUTES.ROOT}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>
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

      {draftRestored && (
        <div className="mt-4 flex flex-col items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs text-emerald-900 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2">
          <div className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-emerald-600" />
            <span>Restored your saved progress from your previous session.</span>
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            className="cursor-pointer font-bold text-emerald-700 underline hover:text-emerald-900"
          >
            Start Fresh
          </button>
        </div>
      )}

      <div className="overflow-x-auto border-b border-slate-100 pb-5 sm:mt-6 sm:pb-6">
        <div className="relative flex min-w-[320px] sm:min-w-0">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 mt-1 flex flex-1 flex-col items-center">
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
                  onClick={() => {
                    if (step.id < currentStep) {
                      if (currentStep === STEPS.length) {
                        setValue("agreeToContact", false, { shouldValidate: false });
                        clearErrors("agreeToContact");
                      }
                      setCurrentStep(step.id);
                    }
                  }}
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep !== STEPS.length) {
            return;
          }
          handleSubmit(onSubmit)(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
            e.preventDefault();
            if (currentStep < STEPS.length) {
              handleNextStep();
            }
          }
        }}
        noValidate
        className="mt-5 sm:mt-6"
      >
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

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
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
                        "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
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

              {isOtherBusinessType && (
                <Controller
                  name="otherBusinessType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
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

              <Controller
                name="hasBusinessAccount"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <FieldLabel className="text-xs font-semibold text-slate-700">
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
                      aria-invalid={!!errors.stateProvinceRegion}
                      className={cn(
                        "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                        errors.stateProvinceRegion && "border-red-400 bg-red-50/30",
                      )}
                    />
                    {errors.stateProvinceRegion && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.stateProvinceRegion.message}
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
                      aria-invalid={!!errors.businessCity}
                      className={cn(
                        "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                        errors.businessCity && "border-red-400 bg-red-50/30",
                      )}
                    />
                    {errors.businessCity && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.businessCity.message}
                      </p>
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

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
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
                    if (option === multipleLocationsOption && isSingleLocation) return;
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
                          const isMultipleLocationsOption = opt === multipleLocationsOption;
                          const isDisabled = isMultipleLocationsOption && isSingleLocation;
                          const isChecked = values.includes(opt);
                          return (
                            <label
                              key={opt}
                              className={cn(
                                "flex min-h-16 items-center gap-3 rounded-xl border px-3 py-2.5 shadow-sm transition-colors",
                                isDisabled
                                  ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400 opacity-70"
                                  : isChecked
                                    ? "cursor-pointer border-emerald-500 bg-emerald-50 font-medium text-emerald-950 shadow-emerald-100"
                                    : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30",
                              )}
                              title={
                                isDisabled
                                  ? "Not available when Number of Locations is set to 1 Location"
                                  : undefined
                              }
                            >
                              <Checkbox
                                checked={isChecked}
                                disabled={isDisabled}
                                onCheckedChange={() => toggleValue(opt)}
                                className="size-4 rounded"
                              />
                              <span className="text-xs leading-5 font-medium">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {isSingleLocation && (
                        <p className="text-[11px] text-slate-400">
                          &quot;Add multiple store locations&quot; is disabled because you selected
                          1 Location in Step 1.
                        </p>
                      )}

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
                                Please Specify Other Preference{" "}
                                <span className="text-red-500">*</span>
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

              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
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

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs">
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Business:</span>
                <span className="min-w-0 font-semibold break-words text-slate-900 sm:text-right">
                  {getValues("businessName") || "N/A"} (
                  {getValues("businessType") === "Other" && getValues("otherBusinessType")
                    ? `Other: ${getValues("otherBusinessType")}`
                    : getValues("businessType") || "N/A"}
                  )
                  {getValues("hasBusinessAccount") !== undefined
                    ? ` • Bank Account: ${getValues("hasBusinessAccount") ? "Yes" : "No"}`
                    : ""}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Contact Person:</span>
                <span className="min-w-0 font-semibold break-words text-slate-900 sm:text-right">
                  {getValues("firstName")} {getValues("lastName")}
                  {getValues("jobTitle") ? ` • ${getValues("jobTitle")}` : ""}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Email / Phone:</span>
                <span className="min-w-0 font-semibold break-all text-slate-900 sm:text-right">
                  {getValues("businessEmail")} | {getValues("phoneNumber")}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Locations / Region:</span>
                <span className="min-w-0 font-semibold wrap-break-word text-slate-900 sm:text-right">
                  {getValues("locationsCount")} | {getValues("country")}
                  {getValues("stateProvinceRegion") ? `, ${getValues("stateProvinceRegion")}` : ""}
                  {getValues("businessCity") ? ` (${getValues("businessCity")})` : ""}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2">
                <span className="font-medium text-slate-500">Work Preferences:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(getValues("workPreferences") || []).length > 0 ? (
                    (getValues("workPreferences") || []).map((pref) => (
                      <span
                        key={pref}
                        className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800"
                      >
                        {pref === "Other" && getValues("otherWorkPreference")
                          ? `Other: ${getValues("otherWorkPreference")}`
                          : pref}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None selected</span>
                  )}
                </div>
              </div>
              {(getValues("inventoryManagement") || getValues("websiteOrSocial")) && (
                <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <span className="font-medium text-slate-500">Operations / Web:</span>
                  <span className="text-left font-semibold break-all text-slate-900 sm:text-right">
                    {getValues("inventoryManagement") || "Standard"}
                    {getValues("websiteOrSocial") ? ` • ${getValues("websiteOrSocial")}` : ""}
                  </span>
                </div>
              )}
              {getValues("additionalNotes") && (
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-500">Additional Notes:</span>
                  <p className="line-clamp-2 rounded-lg border border-slate-200/60 bg-white p-2 text-slate-700 italic">
                    &quot;{getValues("additionalNotes")}&quot;
                  </p>
                </div>
              )}
            </div>

            <Controller
              name="agreeToContact"
              control={control}
              render={({ field }) => (
                <div className="mt-2 flex flex-col gap-1.5">
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
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

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="h-11 w-full rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              <ArrowLeft className="mr-1.5 size-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              key="btn-step-next"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className="h-11 w-full rounded-xl bg-emerald-700 px-6 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 sm:w-auto"
            >
              Next Step
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button
              key="btn-step-submit"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (currentStep === STEPS.length) {
                  handleSubmit(onSubmit)();
                }
              }}
              isLoading={isPending}
              className="h-12 w-full rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-800 sm:w-auto sm:px-7"
            >
              I’m Interested — Join Food Remit
            </Button>
          )}
        </div>
      </form>

      <div className="mt-3 px-2 text-center text-xs font-medium text-slate-500">
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
