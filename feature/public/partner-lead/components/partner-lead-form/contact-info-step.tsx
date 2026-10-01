import { Clock, Mail, Upload, User, X } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { MultiLanguageSelect } from "@/components/common/multi-language-select";
import { errorToast } from "@/components/toaster";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { getFilePreviewUrl } from "../../utils/file-preview-url";

type ContactInfoStepProps = Pick<
  PartnerLeadFormState,
  "control" | "errors" | "watch" | "selectedCountryName" | "selectedCountryIsoCode"
>;

export function ContactInfoStep({
  control,
  errors,
  watch,
  selectedCountryName,
  selectedCountryIsoCode,
}: ContactInfoStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <User className="size-5 text-emerald-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 2: Contact Information</h2>
          <p className="text-xs text-slate-400">How should our team contact you?</p>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-slate-700">
                First Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="firstName"
                placeholder="Enter first name"
                aria-invalid={!!errors.firstName}
                className={cn(
                  "h-11 rounded-xl border-slate-200 bg-white text-sm",
                  errors.firstName && "border-red-400 bg-red-50/30",
                )}
              />
              {errors.firstName && (
                <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="lastName"
                placeholder="Enter last name"
                aria-invalid={!!errors.lastName}
                className={cn(
                  "h-11 rounded-xl border-slate-200 bg-white text-sm",
                  errors.lastName && "border-red-400 bg-red-50/30",
                )}
              />
              {errors.lastName && (
                <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          )}
        />

        {/* Profile Image Upload */}
        <ProfileImageField control={control} />

        <Controller
          name="jobTitle"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 xl:col-span-2">
              <FieldLabel htmlFor="jobTitle" className="text-xs font-semibold text-slate-700">
                Job Title / Role <span className="font-normal text-slate-400">(Optional)</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobTitle"
                placeholder="e.g. Owner, Store Manager, Director of Operations"
                className="h-11 rounded-xl border-slate-200 bg-white text-sm"
              />
            </div>
          )}
        />

        <Controller
          name="businessEmail"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="businessEmail" className="text-xs font-semibold text-slate-700">
                Business Email <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  {...field}
                  id="businessEmail"
                  type="email"
                  placeholder="name@company.com"
                  aria-invalid={!!errors.businessEmail}
                  className={cn(
                    "h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm",
                    errors.businessEmail && "border-red-400 bg-red-50/30",
                  )}
                />
              </div>
              {errors.businessEmail && (
                <p className="text-xs font-medium text-red-500">{errors.businessEmail.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </FieldLabel>
              <PhoneInputComponent
                value={field.value}
                onChange={(value, data) => {
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                error={!!errors.phoneNumber}
                defaultCountry={selectedCountryIsoCode || selectedCountryName || "US"}
                disableCountrySelect
              />
              {errors.phoneNumber && (
                <p className="text-xs font-medium text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
          <Clock className="size-4.5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Operational Details</h3>
            <p className="text-xs text-slate-500">
              Tell us about your languages and operating hours.
            </p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5 xl:col-span-2">
                <FieldLabel className="text-xs font-semibold text-slate-700">
                  Languages Spoken <span className="text-red-500">*</span>
                </FieldLabel>
                <MultiLanguageSelect
                  selected={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.languages}
                  countryName={watch("country")}
                />
                {errors.languages && (
                  <p className="text-xs font-medium text-red-500">{errors.languages.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileImageField({ control }: Pick<PartnerLeadFormState, "control">) {
  return (
    <Controller
      name="profileImage"
      control={control}
      render={({ field }) => {
        const imgFile = field.value instanceof File ? field.value : null;
        const imgUrl =
          typeof field.value === "string"
            ? field.value
            : imgFile
              ? getFilePreviewUrl(imgFile)
              : null;

        return (
          <div className="flex flex-col gap-1.5 xl:col-span-2">
            <FieldLabel className="block text-xs font-semibold text-slate-700">
              Profile Photo{" "}
              <span className="font-normal text-slate-400">
                (Optional — Default avatar will be used if not uploaded)
              </span>
            </FieldLabel>

            <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 transition hover:border-emerald-500/50 sm:flex-row sm:items-center">
              {/* Avatar Preview */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-white shadow-xs">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt="Profile Preview"
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      imgUrl
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-slate-200 bg-white text-slate-500",
                    )}
                  >
                    {imgUrl ? "Custom Photo Uploaded" : "Default Avatar"}
                  </span>
                  {imgFile && (
                    <span className="max-w-[200px] truncate text-xs text-slate-400">
                      {imgFile.name} ({(imgFile.size / 1024).toFixed(0)} KB)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Upload your profile photo (PNG, JPG, or WEBP up to 5MB). This will be your store
                  manager avatar.
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <label
                    htmlFor="vendorProfileImageInput"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-emerald-700"
                  >
                    <Upload className="size-3.5 text-emerald-600" />
                    <span>{imgUrl ? "Change Photo" : "Upload Photo"}</span>
                  </label>
                  <input
                    id="vendorProfileImageInput"
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

                  {imgUrl && (
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
