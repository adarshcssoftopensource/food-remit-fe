import { fetcher } from "@/hooks/useApi";
import { PLAID_ENDPOINTS } from "@/lib/api/endpoints/plaid.endpoints";

export async function fetchBankVerification(id: string) {
  return fetcher<{ data: Record<string, unknown> }>({
    method: "get",
    url: PLAID_ENDPOINTS.GET_VERIFICATION(id),
  });
}
