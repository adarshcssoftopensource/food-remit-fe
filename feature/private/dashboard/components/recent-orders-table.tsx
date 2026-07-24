"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// This type is used to define the shape of our data.
export type Order = {
  id: string;
  customerName: string;
  email: string;
  location: string;
  status: "paid" | "pending" | "failed";
  deliveredTime: string;
  amount: number;
};

const data: Order[] = [
  {
    id: "SE7874341682",
    customerName: "Noel Hill",
    email: "noel@example.com",
    location: "2300 S Hamilton Road",
    status: "paid",
    deliveredTime: "Not Delivered Yet",
    amount: 19.48,
  },
  {
    id: "SE9283998077",
    customerName: "Kevin Hill",
    email: "kevin@example.com",
    location: "2300 S Hamilton Road",
    status: "paid",
    deliveredTime: "Not Delivered Yet",
    amount: 9.92,
  },
  {
    id: "SE3620470515",
    customerName: "Alex Mercer",
    email: "alex@example.com",
    location: "47 W 13th St, New York",
    status: "pending",
    deliveredTime: "Not Delivered Yet",
    amount: 17.66,
  },
  {
    id: "SE6644814868",
    customerName: "Sarah Connor",
    email: "sarah@example.com",
    location: "2300 S Hamilton Road",
    status: "paid",
    deliveredTime: "Not Delivered Yet",
    amount: 9.92,
  },
  {
    id: "SE1597417358",
    customerName: "John Doe",
    email: "john@example.com",
    location: "2300 S Hamilton Road",
    status: "failed",
    deliveredTime: "Not Delivered Yet",
    amount: 18.72,
  },
];

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("customerName") as string;
      const email = row.original.email;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{name}</span>
            <span className="text-xs text-slate-500">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-50 truncate" title={row.getValue("location")}>
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "paid" ? "default" : status === "pending" ? "secondary" : "destructive"
          }
          className={
            status === "paid"
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : status === "pending"
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveredTime",
    header: "Delivered Time",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">{row.getValue("deliveredTime")}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export function RecentOrdersTable() {
  return (
    <Card className="col-span-1 border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>A list of the most recent orders placed in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} searchKey="customerName" />
      </CardContent>
    </Card>
  );
}
