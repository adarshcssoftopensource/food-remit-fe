import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ProductBoxItem } from "../types/product-box.types";

interface ProductBoxItemColumnsProps {
  onRemove: (item: ProductBoxItem) => void;
}

export const getProductBoxItemColumns = ({
  onRemove,
}: ProductBoxItemColumnsProps): ColumnDef<ProductBoxItem>[] => [
  {
    accessorKey: "sno",
    header: "S.no",
    cell: ({ row }) => <div className="text-muted-foreground">{row.index + 1}</div>,
  },
  {
    accessorKey: "item.productName",
    header: "Product Name",
    cell: ({ row }) => {
      const item = row.original.item;
      let imgUrl = item?.productImage || null;
      if (imgUrl) {
        try {
          const parsed = JSON.parse(imgUrl);
          if (Array.isArray(parsed) && parsed.length > 0) {
            imgUrl = parsed[0];
          }
        } catch (e) {
          // not JSON, use as is
        }
      }

      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={item?.productName || "Product image"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-[10px]">No img</span>
            )}
          </div>
          <span className="font-medium">{item?.productName || "Unknown"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "item.department.departmentName",
    header: "Department",
    cell: ({ row }) => <div>{row.original.item?.department?.departmentName || "-"}</div>,
  },
  {
    accessorKey: "item.category.categoryName",
    header: "Category",
    cell: ({ row }) => <div>{row.original.item?.category?.categoryName || "-"}</div>,
  },
  {
    accessorKey: "item.createdBy",
    header: "Created/Edited by",
    cell: ({ row }) => <div>{row.original.item?.createdBy ? "Admin" : "-"}</div>,
  },
  {
    accessorKey: "item.createdAt",
    header: "Created/Edited On",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.item?.createdAt || "-"}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          title="Remove from Box"
          onClick={() => onRemove(row.original)}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
