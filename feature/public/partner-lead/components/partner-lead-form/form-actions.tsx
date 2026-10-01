import { AlertCircle, ArrowLeft, ArrowRight, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { getIsNextStepDisabled } from "../../utils/partner-lead-form.utils";

type FormActionsProps = Pick<
  PartnerLeadFormState,
  | "currentStep"
  | "watch"
  | "isKycApproved"
  | "isKycDeclined"
  | "isKycSubmitted"
  | "isBankStepComplete"
  | "isPending"
  | "handlePrevStep"
  | "handleNextStep"
  | "handleSubmit"
  | "onSubmit"
>;

export function FormActions({
  currentStep,
  watch,
  isKycApproved,
  isKycDeclined,
  isKycSubmitted,
  isBankStepComplete,
  isPending,
  handlePrevStep,
  handleNextStep,
  handleSubmit,
  onSubmit,
}: FormActionsProps) {
  const documentsCount = (watch("additionalDocuments") || []).length;
  const isNextDisabled = getIsNextStepDisabled(
    currentStep,
    isKycApproved,
    isBankStepComplete,
    documentsCount,
  );

  return (
    <div className="mt-6 flex flex-col-reverse flex-wrap gap-3 border-t border-slate-100 pt-5 sm:mt-8 sm:pt-6 md:flex-row md:items-center md:justify-between">
      {currentStep > 1 ? (
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          className="h-11 w-full rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 md:w-auto"
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
          disabled={isNextDisabled}
          onClick={(e) => {
            e.preventDefault();
            handleNextStep();
          }}
          className={cn(
            "h-11 w-full rounded-xl px-6 text-xs font-bold shadow-sm transition-all md:w-auto",
            isNextDisabled
              ? "cursor-not-allowed bg-slate-200 text-slate-400 opacity-60 hover:bg-slate-200"
              : "bg-emerald-700 text-white hover:bg-emerald-800",
          )}
        >
          <NextStepLabel
            currentStep={currentStep}
            isKycApproved={isKycApproved}
            isKycDeclined={isKycDeclined}
            isKycSubmitted={isKycSubmitted}
            isBankStepComplete={isBankStepComplete}
            documentsCount={documentsCount}
          />
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
          className="h-12 w-full rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-800 md:w-auto md:px-7"
        >
          I’m Interested — Join Food Remit
        </Button>
      )}
    </div>
  );
}

type NextStepLabelProps = {
  currentStep: number;
  isKycApproved: boolean;
  isKycDeclined: boolean;
  isKycSubmitted: boolean;
  isBankStepComplete: boolean;
  documentsCount: number;
};

function NextStepLabel({
  currentStep,
  isKycApproved,
  isKycDeclined,
  isKycSubmitted,
  isBankStepComplete,
  documentsCount,
}: NextStepLabelProps) {
  if (currentStep === 4 && !isKycApproved) {
    if (isKycDeclined) {
      return (
        <>
          <AlertCircle className="mr-1.5 size-3.5 text-rose-500" />
          Verification Declined — Retry Required
        </>
      );
    }
    if (isKycSubmitted) {
      return (
        <>
          <RefreshCw className="mr-1.5 size-3.5 animate-spin text-amber-600" />
          Awaiting Veriff Approval...
        </>
      );
    }
    return (
      <>
        <ShieldCheck className="mr-1.5 size-3.5 text-slate-400" />
        Verify Identity to Continue
      </>
    );
  }
  if (currentStep === 5 && !isBankStepComplete) {
    return (
      <>
        <Lock className="mr-1.5 size-3.5 text-slate-400" />
        Verify or Skip Bank to Continue
      </>
    );
  }
  if (currentStep === 5 && documentsCount < 1) {
    return (
      <>
        <Lock className="mr-1.5 size-3.5 text-slate-400" />
        Upload Document to Continue
      </>
    );
  }
  return (
    <>
      Next Step
      <ArrowRight className="ml-1.5 size-4" />
    </>
  );
}
