export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  image?: string;
  accountStatus: "ACTIVE" | "INACTIVE";
  addedOnTimestamp?: string;
}

export interface GetEmployeesResponse {
  message: string;
  status: boolean;
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
