import { useApiMutation } from "@/hooks/useApi";
import { PLAID_ENDPOINTS } from "@/lib/api/endpoints/plaid.endpoints";
import { ExchangePlaidTokenPayload, ExchangePlaidTokenResponse } from "../types/plaid.types";

export function useExchangePlaidToken() {
  return useApiMutation<ExchangePlaidTokenResponse, ExchangePlaidTokenPayload>(
    "post",
    PLAID_ENDPOINTS.EXCHANGE_PUBLIC_TOKEN,
  );
}
