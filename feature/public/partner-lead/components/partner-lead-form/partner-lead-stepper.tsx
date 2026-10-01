import { Check } from "lucide-react";
import { STEPS } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";

type PartnerLeadStepperProps = Pick<
  PartnerLeadFormState,
  | "currentStep"
  | "setCurrentStep"
  | "setValue"
  | "clearErrors"
  | "stepperScrollRef"
  | "registerStepItem"
>;

export function PartnerLeadStepper({
  currentStep,
  setCurrentStep,
  setValue,
  clearErrors,
  stepperScrollRef,
  registerStepItem,
}: PartnerLeadStepperProps) {
  return (
    <div
      ref={stepperScrollRef}
      className="scrollbar-hide mt-4 overflow-x-auto border-b border-slate-100 pb-5 sm:mt-6 sm:pb-6"
    >
      <div className="relative flex min-w-[460px] sm:min-w-0">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              ref={(el) => {
                registerStepItem(step.id, el);
              }}
              className="relative z-10 mt-1 flex flex-1 flex-col items-center px-1.5 sm:px-2"
            >
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
                  !isCompleted && !isActive && "border-2 border-slate-200 bg-white text-slate-400",
                )}
              >
                {isCompleted ? <Check className="size-4 stroke-3" /> : step.id}
              </button>
              <span
                className={cn(
                  "mt-2 text-center text-[11px] font-semibold",
                  isActive ? "text-emerald-700" : isCompleted ? "text-slate-700" : "text-slate-400",
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
