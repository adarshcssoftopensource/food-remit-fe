import { RowSelectionState } from "@tanstack/react-table";
import { RecycleEntityType } from "../hooks/use-get-recycled-data";

export interface RecycleBinStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  isLoading: boolean;
}

export interface RecycleBinFiltersProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  status: string | null;
  isLoading: boolean;
  hasFilters: boolean;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  onStatusChange: (status: string | null) => void;
  onClearFilters: () => void;
}

export interface RecycleBinTableProps {
  entityType?: RecycleEntityType;
  data: any[];
  isLoading: boolean;
  searchValue: string;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  rowSelection: RowSelectionState;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onSortingChange: (sorting: any) => void;
  onRowSelectionChange: (
    selection: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void;
  onBulkRestoreClick: () => void;
  onBulkPermanentDeleteClick?: () => void;
}
