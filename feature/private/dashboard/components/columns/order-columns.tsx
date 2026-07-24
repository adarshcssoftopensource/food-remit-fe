"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Order = {
  orderId: string;
  customerName: string;
  location: string;
  orderStatus: string;
  deliveredTime: string;
  price: string;
};

export const orderColumnsRequest: ColumnDef<Order>[] = [
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
