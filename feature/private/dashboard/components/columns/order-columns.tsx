"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { DashboardOrderRequested } from "../../types/dashboard.types";

export const orderColumnsRequest: ColumnDef<DashboardOrderRequested>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
  },
  {
    accessorKey: "deliveredTime",
    header: "Delivered Time",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
