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
