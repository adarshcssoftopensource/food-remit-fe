import { useApiMutation } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { PartnerLeadFormValues } from "../schema/partner-lead.schema";

export function useCreatePartnerLead() {
  return useApiMutation<
    {
      data: {
        referenceNumber?: string;
        message?: string;
      };
    },
    PartnerLeadFormValues
  >("post", PARTNER_LEAD_ENDPOINTS.SUBMIT_LEAD, {});
}
