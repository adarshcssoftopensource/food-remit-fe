export const KYC_ENDPOINTS = {
  CONFIG: "kyc/veriff/config",
  CREATE_SESSION: "kyc/veriff/session",
  GET_STATUS: (sessionId: string) => `kyc/veriff/session/${sessionId}/status`,
  GET_DETAILS: (sessionId: string) => `kyc/veriff/session/${sessionId}/details`,
  SIMULATE: (sessionId: string) => `kyc/veriff/simulate/${sessionId}`,
} as const;
