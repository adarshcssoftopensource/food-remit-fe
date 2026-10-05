export type CsvImportResult = {
  title: string;
  description?: string;
  createdCount?: number;
  updatedCount?: number;
  categoriesCreated?: number;
  errors?: string[];
  warnings?: string[];
  isError?: boolean;
};
