import { StatusBadge } from "@/components/common/status-badge";
import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { getStatusColor } from "@/constants/partner.leads";
import { RecycleEntityType } from "../hooks/use-get-recycled-data";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { withDeletedByColumn } from "../components/deleted-by-cell";
import { usersColumns as rawUsersColumns } from "./recycled-users-columns";
import { Store, User } from "lucide-react";

export const usersColumns = withDeletedByColumn(rawUsersColumns as ColumnDef<any>[], true);

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
        <p className="font-semibold text-slate-900 capitalize dark:text-white">
          {row.original.storeName}
        </p>
        <p className="max-w-xs truncate text-xs text-slate-400">{row.original.storeAddress}</p>
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
      <span className="text-xs text-slate-600">
        {`${row.original.storeCountryCode} ${row.original.storePhoneNumber}` || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "storeStatus",
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
    accessorKey: "storeName",
    header: "Vendor / Store",
    cell: ({ row }) => {
      const storeName =
        row.original.storeName ||
        row.original.store?.storeName ||
        row.original.department?.store?.storeName;
      const vendorName =
        row.original.vendorName ||
        row.original.store?.vendorName ||
        (row.original.store?.storeManager
          ? `${row.original.store.storeManager.firstName || ""} ${row.original.store.storeManager.lastName || ""}`.trim() ||
            row.original.store.storeManager.email
          : null);

      if (!storeName && !vendorName) {
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Global / Platform
          </span>
        );
      }

      return (
        <div className="flex min-w-[130px] flex-col gap-0.5">
          {storeName && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
              <Store className="text-primary h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[180px] truncate text-xs" title={storeName}>
                {storeName}
              </span>
            </div>
          )}
          {vendorName && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <User className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="max-w-[180px] truncate" title={vendorName}>
                {vendorName}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600">
        {row.original.department?.departmentName || row.original.departmentDisplayName || "N/A"}
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
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {row.original.countryName || "Global"}{" "}
          {row.original.cityName ? `/ ${row.original.cityName}` : ""}
        </span>
        {row.original.storeName && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Store className="h-3 w-3 shrink-0 text-slate-400" />
            {row.original.storeName}
          </span>
        )}
      </div>
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
  users: usersColumns,
  stores: withDeletedByColumn(storesColumns, true),
  items: withDeletedByColumn(itemsColumns, true),
  departments: withDeletedByColumn(departmentsColumns, true),
  categories: withDeletedByColumn(categoriesColumns, true),
  "city-managers": withDeletedByColumn(cityManagersColumns, true),
  "country-managers": withDeletedByColumn(countryManagersColumns, true),
  employees: withDeletedByColumn(
    [
      createSNoColumn(),
      createSelectColumn(),
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => (
          <ImageNameCell
            name={`${row.original.firstName} ${row.original.lastName}`}
            image={row.original.image || undefined}
            type="profile"
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RecycledEntityActionsCell entityType="employees" entity={row.original} />
        ),
      },
    ],
    true,
  ),
  "partner-leads": withDeletedByColumn(
    [
      createSNoColumn(),
      createSelectColumn(),
      {
        accessorKey: "referenceNumber",
        header: "Ref No.",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.original.referenceNumber}
          </span>
        ),
      },
      {
        accessorKey: "businessName",
        header: "Business Name",
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900 capitalize dark:text-white">
              {row.original.businessName}
            </p>
            <p className="max-w-xs truncate text-xs text-slate-400">
              {row.original.businessType || "N/A"}{" "}
              {row.original.businessCity ? `• ${row.original.businessCity}` : ""}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex flex-col text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {data.firstName} {data.lastName}
              </span>
              <span className="text-muted-foreground text-xs">{data.businessEmail}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {row.original.phoneNumber || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date Applied",
        enableSorting: true,
        cell: ({ row }) => {
          const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
          return (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {date && !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status as string;
          return (
            <span
              className={`focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getStatusColor(status)}`}
            >
              {status?.replace(/_/g, " ") || "N/A"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RecycledEntityActionsCell
            entityType="partner-leads"
            entity={row.original}
            entityNameField="businessName"
          />
        ),
      },
    ],
    true,
  ),
  "product-boxes": withDeletedByColumn(
    [
      createSNoColumn(),
      createSelectColumn(),
      {
        accessorKey: "title",
        header: "Box Title",
        enableSorting: true,
        cell: ({ row }) => (
          <ImageNameCell
            name={row.original.title}
            image={row.original.image || undefined}
            type="logo"
          />
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            ${row.original.price ?? "0.00"}
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
            entityType="product-boxes"
            entity={row.original}
            entityNameField="title"
          />
        ),
      },
    ],
    true,
  ),
};
