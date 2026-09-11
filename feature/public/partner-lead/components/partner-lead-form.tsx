"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { CountrySelect } from "@/components/common/country-select";
import { errorToast, successToast } from "@/components/toaster";
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
import { VeriffKycStep } from "./veriff-kyc-step";
import { PlaidBankStep } from "./plaid-bank-step";
import { AdditionalDocumentsSection } from "./additional-documents-section";

function dataUrlToFile(dataUrl: string, fileName: string, mimeType?: string): File | null {
  try {
    const parts = dataUrl.split(",");
    if (parts.length < 2) return null;
    const mime = mimeType || parts[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  } catch {
    return null;
  }
}

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
      veriffSessionId: "",
      kycStatus: "NOT_STARTED",
      plaidItemId: "",
      plaidAccountId: "",
      bankStatus: "NOT_STARTED",
      bankInstitutionName: "",
      bankAccountName: "",
      bankAccountMask: "",
      additionalDocuments: [],
    },
    mode: "onChange",
  });

  const kycStatus = watch("kycStatus");
  const bankStatus = watch("bankStatus");
  const veriffSessionId = watch("veriffSessionId");

  const normalizedKycStatus = (kycStatus || "").toUpperCase();
  const isKycApproved = normalizedKycStatus === "APPROVED";
  const isKycDeclined = [
    "DECLINED",
    "FAILED",
    "RESUBMISSION_REQUESTED",
    "EXPIRED",
    "ABANDONED",
  ].includes(normalizedKycStatus);
  const isBankVerified = (bankStatus || "").toUpperCase() === "VERIFIED";

  const locationsCount = watch("locationsCount");
  const businessType = watch("businessType");
  const isOtherBusinessType = businessType === "Other";
  const isSingleLocation = locationsCount === "1 Location";
  const multipleLocationsOption = "Add multiple store locations";
  const workPreferences = watch("workPreferences") || [];
  const hasOtherWorkPreference = workPreferences.includes("Other");

  function hasMeaningfulData(vals?: Partial<PartnerLeadFormValues> | null): boolean {
    if (!vals) return false;
    return Boolean(
      vals.businessName?.trim() ||
      vals.businessType?.trim() ||
      vals.country?.trim() ||
      vals.firstName?.trim() ||
      vals.lastName?.trim() ||
      vals.businessEmail?.trim() ||
      vals.phoneNumber?.trim() ||
      vals.websiteOrSocial?.trim() ||
      vals.additionalNotes?.trim() ||
      vals.jobTitle?.trim() ||
      vals.businessCity?.trim() ||
      vals.stateProvinceRegion?.trim() ||
      (vals.workPreferences && vals.workPreferences.length > 0) ||
      vals.veriffSessionId?.trim() ||
      vals.plaidItemId?.trim() ||
      (vals.kycStatus && vals.kycStatus !== "NOT_STARTED") ||
      (vals.bankStatus && vals.bankStatus !== "NOT_STARTED") ||
      (vals.additionalDocuments && vals.additionalDocuments.length > 0),
    );
  }

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.values && hasMeaningfulData(parsed.values)) {
          reset(parsed.values);
          if (parsed.step && parsed.step > 1 && parsed.step <= STEPS.length) {
            let targetStep = parsed.step;
            const parsedKyc = (parsed.values?.kycStatus || "").toUpperCase();
            const parsedBank = (parsed.values?.bankStatus || "").toUpperCase();
            if (targetStep >= 5 && parsedKyc !== "APPROVED") {
              targetStep = 4;
            }
            if (targetStep >= 6 && parsedBank !== "VERIFIED") {
              targetStep = 5;
            }
            setCurrentStep(targetStep);
          }
          setDraftRestored(true);
        } else {
          sessionStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      // ignore storage access errors
    }
  }, [reset]);

  // Persist draft to sessionStorage on form value or step change only if user entered data
  const formValues = watch();
  useEffect(() => {
    try {
      if (hasMeaningfulData(formValues) && !isSubmitSuccessful) {
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
      veriffSessionId: "",
      kycStatus: "NOT_STARTED",
      plaidItemId: "",
      plaidAccountId: "",
      bankStatus: "NOT_STARTED",
      bankInstitutionName: "",
      bankAccountName: "",
      bankAccountMask: "",
      additionalDocuments: [],
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
    } else if (currentStep === 4) {
      if (!isKycApproved) {
        errorToast({
          title: "Identity Verification Required",
          description:
            "Please complete your Veriff KYC and wait for approval before moving to the next step.",
        });
        return;
      }
    } else if (currentStep === 5) {
      if (!isBankVerified) {
        errorToast({
          title: "Bank Verification Required",
          description:
            "Please connect and verify your commercial bank account with Plaid before proceeding to final review.",
        });
        return;
      }
      const docs = getValues("additionalDocuments") || [];
      if (docs.length < 1) {
        errorToast({
          title: "Supporting Document Required",
          description:
            "Please upload at least 1 supporting business document (e.g. business license, voided check, tax document) to proceed.",
        });
        return;
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

      const formData = new FormData();
      formData.append("businessName", data.businessName || "");
      formData.append("businessType", data.businessType || "");
      if (data.otherBusinessType?.trim()) {
        formData.append("otherBusinessType", data.otherBusinessType.trim());
      }
      formData.append("locationsCount", data.locationsCount || "1 Location");
      formData.append("country", data.country || "");
      if (data.businessCity?.trim()) formData.append("businessCity", data.businessCity.trim());
      if (data.stateProvinceRegion?.trim()) {
        formData.append("stateProvince", data.stateProvinceRegion.trim());
        formData.append("stateProvinceRegion", data.stateProvinceRegion.trim());
      }
      formData.append("firstName", data.firstName || "");
      formData.append("lastName", data.lastName || "");
      if (data.jobTitle?.trim()) formData.append("jobTitle", data.jobTitle.trim());
      formData.append("businessEmail", data.businessEmail || "");
      formData.append("phoneNumber", data.phoneNumber || "");
      if (data.inventoryManagement?.trim()) {
        formData.append("inventoryManagement", data.inventoryManagement.trim());
      }
      if (data.websiteOrSocial?.trim()) {
        formData.append("website", data.websiteOrSocial.trim());
        formData.append("websiteOrSocial", data.websiteOrSocial.trim());
      }
      if (data.additionalNotes?.trim()) {
        formData.append("additionalInfo", data.additionalNotes.trim());
        formData.append("additionalNotes", data.additionalNotes.trim());
      }
      formData.append("agreeToContact", String(data.agreeToContact ?? true));
      if (data.veriffSessionId?.trim())
        formData.append("veriffSessionId", data.veriffSessionId.trim());
      if (data.kycStatus?.trim()) formData.append("kycStatus", data.kycStatus.trim());
      if (data.plaidItemId?.trim()) formData.append("plaidItemId", data.plaidItemId.trim());
      if (data.plaidAccountId?.trim())
        formData.append("plaidAccountId", data.plaidAccountId.trim());
      if (data.bankStatus?.trim()) formData.append("bankStatus", data.bankStatus.trim());
      if (data.bankInstitutionName?.trim())
        formData.append("bankInstitutionName", data.bankInstitutionName.trim());
      if (data.bankAccountName?.trim())
        formData.append("bankAccountName", data.bankAccountName.trim());
      if (data.bankAccountMask?.trim())
        formData.append("bankAccountMask", data.bankAccountMask.trim());

      formData.append("workPreferences", JSON.stringify(mappedWorkPreferences));

      // Append all attached documents as binary files in FormData (no Base64 strings sent)
      (data.additionalDocuments || []).forEach((doc) => {
        let binaryFile: File | null = null;
        if (doc.rawFile instanceof File) {
          binaryFile = doc.rawFile;
        } else if (doc.file && typeof doc.file === "string" && doc.file.startsWith("data:")) {
          binaryFile = dataUrlToFile(doc.file, doc.name, doc.mimeType);
        }

        if (binaryFile) {
          formData.append("additionalDocuments", binaryFile, doc.name || binaryFile.name);
        }
      });

      const res = await mutateAsync(formData);
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

      {draftRestored && hasMeaningfulData(formValues) && (
        <div className="mt-4 mb-2 flex flex-col items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs text-emerald-900 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-2">
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
          <VeriffKycStep
            applicant={{
              firstName: getValues("firstName"),
              lastName: getValues("lastName"),
              email: getValues("businessEmail"),
              phoneNumber: getValues("phoneNumber"),
              country: getValues("country"),
            }}
            sessionId={watch("veriffSessionId")}
            currentKycStatus={watch("kycStatus")}
            onSessionUpdated={(newSessionId, status) => {
              setValue("veriffSessionId", newSessionId, { shouldDirty: true });
              setValue("kycStatus", status, { shouldDirty: true });
            }}
            onContinue={() => {
              setCurrentStep(5);
            }}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <PlaidBankStep
              applicant={{
                firstName: getValues("firstName"),
                lastName: getValues("lastName"),
                email: getValues("businessEmail"),
                phoneNumber: getValues("phoneNumber"),
                country: getValues("country"),
              }}
              initialItemId={watch("plaidItemId")}
              currentBankStatus={watch("bankStatus")}
              institutionName={watch("bankInstitutionName")}
              accountName={watch("bankAccountName")}
              accountMask={watch("bankAccountMask")}
              onBankUpdated={(info) => {
                setValue("plaidItemId", info.plaidItemId, { shouldDirty: true });
                setValue("plaidAccountId", info.plaidAccountId, { shouldDirty: true });
                setValue("bankStatus", info.bankStatus, { shouldDirty: true });
                setValue("bankInstitutionName", info.bankInstitutionName, { shouldDirty: true });
                setValue("bankAccountName", info.bankAccountName, { shouldDirty: true });
                setValue("bankAccountMask", info.bankAccountMask, { shouldDirty: true });
              }}
              onContinue={() => {
                const docs = getValues("additionalDocuments") || [];
                if (docs.length < 1) {
                  errorToast({
                    title: "Supporting Document Required",
                    description:
                      "Please upload at least 1 supporting business document before proceeding to review.",
                  });
                  return;
                }
                setCurrentStep(6);
              }}
            />

            <AdditionalDocumentsSection
              documents={watch("additionalDocuments") || []}
              onChange={(docs) => {
                setValue("additionalDocuments", docs, { shouldValidate: true, shouldDirty: true });
              }}
              error={errors.additionalDocuments?.message}
            />
          </div>
        )}

        {currentStep === 6 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 6: Review & Complete</h2>
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
                <span className="font-medium text-slate-500">Locations &amp; Country:</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {getValues("locationsCount") || "N/A"} • {getValues("country") || "N/A"}
                  {getValues("businessCity") ? ` (${getValues("businessCity")})` : ""}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Primary Contact:</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {getValues("firstName")} {getValues("lastName")} (
                  {getValues("jobTitle") || "Owner / Representative"})
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Contact Details:</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {getValues("businessEmail")} • {getValues("phoneNumber")}
                </span>
              </div>
              {/* Work Preferences Review Line */}
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Partnership Interests:</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {(getValues("workPreferences") || []).length > 0
                    ? (getValues("workPreferences") || []).join(", ")
                    : "None specified"}
                </span>
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
                <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-2">
                  <span className="font-medium text-slate-500">Additional Notes:</span>
                  <p className="line-clamp-2 rounded-lg border border-slate-200/60 bg-white p-2 text-slate-700 italic">
                    &quot;{getValues("additionalNotes")}&quot;
                  </p>
                </div>
              )}

              {/* KYC Review Line */}
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Identity Verification (KYC):</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {(watch("kycStatus") || "").toUpperCase() === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Verified &amp; Approved via Veriff
                    </span>
                  ) : watch("veriffSessionId") ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                      <Clock className="size-4 text-amber-600" />
                      Submitted / Under Review ({watch("kycStatus") || "SUBMITTED"})
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Not Started</span>
                  )}
                </span>
              </div>

              {/* Bank Verification Review Line */}
              <div className="flex flex-col gap-1 border-b border-slate-200/60 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Bank Account (Plaid):</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {(watch("bankStatus") || "").toUpperCase() === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      {watch("bankInstitutionName") || "Verified Commercial Bank"} (••••{" "}
                      {watch("bankAccountMask") || "0000"})
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Not Verified</span>
                  )}
                </span>
              </div>

              {/* Supporting Documents Review Line */}
              <div className="flex flex-col gap-1 pb-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <span className="font-medium text-slate-500">Supporting Documents:</span>
                <span className="min-w-0 font-semibold text-slate-900 sm:text-right">
                  {(watch("additionalDocuments") || []).length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      {(watch("additionalDocuments") || []).length} Document(s) Attached
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-500">1 Document Required</span>
                  )}
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
              disabled={
                (currentStep === 4 && !isKycApproved) ||
                (currentStep === 5 &&
                  (!isBankVerified || (watch("additionalDocuments") || []).length < 1))
              }
              onClick={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className={cn(
                "h-11 w-full rounded-xl px-6 text-xs font-bold shadow-sm transition-all sm:w-auto",
                (currentStep === 4 && !isKycApproved) ||
                  (currentStep === 5 &&
                    (!isBankVerified || (watch("additionalDocuments") || []).length < 1))
                  ? "cursor-not-allowed bg-slate-200 text-slate-400 opacity-60 hover:bg-slate-200"
                  : "bg-emerald-700 text-white hover:bg-emerald-800",
              )}
            >
              {currentStep === 4 && !isKycApproved ? (
                isKycDeclined ? (
                  <>
                    <AlertCircle className="mr-1.5 size-3.5 text-rose-500" />
                    Verification Declined — Retry Required
                  </>
                ) : veriffSessionId ? (
                  <>
                    <RefreshCw className="mr-1.5 size-3.5 animate-spin text-amber-600" />
                    Awaiting Veriff Approval...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-1.5 size-3.5 text-slate-400" />
                    Verify Identity to Continue
                  </>
                )
              ) : currentStep === 5 && !isBankVerified ? (
                <>
                  <Lock className="mr-1.5 size-3.5 text-slate-400" />
                  Verify Bank Account to Continue
                </>
              ) : currentStep === 5 && (watch("additionalDocuments") || []).length < 1 ? (
                <>
                  <Lock className="mr-1.5 size-3.5 text-slate-400" />
                  Upload Document to Continue
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="ml-1.5 size-4" />
                </>
              )}
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
