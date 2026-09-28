import { RowSelectionState } from "@tanstack/react-table";
import { HistoryEntityType } from "../hooks/use-get-history-data";

export interface HistoryTableProps {
  entityType?: HistoryEntityType;
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
  onBulkPermanentDeleteClick?: () => void;
}
