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
  status: string;
  statusRemark: string | null;
  createdAt: string;
}
