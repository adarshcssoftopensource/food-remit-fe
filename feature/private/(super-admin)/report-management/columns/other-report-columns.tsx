import type {
  CouponReportRow,
  CustomerReportRow,
  OrderReportRow,
  StoreTransactionRow,
} from "@/constants/report-management";
import { ColumnDef } from "@tanstack/react-table";

export const customerReportColumns: ColumnDef<CustomerReportRow>[] = [
  {
    id: "sno",
    header: "S.no",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "email", header: "Email Address" },
  { accessorKey: "phoneNumber", header: "Phone Number" },
  { accessorKey: "ordersSent", header: "No of orders Sent" },
  { accessorKey: "ordersRequested", header: "No of orders Requested" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "city", header: "City" },
  {
    id: "viewOrders",
    header: "View Orders",
    cell: () => <span className="text-muted-foreground text-sm">—</span>,
  },
];

export const orderReportColumns: ColumnDef<OrderReportRow>[] = [
  {
    id: "sno",
    header: "S.no",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  { accessorKey: "referenceNumber", header: "Reference Number" },
  { accessorKey: "senderName", header: "Sender Name" },
  { accessorKey: "receiverName", header: "Receiver Name" },
  { accessorKey: "storeName", header: "Store Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "handedOverBy", header: "Handed over by" },
  {
    id: "viewDetails",
    header: "View Details",
    cell: () => <span className="text-muted-foreground text-sm">—</span>,
  },
];

export const couponReportColumns: ColumnDef<CouponReportRow>[] = [
  { accessorKey: "coupons", header: "Coupons" },
  { accessorKey: "couponCode", header: "Coupon Code" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "createdOn", header: "Created On" },
  { accessorKey: "availableCount", header: "Count of coupons available" },
  { accessorKey: "usedCount", header: "Count of User Used Coupon" },
  { accessorKey: "discount", header: "Discount(%)" },
];

export const storeTransactionColumns: ColumnDef<StoreTransactionRow>[] = [
  {
    id: "sno",
    header: "S.no",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  { accessorKey: "transactionNo", header: "Transaction No." },
  { accessorKey: "senderName", header: "Sender Name" },
  { accessorKey: "senderPhone", header: "Sender telephone number" },
  { accessorKey: "senderCountry", header: "Sender Country" },
  { accessorKey: "senderState", header: "Sender State" },
  { accessorKey: "senderCity", header: "Sender City" },
  { accessorKey: "receiverName", header: "Receiver Name" },
  { accessorKey: "receiverCountry", header: "Receiver Country" },
  { accessorKey: "receiverState", header: "Receiver State" },
  { accessorKey: "receiverCity", header: "Receiver City" },
  { accessorKey: "totalSales", header: "Total Sales" },
  { accessorKey: "platformEarning", header: "Platform Earning" },
  { accessorKey: "totalItemTax", header: "Total Item Tax" },
  { accessorKey: "totalProcessingFees", header: "Total Processing Fees" },
  { accessorKey: "refundedAmount", header: "Refunded Amount" },
];
