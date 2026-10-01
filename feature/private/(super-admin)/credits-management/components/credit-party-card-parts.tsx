"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreditPartyCardHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  iconWrapperClassName: string;
  title: string;
  badgeLabel: string;
  badgeClassName: string;
}

export function CreditPartyCardHeader({
  icon: Icon,
  iconWrapperClassName,
  title,
  badgeLabel,
  badgeClassName,
}: CreditPartyCardHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={iconWrapperClassName}>
          <Icon className="size-3.5" />
        </div>
        <span className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
          {title}
        </span>
      </div>
      <Badge variant="outline" className={badgeClassName}>
        {badgeLabel}
      </Badge>
    </div>
  );
}

interface CreditPartyAvatarProps {
  image?: string | null;
  alt: string;
  className: string;
  fallback: React.ReactNode;
  onImageClick?: (url: string) => void;
}

export function CreditPartyAvatar({
  image,
  alt,
  className,
  fallback,
  onImageClick,
}: CreditPartyAvatarProps) {
  return (
    <button
      type="button"
      disabled={!image}
      className={`${className} ${image ? "cursor-pointer" : ""}`}
      onClick={() => image && onImageClick?.(image)}
      title={image ? "Click to maximize image" : undefined}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={alt}
            fill
            sizes="48px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="size-3.5 text-white" />
          </div>
        </>
      ) : (
        fallback
      )}
    </button>
  );
}
