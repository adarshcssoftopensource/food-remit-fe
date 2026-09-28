import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ProductBoxItem } from "../types/product-box.types";

interface ProductBoxItemColumnsProps {
  onRemove: (item: ProductBoxItem) => void;
  onImageClick?: (image: string) => void;
}

export const getProductBoxItemColumns = ({
  onRemove,
  onImageClick,
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
          <div className="bg-muted group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
            {imgUrl ? (
              <>
                <Image
                  src={imgUrl}
                  alt={item?.productName || "Product image"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
                {onImageClick && (
                  <button
                    onClick={() => onImageClick(imgUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100"
                    title="View full screen"
                  >
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </button>
                )}
              </>
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
      <div className="text-muted-foreground">
        {formatDateTime(row.original.item?.createdAt) || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="icon"
          title="Remove from Box"
          onClick={() => onRemove(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
