"use client";

import { useState } from "react";
import { PartnerLeadForm } from "./components/partner-lead-form";
import { PartnerLeadSuccess } from "./components/partner-lead-success";

export function PartnerLeadContainer() {
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  if (referenceNumber) {
    return (
      <PartnerLeadSuccess
        referenceNumber={referenceNumber}
        onReset={() => setReferenceNumber(null)}
      />
    );
  }

  return <PartnerLeadForm onSuccess={(ref) => setReferenceNumber(ref)} />;
}
