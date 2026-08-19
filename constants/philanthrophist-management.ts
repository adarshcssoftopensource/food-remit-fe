export type Philanthrophist = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  totalDonation: number;
  status: "Active" | "Inactive";
  country: string;
  city: string;
  registeredOn: string;
};

export const PHILANTHROPHISTS: Philanthrophist[] = [];
