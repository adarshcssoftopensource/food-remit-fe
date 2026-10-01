"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Maximize2 } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

interface ProfileStoreBannerProps {
  storeImage?: string | null;
  canEditStoreImage: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenLightbox: () => void;
}

export function ProfileStoreBanner({
  storeImage,
  canEditStoreImage,
  isUploading,
  fileInputRef,
  onImageChange,
  onOpenLightbox,
}: ProfileStoreBannerProps) {
  return (
    <div
      className="group/banner relative flex h-24 w-full items-center justify-center bg-cover bg-center bg-no-repeat transition-[height] sm:h-32"
      style={{
        backgroundImage: storeImage ? `url(${storeImage})` : undefined,
      }}
    >
      <div
        className={`absolute inset-0 transition-all ${storeImage ? "bg-emerald-950/40 backdrop-blur-[1px] group-hover/banner:bg-emerald-950/60 group-hover/banner:backdrop-blur-sm" : "bg-linear-to-r from-emerald-600/30 via-teal-600/20 to-emerald-500/10 group-hover/banner:bg-emerald-600/40"}`}
      />

      <div className="absolute z-10 flex items-center gap-4 opacity-0 transition-opacity group-hover/banner:opacity-100">
        {storeImage && (
          <button
            onClick={onOpenLightbox}
            aria-label="View store image"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/30"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        )}
        {canEditStoreImage && (
          <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/30">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onImageChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}

interface ProfileAvatarProps {
  image?: string | null;
  displayName: string;
  initials: string;
  canEditImages: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({
  image,
  displayName,
  initials,
  canEditImages,
  isUploading,
  fileInputRef,
  onImageChange,
}: ProfileAvatarProps) {
  return (
    <div className="group relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md ring-4 ring-white sm:-mt-12 sm:h-24 sm:w-24 dark:ring-slate-900">
      <Avatar className="h-full w-full rounded-2xl shadow-sm">
        <AvatarImage src={image || ""} alt={displayName} className="rounded-2xl object-cover" />
        <AvatarFallback className="rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-xl font-black text-white sm:text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      {canEditImages && (
        <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white sm:h-6 sm:w-6" />
          ) : (
            <Camera className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onImageChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
