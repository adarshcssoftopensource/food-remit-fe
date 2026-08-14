import Image from "next/image";

type ImageNameCellProps = {
  name: string;
  image?: string | null;
  type?: "profile" | "logo";
};

export function ImageNameCell({ name, image, type = "logo" }: ImageNameCellProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const isProfile = type === "profile";
  console.log({ image });

  return (
    <div className={`flex items-center ${isProfile ? "gap-2.5" : "gap-3"}`}>
      <div
        className={`bg-primary/10 text-primary flex shrink-0 items-center justify-center overflow-hidden border border-slate-100 ${
          isProfile ? "size-8 rounded-full" : "bg-primary/5 h-10 w-10 rounded-xl"
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            className={isProfile ? "h-full w-full object-cover" : "h-6 w-6 object-contain"}
            height={40}
            width={40}
          />
        ) : (
          <span className={isProfile ? "text-xs font-bold" : "text-primary font-bold"}>
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={`font-medium ${isProfile ? "text-sm text-slate-800" : "font-semibold text-slate-900"}`}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
