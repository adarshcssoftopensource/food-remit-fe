"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { ArrowLeft, Package, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ItemDetailsCard } from "./components/details/item-details-card";
import { ItemInfoSection } from "./components/details/item-info-section";
import { ItemMediaCard } from "./components/details/item-media-card";
import { ItemOptionsCard } from "./components/details/item-options-card";
import { ItemPlacementsCard } from "./components/details/item-placements-card";
import { ItemProductPricingCard } from "./components/details/item-product-pricing-card";
import { ItemViewSkeleton } from "./components/details/item-view-skeleton";
import { useGetItemById } from "./hooks/use-get-item-by-id";

interface ItemViewProps {
  id: string;
}

export function ItemView({ id }: ItemViewProps) {
  const router = useRouter();
  const { profile, needsBankVerification } = useProfile();
  const isStoreScoped =
    profile?.role === "store_manager" ||
    profile?.role === "employee" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.roleCode === "EMPLOYEE";
  const { data: response, isLoading } = useGetItemById(id);
  const item = response?.data;

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const imageList = useMemo(() => {
    const list: { src: string; label: string; type: string }[] = [];
    if (!item) return list;

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

    if (selectedImageSrc) {
      const selectedIdx = list.findIndex((img) => img.src === selectedImageSrc);
      const first = list[0];
      const selectedItem = list[selectedIdx];
      if (selectedIdx !== -1 && first && selectedItem) {
        list[0] = selectedItem;
        list[selectedIdx] = first;
      }
    }

    return list;
  }, [item, selectedImageSrc]);

  const swapWithMain = (idx: number) => {
    const selected = imageList[idx];
    if (selected) {
      setSelectedImageSrc(selected.src);
    }
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
              { label: "Categories", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES },
              ...(item.category
                ? [
                    {
                      label: item.category.categoryName,
                      href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(item.category.id),
                    },
                  ]
                : []),
              { label: item.productName },
            ]}
            action={
              !needsBankVerification ? (
                <Button
                  onClick={() =>
                    router.push(
                      ROUTES.ADMIN.CATALOGUE_MANAGEMENT.EDIT_ITEM(
                        item.id,
                        ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEM_DETAILS(item.id),
                      ),
                    )
                  }
                  className="gap-2 rounded-xl"
                >
                  <Pencil className="h-4 w-4" />
                  Edit item
                </Button>
              ) : undefined
            }
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
          <ItemProductPricingCard item={item} />
        </div>

        {item.options && item.options.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ItemOptionsCard item={item} />
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ItemInfoSection item={item} />
        </div>

        {!isStoreScoped && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ItemPlacementsCard item={item} />
          </div>
        )}
      </div>
    </>
  );
}
