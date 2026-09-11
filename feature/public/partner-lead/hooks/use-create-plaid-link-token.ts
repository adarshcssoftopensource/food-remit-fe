import { useApiMutation } from "@/hooks/useApi";
import { PLAID_ENDPOINTS } from "@/lib/api/endpoints/plaid.endpoints";
import { CreatePlaidLinkTokenPayload, CreatePlaidLinkTokenResponse } from "../types/plaid.types";

export function useCreatePlaidLinkToken() {
  return useApiMutation<CreatePlaidLinkTokenResponse, CreatePlaidLinkTokenPayload>(
    "post",
    PLAID_ENDPOINTS.CREATE_LINK_TOKEN,
  );
}
