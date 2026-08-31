import Image from "next/image";
import { TruncatedTextCell } from "./truncated-text-cell";

type ImageNameCellProps = {
  name: string;
  image?: string | null;
  type?: "profile" | "logo";
  onImageClick?: (image: string) => void;
  enableZoom?: boolean;
};

export function ImageNameCell({
  name,
  image,
  type = "logo",
  onImageClick,
  enableZoom = false,
}: ImageNameCellProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const isProfile = type === "profile";

  let validImage: string | null = null;
  if (image && typeof image === "string") {
    const trimmed = image.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("data:")
    ) {
      validImage = trimmed;
    }
  }

  return (
    <div className={`flex items-center ${isProfile ? "gap-2.5" : "gap-3"}`}>
      <div
        className={`group bg-primary/10 text-primary relative flex shrink-0 items-center justify-center overflow-hidden border border-slate-100 ${
          isProfile ? "size-8 rounded-full" : "bg-primary/5 h-10 w-10 rounded-xl"
        }`}
      >
        {validImage ? (
          <>
            <Image
              src={validImage}
              alt={name}
              className={isProfile ? "h-full w-full object-cover" : "h-6 w-6 object-contain"}
              height={40}
              width={40}
            />
            {enableZoom && onImageClick && (
              <button
                onClick={() => onImageClick(validImage)}
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
          <span className={isProfile ? "text-xs font-bold" : "text-primary font-bold"}>
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <TruncatedTextCell
          maxWords={2}
          text={name || "-"}
          className={`font-medium ${isProfile ? "text-sm text-slate-800" : "font-semibold text-slate-900"}`}
        />
      </div>
    </div>
  );
}
