"use client";

import { Card } from "@/components/ui/card";
import { AdditionalDocumentsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/additional-documents-card";
import { KycVerificationCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/kyc-verification-card";
import { LocationDetailsCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/location-details-card";
import { OperationalPreferencesCard } from "@/feature/private/(store-admin)/partner-leads/components/cards/operational-preferences-card";
import { ProfileBankVerification } from "@/feature/private/(shared)/profile/components/profile-bank-verification";

import { useStoreInformation } from "../hooks/use-store-information";
import { StoreDetailsCard } from "./store-info/store-details-card";
import { StoreLocationCard } from "./store-info/store-location-card";
import { StoreFulfillmentCard } from "./store-info/store-fulfillment-card";
import { StoreFloatingSaveBar } from "./store-info/store-floating-save-bar";
import { StoreImageConfirmDialog } from "./store-info/store-image-confirm-dialog";

export function StoreInformation() {
  const {
    storeData,
    storeId,
    needsBankVerification,
    isEmployee,
    isLoading,
    isMobile,
    sidebarOffset,
    control,
    errors,
    isDirty,
    handleSubmit,
    setValue,
    getValues,
    onSubmit,
    isPending,
    effectiveBusinessType,
    storeEmail,
    activePhoneIso,
    setPhoneIso,
    handleBusinessTypeSelect,
    imageConfirmOpen,
    setImageConfirmOpen,
    pendingBusinessType,
    setPendingBusinessType,
    handleConfirmUseRecommended,
    handleConfirmKeepExisting,
    partnerLead,
  } = useStoreInformation();

  if (isLoading) {
    return (
      <Card className="flex h-64 items-center justify-center rounded-3xl border border-white/60 bg-white/50 p-8 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700" />
      </Card>
    );
  }

  if (!storeId) return null;

  return (
    <div className="space-y-6 pb-28">
      <form id="store-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <fieldset
          disabled={needsBankVerification}
          className="min-w-0 space-y-6 border-0 p-0 disabled:opacity-90"
        >
          <StoreDetailsCard
            control={control}
            errors={errors}
            needsBankVerification={needsBankVerification}
            isEmployee={isEmployee}
            storeIdDisplay={storeData?.storeId}
            effectiveBusinessType={effectiveBusinessType}
            onBusinessTypeSelect={handleBusinessTypeSelect}
            storeEmail={storeEmail}
            activePhoneIso={activePhoneIso}
            onPhoneIsoChange={setPhoneIso}
          />

          <StoreLocationCard
            control={control}
            errors={errors}
            setValue={setValue}
            onPhoneIsoChange={setPhoneIso}
          />

          <StoreFulfillmentCard
            control={control}
            errors={errors}
            setValue={setValue}
            isEmployee={isEmployee}
          />
        </fieldset>
      </form>

      <div className="grid max-w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileBankVerification />
        {partnerLead && <KycVerificationCard lead={partnerLead} />}
        <div className="min-w-0 md:col-span-2">
          <OperationalPreferencesCard lead={partnerLead} hideFulfillmentAndScreening />
        </div>
        {partnerLead && <AdditionalDocumentsCard lead={partnerLead} />}
        {partnerLead && <LocationDetailsCard lead={partnerLead} />}
      </div>

      {!needsBankVerification && (
        <StoreFloatingSaveBar
          isMobile={isMobile}
          sidebarOffset={sidebarOffset}
          isDirty={isDirty}
          isPending={isPending}
        />
      )}

      <StoreImageConfirmDialog
        open={imageConfirmOpen}
        pendingBusinessType={pendingBusinessType}
        currentStoreImage={getValues("storeImage")}
        onOpenChange={(open) => {
          setImageConfirmOpen(open);
          if (!open) {
            setPendingBusinessType(null);
          }
        }}
        onConfirmUseRecommended={handleConfirmUseRecommended}
        onConfirmKeepExisting={handleConfirmKeepExisting}
      />
    </div>
  );
}
