import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ProductBox } from "../types/product-box.types";

interface ProductBoxColumnsProps {
  onEdit: (box: ProductBox) => void;
  onDelete: (box: ProductBox) => void;
  onToggleStatus: (box: ProductBox, checked: boolean) => void;
  onView: (box: ProductBox) => void;
}

export const getProductBoxColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
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
        <div className="bg-muted flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.title}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
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
    cell: ({ row }) => <div className="text-foreground font-medium">${row.original.price}</div>, // Currency symbol usually comes from store, using $ for now or formatting
  },
  {
    accessorKey: "addedOn",
    header: "Created On",
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.addedOn}</div>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const box = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="View Box" onClick={() => onView(box)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit Box" onClick={() => onEdit(box)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Delete Box"
            onClick={() => onDelete(box)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="ml-2">
            <Switch
              checked={box.status}
              onCheckedChange={(checked) => onToggleStatus(box, checked)}
            />
          </div>
        </div>
      );
    },
  },
];
