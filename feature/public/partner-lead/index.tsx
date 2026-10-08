"use client";

import { useSyncExternalStore } from "react";
import { PartnerLeadForm } from "./components/partner-lead-form";
import { PartnerLeadSuccess } from "./components/partner-lead-success";

const SUBMITTED_REF_KEY = "fr_submitted_partner_lead_ref";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("partner_lead_submitted", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("partner_lead_submitted", callback);
  };
}

function getSnapshot(): string | null {
  try {
    return sessionStorage.getItem(SUBMITTED_REF_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function PartnerLeadContainer() {
  const referenceNumber = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleSuccess = (ref: string) => {
    try {
      if (ref) {
        sessionStorage.setItem(SUBMITTED_REF_KEY, ref);
      }
    } catch {}
    window.dispatchEvent(new Event("partner_lead_submitted"));
  };

  const handleReset = () => {
    try {
      sessionStorage.removeItem(SUBMITTED_REF_KEY);
    } catch {}
    window.dispatchEvent(new Event("partner_lead_submitted"));
  };

  if (referenceNumber) {
    return <PartnerLeadSuccess referenceNumber={referenceNumber} onReset={handleReset} />;
  }

  return <PartnerLeadForm onSuccess={handleSuccess} />;
}
