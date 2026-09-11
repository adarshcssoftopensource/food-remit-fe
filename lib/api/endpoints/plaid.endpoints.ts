export const PLAID_ENDPOINTS = {
  CONFIG: "plaid/config",
  CREATE_LINK_TOKEN: "plaid/create-link-token",
  EXCHANGE_PUBLIC_TOKEN: "plaid/exchange-public-token",
  GET_VERIFICATION: (id: string) => `plaid/verification/${id}`,
} as const;
