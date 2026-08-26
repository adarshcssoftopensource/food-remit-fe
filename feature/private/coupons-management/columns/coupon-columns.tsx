import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { CouponRow } from "@/constants/coupons-managemant";
import { ColumnDef } from "@tanstack/react-table";
import { Edit3, Eye } from "lucide-react";

export const couponColumns: ColumnDef<CouponRow>[] = [
  {
    id: "srNo",
    header: "Sr.No",
    cell: ({ row, table }) => (
      <span>
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "couponCode",
    header: "Coupon Code",
  },
  {
    accessorKey: "discount",
    header: "Discount(%)",
    cell: ({ getValue }) => <span>{getValue<number>()}%</span>,
  },
  {
    accessorKey: "createdBy",
    header: "Created/Edited by",
  },
  {
    accessorKey: "createdName",
    header: "Created Name",
  },
  {
    accessorKey: "createdOn",
    header: "Created/Edited on",
  },
  {
    accessorKey: "availableCount",
    header: "Coupons Available",
  },
  {
    accessorKey: "redeemedCoupons",
    header: "Redeemed Coupons",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <StatusBadge status={value} />;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: () => (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="icon">
          <Eye size={20} />
        </Button>
        <Button variant="outline" size="icon">
          <Edit3 size={20} />
        </Button>
      </div>
    ),
  },
];
