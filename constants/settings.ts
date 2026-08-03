export type CountryData = {
  id: string;
  countryName: string;
  addedOn: string;
};

export type CityData = {
  id: string;
  countryId: string;
  countryName: string;
  cityName: string;
  addedOn: string;
};

export type ProcessingFeeData = {
  id: string;
  countryName: string;
  processingFee: string;
};

export const MOCK_COUNTRIES: CountryData[] = [
  { id: "1", countryName: "United States", addedOn: "2024-01-15" },
  { id: "2", countryName: "United Kingdom", addedOn: "2024-01-16" },
  { id: "3", countryName: "Canada", addedOn: "2024-01-17" },
  { id: "4", countryName: "Australia", addedOn: "2024-01-18" },
  { id: "5", countryName: "India", addedOn: "2024-01-19" },
  { id: "6", countryName: "Germany", addedOn: "2024-01-20" },
  { id: "7", countryName: "France", addedOn: "2024-01-21" },
  { id: "8", countryName: "Japan", addedOn: "2024-01-22" },
  { id: "9", countryName: "China", addedOn: "2024-01-23" },
  { id: "10", countryName: "Brazil", addedOn: "2024-01-24" },
];

export const MOCK_COUNTRIES_FOR_SELECT = [
  { id: "1", countryName: "United States" },
  { id: "2", countryName: "United Kingdom" },
  { id: "3", countryName: "Canada" },
  { id: "4", countryName: "Australia" },
  { id: "5", countryName: "India" },
  { id: "6", countryName: "Germany" },
  { id: "7", countryName: "France" },
  { id: "8", countryName: "Japan" },
];

export const MOCK_CITIES: CityData[] = [
  {
    id: "1",
    countryId: "1",
    countryName: "United States",
    cityName: "New York",
    addedOn: "2024-01-15",
  },
  {
    id: "2",
    countryId: "1",
    countryName: "United States",
    cityName: "Los Angeles",
    addedOn: "2024-01-16",
  },
  {
    id: "3",
    countryId: "1",
    countryName: "United States",
    cityName: "Chicago",
    addedOn: "2024-01-17",
  },
  {
    id: "4",
    countryId: "2",
    countryName: "United Kingdom",
    cityName: "London",
    addedOn: "2024-01-18",
  },
  {
    id: "5",
    countryId: "2",
    countryName: "United Kingdom",
    cityName: "Manchester",
    addedOn: "2024-01-19",
  },
  {
    id: "6",
    countryId: "3",
    countryName: "Canada",
    cityName: "Toronto",
    addedOn: "2024-01-20",
  },
  {
    id: "7",
    countryId: "3",
    countryName: "Canada",
    cityName: "Vancouver",
    addedOn: "2024-01-21",
  },
  {
    id: "8",
    countryId: "4",
    countryName: "Australia",
    cityName: "Sydney",
    addedOn: "2024-01-22",
  },
  {
    id: "9",
    countryId: "5",
    countryName: "India",
    cityName: "Mumbai",
    addedOn: "2024-01-23",
  },
  {
    id: "10",
    countryId: "5",
    countryName: "India",
    cityName: "Delhi",
    addedOn: "2024-01-24",
  },
];

export const MOCK_PROCESSING_FEES: ProcessingFeeData[] = [
  { id: "1", countryName: "Afghanistan", processingFee: "0.00" },
  { id: "2", countryName: "Albania", processingFee: "Lek 10.00" },
  { id: "3", countryName: "Algeria", processingFee: "10.00" },
  { id: "4", countryName: "American Samoa", processingFee: "$0.00" },
  { id: "5", countryName: "Andorra", processingFee: "€0.00" },
  { id: "6", countryName: "Angola", processingFee: "Kz 0.00" },
  { id: "7", countryName: "Anguilla", processingFee: "$2.00" },
  { id: "8", countryName: "Antarctica", processingFee: "0.00" },
  { id: "9", countryName: "Antigua And Barbuda", processingFee: "$0.00" },
  { id: "10", countryName: "Argentina", processingFee: "$0.00" },
  { id: "11", countryName: "Armenia", processingFee: "0.00" },
  { id: "12", countryName: "Aruba", processingFee: "$0.00" },
  { id: "13", countryName: "Australia", processingFee: "$0.00" },
  { id: "14", countryName: "Austria", processingFee: "€0.00" },
  { id: "15", countryName: "Azerbaijan", processingFee: "0.00" },
];
