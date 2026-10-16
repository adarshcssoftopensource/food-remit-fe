"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CopyButton } from "@/components/common/copy-button";
import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { BASKET_STATUS_META, getBasketImage } from "@/constants/basket.constants";
import { getStatusColor } from "@/constants/partner-leads";
import type { BasketStatus } from "@/feature/private/(store-admin)/basket-management/types/basket.types";
import { formatMoney } from "@/feature/private/(store-admin)/basket-management/utils/basket-format";
import { formatDate } from "@/lib/date";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";

// EMPLOYEES COLUMNS
export const employeesColumns: ColumnDef<any>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-blue-600">
        <span>{row.original.email}</span>
        <CopyButton
          value={row.original.email}
          label="Email"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const phone =
        `${row.original.countryCode ? (row.original.countryCode.startsWith("+") ? row.original.countryCode : `+${row.original.countryCode}`) : ""} ${row.original.phoneNumber || ""}`.trim();
      return (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span>{phone || "N/A"}</span>
          {row.original.phoneNumber ? (
            <CopyButton
              value={phone}
              label="Contact"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          ) : null}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RecycledEntityActionsCell entityType="employees" entity={row.original} />,
  },
];

// PARTNER LEADS COLUMNS
export const partnerLeadsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn((item) => item?.status === "APPROVED"),
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>{row.original.referenceNumber}</span>
        <CopyButton
          value={row.original.referenceNumber}
          label="Reference Number"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
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
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <TruncatedTextCell
              text={data.businessEmail}
              truncateAfterAt
              className="cursor-default"
            />
            <CopyButton
              value={data.businessEmail}
              label="Email"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
        <span>{row.original.phoneNumber || "N/A"}</span>
        {row.original.phoneNumber && row.original.phoneNumber !== "N/A" ? (
          <CopyButton
            value={row.original.phoneNumber}
            label="Phone"
            className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Applied",
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
      return (
        <div className="text-xs text-slate-600 dark:text-slate-400">{formatDate(date, "N/A")}</div>
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
];

// BASKETS COLUMNS
export const basketsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "name",
    header: "Basket Name",
    enableSorting: true,
    cell: ({ row }) => (
      <ImageNameCell name={row.original.name} image={getBasketImage(row.original)} type="logo" />
    ),
  },
  {
    accessorKey: "store",
    header: "Store",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 dark:text-slate-300">
        {row.original.store?.storeName ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: ({ row }) => <span className="text-xs font-semibold">{row.original.itemCount ?? 0}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const symbol = row.original.currencySymbol || getCurrencySymbol(row.original.currency, "₱");
      return (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {formatMoney(row.original.price, symbol)}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as BasketStatus;
      return (
        <StatusBadge
          status={status}
          activeLabel="ACTIVE"
          displayLabel={BASKET_STATUS_META[status]?.label ?? status}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="baskets"
        entity={row.original}
        entityNameField="name"
      />
    ),
  },
];

// SUB ADMINS COLUMNS
export const subAdminsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "name",
    header: "User Name",
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.original.name || row.original.userName || "Admin";
      const initials = name
        .split(/[\s-_]/)
        .map((w: string) => w[0]?.toUpperCase())
        .slice(0, 2)
        .join("");
      return (
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-800 capitalize dark:text-slate-200">
            {name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => {
      const isCoAdmin =
        row.original.role === "CO_ADMIN" ||
        row.original.userType === "CO_ADMIN" ||
        row.original.userType === 1;
      return (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isCoAdmin ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {isCoAdmin ? "Co Admin" : "Sub Admin"}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-blue-600 hover:underline">{row.original.email}</span>
        <CopyButton
          value={row.original.email}
          label="Email"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact Number",
    enableSorting: true,
    cell: ({ row }) => {
      const phone = row.original.phoneNumber || row.original.contactNumber;
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-slate-700 dark:text-slate-300">{phone || "N/A"}</span>
          {phone ? (
            <CopyButton
              value={phone}
              label="Contact Number"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
      return (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {formatDate(date, "N/A")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell
        entityType="sub-admins"
        entity={row.original}
        entityNameField="name"
      />
    ),
  },
];
