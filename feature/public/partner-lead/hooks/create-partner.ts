import { useApiMutation } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { PartnerLeadFormValues } from "../schema/partner-lead.schema";

export type PartnerLeadSubmitPayload = PartnerLeadFormValues & {
  stateProvince?: string;
  website?: string;
  additionalInfo?: string;
};

export function useCreatePartnerLead() {
  return useApiMutation<
    {
      data: {
        referenceNumber?: string;
        message?: string;
      };
    },
    PartnerLeadSubmitPayload
  >("post", PARTNER_LEAD_ENDPOINTS.SUBMIT_LEAD, {});
}
