export type PartnerLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "REGISTRATION_INVITED"
  | "REGISTRATION_STARTED"
  | "APPROVED"
  | "NOT_QUALIFIED";

export interface KycPerson {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  idNumber?: string;
  nationality?: string;
  country?: string;
  gender?: string;
}

export interface KycDocument {
  type?: string;
  number?: string;
  country?: string;
  validUntil?: string;
}

export interface KycMediaItem {
  type: string;
  name?: string;
  mimeType?: string;
  s3Url: string;
  originalUrl?: string;
}

export interface KycVerificationRecord {
  id?: string;
  veriffSessionId: string;
  status: string;
  action?: string | null;
  decisionCode?: string | null;
  person?: KycPerson | null;
  document?: KycDocument | null;
  mediaUrls?: KycMediaItem[];
  createdAt?: string;
}

export interface BankVerificationRecord {
  id?: string;
  itemId?: string | null;
  institutionId?: string | null;
  institutionName?: string | null;
  accountName?: string | null;
  accountMask?: string | null;
  accountType?: string | null;
  accountSubtype?: string | null;
  status?: string;
  createdAt?: string;
  rawAccounts?: unknown;
}

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
  countryId?: string | null;
  cityId?: string | null;
  veriffSessionId?: string | null;
  kycStatus?: string | null;
  kycVerifiedAt?: string | null;
  kycData?: KycVerificationRecord | null;
  kycVerifications?: KycVerificationRecord[];
  plaidItemId?: string | null;
  plaidAccountId?: string | null;
  bankStatus?: string | null;
  bankVerifiedAt?: string | null;
  bankData?: BankVerificationRecord | null;
  bankVerifications?: BankVerificationRecord[];
  additionalDocuments?: Array<{
    url: string;
    name?: string;
    size?: number;
    mimeType?: string;
    uploadedAt?: string;
  }>;
}
