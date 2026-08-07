export interface AmountLimitData {
  id: string;
  countryName: string;
  amount: string;
  createdAt: string;
}

export const mockData: AmountLimitData[] = [
  {
    id: "1",
    countryName: "USA",
    amount: "5000.00",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    countryName: "Canada",
    amount: "3500.00",
    createdAt: "2024-01-18",
  },
];
