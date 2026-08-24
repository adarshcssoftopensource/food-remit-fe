import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Expand, Eye, Package } from "lucide-react";
import Image from "next/image";

interface ItemMediaCardProps {
  item: any;
  mainImage: { src: string; label: string; type: string } | null;
  productGalleryThumbnails: { src: string; label: string; type: string; originalIndex: number }[];
  additionalThumbnails: { src: string; label: string; type: string; originalIndex: number }[];
  setLightboxSrc: (src: string) => void;
  swapWithMain: (idx: number) => void;
}

export function ItemMediaCard({
  item,
  mainImage,
  productGalleryThumbnails,
  additionalThumbnails,
  setLightboxSrc,
  swapWithMain,
}: ItemMediaCardProps) {
  return (
    <Card className="relative flex h-fit flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-1 dark:bg-slate-950 dark:shadow-none">
      <div className="from-primary/80 via-primary to-primary/40 absolute inset-x-0 top-0 h-24 bg-linear-to-br opacity-90" />

      <CardHeader className="relative flex flex-1 flex-col px-5 pt-2 pb-5 text-center">
        <div className="shadow-primary/20 group relative mx-auto flex h-56 w-56 shrink-0 items-center justify-center rounded-[2.5rem] bg-white p-2.5 shadow-xl ring-4 ring-white dark:bg-slate-900 dark:ring-slate-950">
          <div className="bg-primary/5 text-primary relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem]">
            {mainImage?.src ? (
              <Image
                key={mainImage.src}
                src={mainImage.src}
                alt={mainImage.label}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-opacity duration-300"
              />
            ) : (
              <Package className="h-16 w-16" />
            )}
          </div>

          {mainImage?.src && (
            <button
              onClick={() => setLightboxSrc(mainImage.src)}
              className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70"
              title="View full screen"
            >
              <Expand className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4 w-full text-center">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {item.productName}
          </CardTitle>
          {item.description && (
            <p className="mt-1 text-start text-xs leading-relaxed text-slate-500">
              {item.description}
            </p>
          )}

          <div className="mt-3 flex justify-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition-colors ${
                item.status === "ACTIVE"
                  ? "bg-green-500/10 text-green-700 ring-1 ring-green-500/20 dark:bg-green-500/20 dark:text-green-400"
                  : "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/20 dark:text-red-400"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                />
              </span>
              {item.status === "ACTIVE" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardHeader>

      {productGalleryThumbnails.length > 0 && (
        <div className="border-t border-slate-100/80 px-5 pt-3 pb-4 dark:border-slate-800/80">
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Product Gallery ({productGalleryThumbnails.length + 1} images)
          </p>
          <div className="flex flex-wrap gap-2">
            {productGalleryThumbnails.map(({ src, label, originalIndex }) => (
              <Button
                variant={"ghost"}
                key={src}
                onClick={() => swapWithMain(originalIndex)}
                className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors transition-shadow transition-transform duration-200 hover:scale-[1.06] hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 via-transparent to-transparent">
                  <p className="pb-1 text-center text-[9px] leading-tight font-semibold text-white">
                    {label}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors transition-opacity duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                  <Eye className="text-white" />
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {additionalThumbnails.length > 0 && (
        <div className="border-t border-slate-100/80 px-5 pt-3 pb-4 dark:border-slate-800/80">
          <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Additional Images
          </p>
          <div className="flex flex-wrap gap-2">
            {additionalThumbnails.map(({ src, label, originalIndex }) => (
              <Button
                key={src}
                variant={"ghost"}
                onClick={() => swapWithMain(originalIndex)}
                className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors transition-shadow transition-transform duration-200 hover:scale-[1.06] hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 via-transparent to-transparent">
                  <p className="pb-1 text-center text-[9px] leading-tight font-semibold text-white">
                    {label}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors transition-opacity duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                  <Eye className="text-white" />
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
