import { fetcher } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";

export async function checkEmailExists(email: string, skipToast = true) {
  return fetcher<{ exists: boolean; isValidDomain: boolean }>({
    method: "get",
    url: PARTNER_LEAD_ENDPOINTS.CHECK_EMAIL(email),
    skipErrorToast: skipToast,
  });
}
