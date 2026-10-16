"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

// Helper to create checkbox column
export const createSelectColumn = (isRowDisabled?: (item: any) => boolean): ColumnDef<any> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={table.getIsSomePageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => {
    const disabled = isRowDisabled ? isRowDisabled(row.original) : !row.getCanSelect();
    return (
      <div className="flex items-center" title={disabled ? "Managed via Store" : undefined}>
        <Checkbox
          checked={row.getIsSelected()}
          disabled={disabled}
          onCheckedChange={(value) => {
            if (!disabled) {
              row.toggleSelected(!!value);
            }
          }}
          aria-label="Select row"
          className={
            disabled ? "cursor-not-allowed opacity-40 data-[state=checked]:opacity-40" : ""
          }
        />
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
});

// Helper to create S.No column
export const createSNoColumn = (): ColumnDef<any> => ({
  id: "sno",
  header: "S.No",
  cell: ({ row, table }) => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    return pageIndex * pageSize + row.index + 1;
  },
  enableSorting: false,
  enableHiding: false,
});
