"use client";

import { ArrowLeft, Check, Clock, Home } from "lucide-react";
import Link from "next/link";
import { errorToast } from "@/components/toaster";
import { ROUTES } from "@/config/routes";
import { STEPS } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import { usePartnerLeadForm } from "../hooks/use-partner-lead-form";
import { hasMeaningfulData } from "../utils/partner-lead-form.utils";
import { VeriffKycStep } from "./veriff-kyc-step";
import { PlaidBankStep } from "./plaid-bank-step";
import { AdditionalDocumentsSection } from "./additional-documents-section";
import { PartnerLeadStepper } from "./partner-lead-form/partner-lead-stepper";
import { BusinessInfoStep } from "./partner-lead-form/business-info-step";
import { ContactInfoStep } from "./partner-lead-form/contact-info-step";
import { BusinessPreferencesStep } from "./partner-lead-form/business-preferences-step";
import { ReviewStep } from "./partner-lead-form/review-step";
import { FormActions } from "./partner-lead-form/form-actions";

interface PartnerLeadFormProps {
  onSuccess: (referenceNumber: string) => void;
  className?: string;
}

export function PartnerLeadForm({ onSuccess, className }: PartnerLeadFormProps) {
  const {
    currentStep,
    setCurrentStep,
    draftRestored,
    isPending,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    clearErrors,
    watch,
    errors,
    isKycApproved,
    isKycSubmitted,
    isKycDeclined,
    isBankStepComplete,
    isOtherBusinessType,
    sameDayDelivery,
    hasOtherWorkPreference,
    formCardRef,
    stepperScrollRef,
    registerStepItem,
    formValues,
    handleResetForm,
    selectedCountryName,
    selectedCountryIsoCode,
    selectedStateIsoCode,
    handleNextStep,
    handlePrevStep,
    onSubmit,
  } = usePartnerLeadForm(onSuccess);

  return (
    <div
      ref={formCardRef}
      className={cn(
        "relative z-10 my-auto w-full overflow-hidden rounded-[2rem] bg-white px-4 py-6 shadow-2xl shadow-black/30 sm:rounded-[2.5rem] sm:p-8 md:p-10",
        className,
      )}
    >
      <div>
        <Link
          href={ROUTES.ROOT}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
          title="Back to Home"
        >
          <ArrowLeft className="size-4" />
          <span>
            <Home size={20} />
          </span>
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

      <PartnerLeadStepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setValue={setValue}
        clearErrors={clearErrors}
        stepperScrollRef={stepperScrollRef}
        registerStepItem={registerStepItem}
      />

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
          <BusinessInfoStep
            control={control}
            errors={errors}
            setValue={setValue}
            clearErrors={clearErrors}
            trigger={trigger}
            watch={watch}
            isOtherBusinessType={isOtherBusinessType}
            selectedCountryName={selectedCountryName}
            selectedCountryIsoCode={selectedCountryIsoCode}
            selectedStateIsoCode={selectedStateIsoCode}
          />
        )}

        {/* STEP 2: Your Information */}
        {currentStep === 2 && (
          <ContactInfoStep
            control={control}
            errors={errors}
            watch={watch}
            selectedCountryName={selectedCountryName}
            selectedCountryIsoCode={selectedCountryIsoCode}
          />
        )}

        {/* STEP 3: Tell Us About Your Business */}
        {currentStep === 3 && (
          <BusinessPreferencesStep
            control={control}
            errors={errors}
            setValue={setValue}
            clearErrors={clearErrors}
            sameDayDelivery={sameDayDelivery}
            hasOtherWorkPreference={hasOtherWorkPreference}
            watch={watch}
          />
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
              allowSkip
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
          <ReviewStep control={control} errors={errors} getValues={getValues} watch={watch} />
        )}

        <FormActions
          currentStep={currentStep}
          watch={watch}
          isKycApproved={isKycApproved}
          isKycDeclined={isKycDeclined}
          isKycSubmitted={isKycSubmitted}
          isBankStepComplete={isBankStepComplete}
          isPending={isPending}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </form>

      <div className="mt-5 border-t border-slate-100 px-2 pt-4 text-center text-xs font-medium text-slate-500 sm:mt-6 sm:pt-5">
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
