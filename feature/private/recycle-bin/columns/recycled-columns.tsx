import { StatusBadge } from "@/components/common/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { RecycleEntityType } from "../hooks/use-get-recycled-data";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { usersColumns } from "./recycled-users-columns";

export { usersColumns };

// Helper to create checkbox column
const createSelectColumn = (): ColumnDef<any> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
});

// Helper to create S.No column
const createSNoColumn = (): ColumnDef<any> => ({
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

// STORES COLUMNS
export const storesColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "storeName",
    header: "Store Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{row.original.storeName}</p>
        {row.original.address && (
          <p className="max-w-xs truncate text-xs text-slate-400">{row.original.address}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country / City",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {row.original.countryName || "N/A"}{" "}
        {row.original.cityName ? `/ ${row.original.cityName}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{row.original.contactNumber || "N/A"}</span>
    ),
  },
  {
    accessorKey: "storeStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.storeStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.storeStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="stores"
        entity={row.original}
        entityNameField="storeName"
      />
    ),
  },
];

// ITEMS COLUMNS
export const itemsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "productName",
    header: "Product Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">{row.original.productName}</p>
    ),
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600">
        {row.original.departmentName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600">
        {row.original.categoryName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        activeLabel="ACTIVE"
        displayLabel={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="items"
        entity={row.original}
        entityNameField="productName"
      />
    ),
  },
];

// DEPARTMENTS COLUMNS
export const departmentsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "departmentName",
    header: "Department Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">{row.original.departmentName}</p>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country / City",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.countryName || "Global"}{" "}
        {row.original.cityName ? `/ ${row.original.cityName}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        activeLabel="ACTIVE"
        displayLabel={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="departments"
        entity={row.original}
        entityNameField="departmentName"
      />
    ),
  },
];

// CATEGORIES COLUMNS
export const categoriesColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "categoryName",
    header: "Category Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">{row.original.categoryName}</p>
    ),
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{row.original.departmentName || "N/A"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        activeLabel="ACTIVE"
        displayLabel={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="categories"
        entity={row.original}
        entityNameField="categoryName"
      />
    ),
  },
];

// CITY MANAGERS COLUMNS
export const cityManagersColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "firstName",
    header: "Full Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-xs text-blue-600">{row.original.email}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{row.original.phoneNumber || "N/A"}</span>
    ),
  },
  {
    accessorKey: "assignedCityNames",
    header: "Assigned City",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.assignedCityNames || row.original.assignCities || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "managerStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.managerStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.managerStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell entityType="city-managers" entity={row.original} />
    ),
  },
];

// COUNTRY MANAGERS COLUMNS
export const countryManagersColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "firstName",
    header: "Full Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-xs text-blue-600">{row.original.email}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{row.original.phoneNumber || "N/A"}</span>
    ),
  },
  {
    accessorKey: "assignCountryName",
    header: "Assigned Country",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.assignCountryName || row.original.assignCountries || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "managerStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.managerStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.managerStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell entityType="country-managers" entity={row.original} />
    ),
  },
];

export const COLUMNS_BY_ENTITY: Record<RecycleEntityType, ColumnDef<any>[]> = {
  users: usersColumns as ColumnDef<any>[],
  stores: storesColumns,
  items: itemsColumns,
  departments: departmentsColumns,
  categories: categoriesColumns,
  "city-managers": cityManagersColumns,
  "country-managers": countryManagersColumns,
};
