import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, useState, useRef, useMemo, useId } from "react";
import { useForm } from "react-hook-form";
import { Country } from "country-state-city";
import { getWorldStatesByCountryIso } from "@/lib/world-locations";
import { useDebounce } from "@/lib/debounce";
import { DEFAULT_WEEKLY_SCHEDULE } from "@/components/common/store-schedule-utils";
import { errorToast, successToast } from "@/components/toaster";
import { STEPS } from "@/constants/become-a-partner";
import { useCreatePartnerLead } from "./create-partner";
import { PartnerLeadFormValues, partnerLeadSchema } from "../schema/partner-lead.schema";
import { checkEmailExists } from "./use-check-email";
import {
  DRAFT_KEY,
  dataUrlToFile,
  getCurrencySymbol,
  hasMeaningfulData,
} from "../utils/partner-lead-form.utils";
import { revokeFilePreviewUrls } from "../utils/file-preview-url";

export function usePartnerLeadForm(onSuccess: (referenceNumber: string) => void) {
  const [currentStep, setCurrentStep] = useState(1);
  const [draftRestored, setDraftRestored] = useState(false);

  const reactId = useId();

  const { mutateAsync, isPending } = useCreatePartnerLead();

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
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
      storeLogo: undefined,
      profileImage: undefined,
      locationsCount: "1",
      locations: [
        {
          address: "",
          daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          hoursOfOperation: "",
          dailySchedule: DEFAULT_WEEKLY_SCHEDULE,
        },
      ],
      hasBusinessAccount: undefined,
      country: "",
      businessCity: "",
      stateProvinceRegion: "",
      storePhoneNumber: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      businessEmail: "",
      phoneNumber: "",
      languages: [],
      workPreferences: [],
      otherWorkPreference: "",
      inventoryManagement: "",
      sameDayDelivery: false,
      orderProcessingTime: "",
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
  const businessEmail = watch("businessEmail");
  const debouncedBusinessEmail = useDebounce(businessEmail, 1000);
  const lastCheckedEmail = useRef<string | null>(null);
  const isCheckingEmail = useRef<boolean>(false);

  const hasBusinessEmailFormatError = useEffectEvent(
    () => !!errors.businessEmail && errors.businessEmail.type !== "manual",
  );

  useEffect(() => {
    async function checkUniqueEmail() {
      if (!debouncedBusinessEmail) return;

      // Only check if we haven't already checked this exact email successfully
      if (lastCheckedEmail.current === debouncedBusinessEmail) return;

      // Don't check if there's a format error (i.e., invalid email)
      if (hasBusinessEmailFormatError()) return;

      if (isCheckingEmail.current) return;

      try {
        isCheckingEmail.current = true;
        const res = await checkEmailExists(debouncedBusinessEmail, true);

        lastCheckedEmail.current = debouncedBusinessEmail;

        if (res?.isValidDomain === false) {
          setError("businessEmail", {
            type: "manual",
            message: "The email domain is invalid or cannot receive emails.",
          });
        } else if (res?.exists) {
          setError("businessEmail", {
            type: "manual",
            message: "This email is already registered. Please use a different one.",
          });
        }
      } catch (err) {
        // Ignore API checking errors gracefully
      } finally {
        isCheckingEmail.current = false;
      }
    }

    void checkUniqueEmail();
  }, [debouncedBusinessEmail, setError]);

  useEffect(() => {
    if (businessEmail !== debouncedBusinessEmail) {
      if (errors.businessEmail?.type === "manual") {
        clearErrors("businessEmail");
      }
      // Always reset the last checked email when the user starts typing again
      // so it properly re-verifies if they clear and re-enter the same email
      lastCheckedEmail.current = null;
    }
  }, [businessEmail, debouncedBusinessEmail, clearErrors, errors.businessEmail?.type]);

  const normalizedKycStatus = (kycStatus || "").toUpperCase();
  const isKycApproved = normalizedKycStatus === "APPROVED";
  const isKycSubmitted = normalizedKycStatus === "SUBMITTED";
  const isKycDeclined = [
    "DECLINED",
    "FAILED",
    "RESUBMISSION_REQUESTED",
    "EXPIRED",
    "ABANDONED",
  ].includes(normalizedKycStatus);
  const isBankVerified = (bankStatus || "").toUpperCase() === "VERIFIED";
  const isBankSkipped = (bankStatus || "").toUpperCase() === "SKIPPED";
  const isBankStepComplete = isBankVerified || isBankSkipped;

  const businessType = watch("businessType");
  const isOtherBusinessType = businessType === "Other";

  const sameDayDelivery = watch("sameDayDelivery");

  const workPreferences = watch("workPreferences") || [];
  const hasOtherWorkPreference = workPreferences.includes("Other");

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
            if (targetStep >= 6 && parsedBank !== "VERIFIED" && parsedBank !== "SKIPPED") {
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

  const formCardRef = useRef<HTMLDivElement | null>(null);
  const stepperScrollRef = useRef<HTMLDivElement | null>(null);
  const stepItemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isInitialStepRender = useRef(true);

  useEffect(() => {
    const activeStepEl = stepItemRefs.current[currentStep];
    const stepperContainer = stepperScrollRef.current;
    if (activeStepEl && stepperContainer) {
      const targetLeft =
        activeStepEl.offsetLeft - stepperContainer.clientWidth / 2 + activeStepEl.clientWidth / 2;
      stepperContainer.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: isInitialStepRender.current ? "auto" : "smooth",
      });
    }

    if (isInitialStepRender.current) {
      isInitialStepRender.current = false;
      return;
    }

    const scrollContainer = formCardRef.current?.closest(
      "[data-auth-scroll-container]",
    ) as HTMLElement | null;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

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

  useEffect(() => revokeFilePreviewUrls, []);

  function registerStepItem(stepId: number, el: HTMLDivElement | null) {
    stepItemRefs.current[stepId] = el;
  }

  function handleResetForm() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    reset({
      businessName: "",
      businessType: "",
      otherBusinessType: "",
      locationsCount: "1",
      locations: [
        {
          address: "",
          daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          hoursOfOperation: "",
          dailySchedule: DEFAULT_WEEKLY_SCHEDULE,
        },
      ],
      hasBusinessAccount: undefined,
      country: "",
      currency: "",
      businessCity: "",
      stateProvinceRegion: "",
      storePhoneNumber: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      businessEmail: "",
      phoneNumber: "",
      languages: [],
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

  // Auto-detect Currency logic
  const selectedCountryName = watch("country");
  useEffect(() => {
    if (selectedCountryName) {
      const countries = Country.getAllCountries();
      const countryObj = countries.find(
        (c) => c.name.trim().toLowerCase() === selectedCountryName.trim().toLowerCase(),
      );
      if (countryObj && countryObj.currency) {
        setValue("currency", getCurrencySymbol(countryObj.currency), { shouldValidate: true });
      }
    } else {
      setValue("currency", "", { shouldValidate: true });
    }
  }, [selectedCountryName, setValue]);

  const selectedCountryIsoCode = useMemo(() => {
    if (!selectedCountryName) return undefined;
    const clean = selectedCountryName.trim().toLowerCase();
    const found = Country.getAllCountries().find(
      (c) => c.name.trim().toLowerCase() === clean || c.isoCode.toLowerCase() === clean,
    );
    return found?.isoCode;
  }, [selectedCountryName]);

  const selectedStateName = watch("stateProvinceRegion");
  const selectedStateIsoCode = useMemo(() => {
    if (!selectedCountryIsoCode || !selectedStateName) return undefined;
    const clean = selectedStateName.trim().toLowerCase();
    const states = getWorldStatesByCountryIso(selectedCountryIsoCode);
    const found = states.find(
      (s) => s.name.toLowerCase() === clean || s.isoCode.toLowerCase() === clean,
    );
    return found?.isoCode;
  }, [selectedCountryIsoCode, selectedStateName]);

  async function handleNextStep() {
    let fieldsToValidate: (keyof PartnerLeadFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "businessName",
        "businessType",
        "country",
        "businessCity",
        "stateProvinceRegion",
        "locations",
        "storePhoneNumber",
      ];
      if (getValues("businessType") === "Other") {
        fieldsToValidate.push("otherBusinessType");
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ["firstName", "lastName", "businessEmail", "phoneNumber", "languages"];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "workPreferences",
        "sameDayDelivery",
        "orderProcessingTime",
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
      if (!isBankStepComplete) {
        errorToast({
          title: "Bank Verification Required",
          description:
            "Please connect your bank with Plaid, or skip for now to verify later after approval.",
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

    let isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep === 2) {
      const emailToVerify = getValues("businessEmail");
      if (emailToVerify) {
        try {
          const res = await checkEmailExists(emailToVerify, true);
          if (res?.isValidDomain === false) {
            setError("businessEmail", {
              type: "manual",
              message: "The email domain is invalid or cannot receive emails.",
            });
            isValid = false;
          } else if (res?.exists) {
            setError("businessEmail", {
              type: "manual",
              message: "This email is already registered. Please use a different one.",
            });
            isValid = false;
          }
        } catch (err) {
          // ignore
        }
      }
    }

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
      if (data.storeLogo instanceof File) {
        formData.append("storeLogo", data.storeLogo, data.storeLogo.name);
      } else if (Array.isArray(data.storeLogo) && data.storeLogo[0] instanceof File) {
        formData.append("storeLogo", data.storeLogo[0], data.storeLogo[0].name);
      } else if (typeof data.storeLogo === "string" && data.storeLogo.trim()) {
        formData.append("storeLogo", data.storeLogo.trim());
      }
      if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage, data.profileImage.name);
      } else if (Array.isArray(data.profileImage) && data.profileImage[0] instanceof File) {
        formData.append("profileImage", data.profileImage[0], data.profileImage[0].name);
      } else if (typeof data.profileImage === "string" && data.profileImage.trim()) {
        formData.append("profileImage", data.profileImage.trim());
      }
      formData.append("locationsCount", data.locationsCount || "1");
      if (data.locations && data.locations.length > 0) {
        const cleanLocations = data.locations.filter((loc) => loc.address.trim() !== "");
        if (cleanLocations.length > 0) {
          const locsToSave = cleanLocations.map((loc, idx) => {
            if (idx === 0) {
              return {
                ...loc,
                phone: data.storePhoneNumber?.trim() || "",
                storePhoneNumber: data.storePhoneNumber?.trim() || "",
              };
            }
            return loc;
          });
          formData.append("locations", JSON.stringify(locsToSave));
        }
      }
      if (data.storePhoneNumber?.trim()) {
        formData.append("storePhoneNumber", data.storePhoneNumber.trim());
      }
      formData.append("country", data.country || "");
      if (data.businessCity?.trim()) formData.append("businessCity", data.businessCity.trim());
      if (data.stateProvinceRegion?.trim()) {
        formData.append("stateProvince", data.stateProvinceRegion.trim());
        formData.append("stateProvinceRegion", data.stateProvinceRegion.trim());
      }
      if (data.zipCode?.trim()) {
        formData.append("zipCode", data.zipCode.trim());
      }
      formData.append("firstName", data.firstName || "");
      formData.append("lastName", data.lastName || "");
      if (data.jobTitle?.trim()) formData.append("jobTitle", data.jobTitle.trim());
      formData.append("businessEmail", data.businessEmail || "");
      formData.append("phoneNumber", data.phoneNumber || "");
      if (data.languages && data.languages.length > 0) {
        formData.append("languages", JSON.stringify(data.languages));
      }
      if (data.currency?.trim()) {
        formData.append("currency", data.currency.trim());
      }
      if (data.inventoryManagement?.trim()) {
        formData.append("inventoryManagement", data.inventoryManagement.trim());
      }
      formData.append("sameDayDelivery", String(data.sameDayDelivery ?? false));
      if (data.sameDayDelivery && data.orderProcessingTime?.trim()) {
        formData.append("orderProcessingTime", data.orderProcessingTime.trim());
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

  return {
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
  };
}

export type PartnerLeadFormState = ReturnType<typeof usePartnerLeadForm>;
