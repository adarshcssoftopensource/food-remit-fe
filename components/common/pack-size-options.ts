export type PackSizeOptionRow = {
  key: string;
  id?: string;
  optionName: string;
  quantityPerPack?: string;
  netWeight?: string;
  weightUnit: string;
  price?: string;
  _isSingleReadOnly?: boolean;
};

export type PackSizeOptionErrors = Partial<Record<keyof PackSizeOptionRow, string>>;

export function createPackSizeOptionRow(
  overrides: Partial<PackSizeOptionRow> = {},
): PackSizeOptionRow {
  return {
    key: `pack-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    optionName: "",
    quantityPerPack: "",
    netWeight: "",
    weightUnit: "",
    price: "",
    ...overrides,
  };
}
