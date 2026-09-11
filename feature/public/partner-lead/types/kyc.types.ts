export interface KycConfigResponse {
  isConfigured: boolean;
  message?: string;
}

export interface CreateKycSessionPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  partnerLeadId?: string;
}

export interface CreateKycSessionResponse {
  message?: string;
  data: {
    sessionId: string;
    verificationUrl: string;
    sessionToken?: string;
    status: string;
    isConfigured: boolean;
  };
}

export interface KycStatusResponse {
  message?: string;
  data: {
    sessionId: string;
    status: string;
    action?: string;
    decisionCode?: string;
    isVerified: boolean;
  };
}

export interface VeriffApplicant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
}
