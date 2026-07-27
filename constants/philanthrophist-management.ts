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

export const PHILANTHROPIST_COUNTRIES = ["India", "United States", "United Kingdom"];
export const PHILANTHROPIST_CITIES = ["Mumbai", "Delhi", "London", "New York"];
