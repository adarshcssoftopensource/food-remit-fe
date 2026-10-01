import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { errorToast } from "@/components/toaster";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { getFilePreviewUrl } from "../../utils/file-preview-url";

type BusinessDetailsFieldsProps = Pick<
  PartnerLeadFormState,
  "control" | "errors" | "isOtherBusinessType"
>;

export function BusinessDetailsFields({
  control,
  errors,
  isOtherBusinessType,
}: BusinessDetailsFieldsProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
      <Controller
        name="businessName"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="businessName" className="text-xs font-semibold text-slate-700">
              Business Name <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="businessName"
              placeholder="Enter business name"
              aria-invalid={!!errors.businessName}
              className={cn(
                "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                errors.businessName && "border-red-400 bg-red-50/30",
              )}
            />
            {errors.businessName && (
              <p className="text-xs font-medium text-red-500">{errors.businessName.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="businessType"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="businessType" className="text-xs font-semibold text-slate-700">
              Business Type <span className="text-red-500">*</span>
            </FieldLabel>
            <Select value={field.value} onValueChange={(val) => field.onChange(val ?? "")}>
              <SelectTrigger
                id="businessType"
                className={cn(
                  "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                  errors.businessType && "border-red-400 bg-red-50/30",
                )}
              >
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-xs font-medium text-red-500">{errors.businessType.message}</p>
            )}
          </div>
        )}
      />

      {isOtherBusinessType && (
        <Controller
          name="otherBusinessType"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel
                htmlFor="otherBusinessType"
                className="text-xs font-semibold text-slate-700"
              >
                Please Specify Business Type <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="otherBusinessType"
                placeholder="e.g. Food Truck, Specialty Bakery, Cloud Kitchen"
                aria-invalid={!!errors.otherBusinessType}
                className={cn(
                  "h-11 rounded-xl border-slate-200 bg-white text-sm transition-colors focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                  errors.otherBusinessType && "border-red-400 bg-red-50/30",
                )}
              />
              {errors.otherBusinessType && (
                <p className="text-xs font-medium text-red-500">
                  {errors.otherBusinessType.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      <StoreLogoField control={control} />

      <HasBusinessAccountField control={control} />
    </div>
  );
}

function StoreLogoField({ control }: Pick<PartnerLeadFormState, "control">) {
  // Store Logo Field (with default image preview & fallback)
  return (
    <Controller
      name="storeLogo"
      control={control}
      render={({ field }) => {
        const logoFile = field.value instanceof File ? field.value : null;
        const logoUrl =
          typeof field.value === "string"
            ? field.value
            : logoFile
              ? getFilePreviewUrl(logoFile)
              : null;

        return (
          <div className="flex flex-col gap-1.5 xl:col-span-2">
            <FieldLabel className="block text-xs font-semibold text-slate-700">
              Store Logo{" "}
              <span className="font-normal text-slate-400">
                (Optional — Default store picture will be used if not uploaded)
              </span>
            </FieldLabel>

            <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 transition hover:border-emerald-500/50 sm:flex-row sm:items-center">
              {/* Logo Preview (Default or Uploaded) */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                <Image
                  src={logoUrl || "/default-store.svg"}
                  alt="Store Logo Preview"
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              {/* Upload Controls & Information */}
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      logoUrl
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-slate-200 bg-white text-slate-500",
                    )}
                  >
                    {logoUrl ? "Custom Logo Uploaded" : "Default Store Picture"}
                  </span>
                  {logoFile && (
                    <span className="max-w-[200px] truncate text-xs text-slate-400">
                      {logoFile.name} ({(logoFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Upload your store or brand logo (PNG, JPG, or WEBP up to 5MB). If left empty, the
                  default picture above is used.
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="vendorStoreLogoInput"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-emerald-700"
                  >
                    <Upload className="size-3.5 text-emerald-600" />
                    <span>{logoUrl ? "Change Logo" : "Upload Store Logo"}</span>
                  </label>
                  <input
                    id="vendorStoreLogoInput"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        errorToast({
                          title: "Image Too Large",
                          description: "Image size must be less than 5MB",
                        });
                        return;
                      }
                      field.onChange(file);
                      e.target.value = "";
                    }}
                  />

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => field.onChange(undefined)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <X className="size-3.5" />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

function HasBusinessAccountField({ control }: Pick<PartnerLeadFormState, "control">) {
  return (
    <Controller
      name="hasBusinessAccount"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 xl:col-span-2">
          <FieldLabel className="block text-xs font-semibold text-slate-700">
            Does your Business have a Business Account?{" "}
            <span className="font-normal text-slate-400">(Bank Account - Optional)</span>
          </FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors",
                field.value === true
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <input
                type="radio"
                name="hasBusinessAccount"
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                className="sr-only"
              />
              <span>Yes</span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors",
                field.value === false
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <input
                type="radio"
                name="hasBusinessAccount"
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                className="sr-only"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      )}
    />
  );
}
