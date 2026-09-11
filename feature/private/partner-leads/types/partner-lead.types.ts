export type PartnerLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "REGISTRATION_INVITED"
  | "REGISTRATION_STARTED"
  | "APPROVED"
  | "NOT_QUALIFIED";

export interface PartnerLeadData {
  id: string;
  referenceNumber: string;
  businessName: string;
  businessType: string;
  locationsCount: string;
  businessCity: string | null;
  stateProvince: string | null;
  country: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  businessEmail: string;
  phoneNumber: string;
  workPreferences: string[];
  inventoryManagement: string | null;
  website: string | null;
  additionalInfo: string | null;
  agreeToContact: boolean;
  status: PartnerLeadStatus;
  statusRemark: string | null;
  createdAt: string;
  veriffSessionId?: string | null;
  kycStatus?: string | null;
  kycVerifiedAt?: string | null;
  kycData?: any;
  kycVerifications?: Array<{
    id: string;
    veriffSessionId: string;
    status: string;
    action?: string | null;
    decisionCode?: string | null;
    person?: any;
    document?: any;
    mediaUrls?: Array<{
      type: string;
      name?: string;
      mimeType?: string;
      s3Url: string;
      originalUrl?: string;
    }>;
    createdAt: string;
  }>;
  plaidItemId?: string | null;
  plaidAccountId?: string | null;
  bankStatus?: string | null;
  bankVerifiedAt?: string | null;
  bankData?: any;
  bankVerifications?: Array<{
    id: string;
    itemId?: string | null;
    institutionName?: string | null;
    accountName?: string | null;
    accountMask?: string | null;
    accountType?: string | null;
    accountSubtype?: string | null;
    status: string;
    createdAt: string;
  }>;
}
