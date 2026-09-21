import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { Switch } from "@/components/ui/switch";
import { formatDateTime } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import Image from "next/image";
import { ProductBox } from "../types/product-box.types";

interface ProductBoxColumnsProps {
  onEdit: (box: ProductBox) => void;
  onDelete: (box: ProductBox) => void;
  onToggleStatus: (box: ProductBox, checked: boolean) => void;
  onView: (box: ProductBox) => void;
  onImageClick?: (image: string) => void;
}

export const getProductBoxColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  onImageClick,
}: ProductBoxColumnsProps): ColumnDef<ProductBox>[] => [
  {
    accessorKey: "sno",
    header: "Sr no",
    cell: ({ row }) => <div className="text-muted-foreground">{row.index + 1}</div>,
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      return (
        <div className="bg-muted group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={row.original.title}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
              {onImageClick && (
                <button
                  onClick={() => onImageClick(imageUrl)}
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
            <div className="text-muted-foreground text-xs">No image</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="text-foreground font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className="text-foreground font-medium">${row.original.price}</div>,
  },
  {
    accessorKey: "addedOn",
    header: "Created On",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{formatDateTime(row.original.addedOn)}</div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const box = row.original;
      const actionItems: DataTableRowActionItem[] = [
        {
          label: "View Box",
          icon: <Eye className="size-4" />,
          onClick: () => onView(box),
        },
        {
          label: "Edit Box",
          icon: <Pencil className="size-4" />,
          onClick: () => onEdit(box),
        },
        {
          label: "Delete Box",
          icon: <Trash2 className="size-4" />,
          onClick: () => onDelete(box),
          variant: "destructive",
        },
      ];

      return (
        <div className="flex items-center gap-2">
          <DataTableRowActions items={actionItems} />
          <div className="ml-1">
            <Switch
              checked={box.status}
              onCheckedChange={(checked) => onToggleStatus(box, checked)}
              title={box.status ? "Active" : "Inactive"}
            />
          </div>
        </div>
      );
    },
  },
];
