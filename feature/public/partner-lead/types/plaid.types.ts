export interface PlaidConfigResponse {
  isConfigured: boolean;
  environment?: string;
  message?: string;
}

export interface CreatePlaidLinkTokenPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  partnerLeadId?: string;
}

export interface CreatePlaidLinkTokenResponse {
  linkToken: string;
  expiration?: string;
  requestId?: string;
  isSimulated?: boolean;
}

export interface ExchangePlaidTokenPayload {
  publicToken: string;
  institutionId?: string;
  institutionName?: string;
  accounts?: Record<string, unknown>[];
  partnerLeadId?: string;
}

export interface ExchangePlaidTokenResponse {
  message?: string;
  data: {
    itemId: string;
    institutionName: string;
    accountName: string;
    accountMask: string;
    accountType?: string;
    status: string;
  };
}

export interface VerifiedBankInfo {
  itemId?: string;
  institutionName?: string;
  accountName?: string;
  accountMask?: string;
}

export interface PlaidApplicant {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
}
