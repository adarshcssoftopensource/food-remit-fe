export interface CreditsData {
  id: string;
  date: string;
  referenceNumber: string;
  receiverName: string;
  storeName: string;
  country: string;
  refundValue: string;
  status: "Pending" | "Completed" | "Rejected";
}
