"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { ArrowLeft, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ItemDetailsCard } from "./components/item-details-card";
import { ItemMediaCard } from "./components/item-media-card";
import { ItemPlacementsCard } from "./components/item-placements-card";
import { ItemViewSkeleton } from "./components/item-view-skeleton";
import { useGetItemById } from "./hooks/use-get-item-by-id";

interface ItemViewProps {
  id: string;
}

export function ItemView({ id }: ItemViewProps) {
  const router = useRouter();
  const { data: response, isLoading } = useGetItemById(id);
  const item = response?.data;

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const [imageList, setImageList] = useState<{ src: string; label: string; type: string }[]>([]);
  const [initializedForId, setInitializedForId] = useState<string | null>(null);

  if (item && item.id !== initializedForId) {
    const list: { src: string; label: string; type: string }[] = [];

    if (item.productImageUrls && item.productImageUrls.length > 0) {
      item.productImageUrls.forEach((url: string, idx: number) => {
        list.push({ src: url, label: `Product ${idx + 1}`, type: "product" });
      });
    } else if (item.productImageUrl) {
      list.push({ src: item.productImageUrl, label: item.productName, type: "product" });
    }

    if (item.productInfoImageUrl)
      list.push({ src: item.productInfoImageUrl, label: "Product Info", type: "additional" });
    if (item.nutritionInfoImageUrl)
      list.push({ src: item.nutritionInfoImageUrl, label: "Nutrition Info", type: "additional" });

    setImageList(list);
    setInitializedForId(item.id);
  }

  const swapWithMain = (idx: number) => {
    setImageList((prev) => {
      const next = [...prev];
      [next[0], next[idx]] = [next[idx], next[0]];
      return next;
    });
  };

  const mainImage = imageList[0] ?? null;
  const thumbnailsWithIndex = imageList.map((img, i) => ({ ...img, originalIndex: i })).slice(1);
  const productGalleryThumbnails = thumbnailsWithIndex.filter((t) => t.type === "product");
  const additionalThumbnails = thumbnailsWithIndex.filter((t) => t.type === "additional");

  if (isLoading) {
    return <ItemViewSkeleton />;
  }

  if (!item) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Package className="h-16 w-16 text-slate-300" />
        <h2 className="text-2xl font-bold tracking-tight text-slate-700">Item not found</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-2 rounded-full px-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <div className="space-y-4">
        <div>
          <PageHeader
            breadcrumbs={[
              { label: "Catalogue Management" },
              { label: "Items", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS },
              { label: "Item Details" },
            ]}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 grid items-stretch gap-4 transition-colors duration-700 lg:grid-cols-3">
          <ItemMediaCard
            item={item}
            mainImage={mainImage}
            productGalleryThumbnails={productGalleryThumbnails}
            additionalThumbnails={additionalThumbnails}
            setLightboxSrc={setLightboxSrc}
            swapWithMain={swapWithMain}
          />
          <ItemDetailsCard item={item} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ItemPlacementsCard item={item} />
        </div>
      </div>
    </>
  );
}
