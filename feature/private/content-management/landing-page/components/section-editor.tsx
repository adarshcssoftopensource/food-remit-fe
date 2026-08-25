"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IMAGE_SECTIONS,
  SECTION_NOTES,
  SECTION_SCHEMAS,
  normalizeSectionData,
} from "../schema/landing-section.schema";
import { LANDING_CMS_SECTIONS, type LandingSectionKey } from "../types";
import { BenefitsFields } from "./fields/benefits-fields";
import { BusinessTypesFields } from "./fields/business-types-fields";
import { DifferentFields } from "./fields/different-fields";
import { FaqFields } from "./fields/faq-fields";
import { pickDirtyFields } from "./fields/field-utils";
import { FooterFields } from "./fields/footer-fields";
import { HeroFields } from "./fields/hero-fields";
import { HowItWorksFields } from "./fields/how-it-works-fields";
import { JoinFields } from "./fields/join-fields";
import { OpportunityFields } from "./fields/opportunity-fields";
import { RevenueFields } from "./fields/revenue-fields";
import { SuccessFields } from "./fields/success-fields";
import { TestimonialsFields } from "./fields/testimonials-fields";
import { TrustFields } from "./fields/trust-fields";
import { WhyJoinFields } from "./fields/why-join-fields";
import { StatsReadOnly } from "./stats-read-only";

type SectionEditorProps = {
  section: LandingSectionKey;
  initialData: unknown;
  isSaving: boolean;
  onSave: (data: unknown, image?: File | null) => Promise<void>;
};

export function SectionEditor({ section, initialData, isSaving, onSave }: SectionEditorProps) {
  const schema = SECTION_SCHEMAS[section];
  const defaults = normalizeSectionData(section, initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: defaults,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = form;

  const meta = LANDING_CMS_SECTIONS.find((s) => s.key === section);
  const label = meta?.label ?? section;
  const note = SECTION_NOTES[section];
  const showImage = IMAGE_SECTIONS.has(section);
  const isReadOnlyStats = section === "stats";

  const imageUrl =
    section === "hero"
      ? String((defaults as { backgroundImage?: string }).backgroundImage || "")
      : section === "whyJoin" || section === "success"
        ? String((defaults as { image?: string }).image || "")
        : "";

  const onSubmit = handleSubmit(async (values) => {
    if (isReadOnlyStats) return;
    const payload = pickDirtyFields(values, dirtyFields as Record<string, unknown>);
    if (Object.keys(payload).length === 0 && !imageFile) return;
    await onSave(payload, imageFile);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-950">{label}</h2>
        {note ? <p className="mt-1 text-sm text-slate-500">{note}</p> : null}
        {isReadOnlyStats ? (
          <p className="mt-1 text-sm text-slate-500">
            These numbers are calculated live from your database and cannot be edited.
          </p>
        ) : null}
      </div>

      <ScrollArea className="h-[min(62vh,480px)] pr-3">
        <div className="space-y-5 p-2 py-5">
          {isReadOnlyStats ? (
            <StatsReadOnly
              items={(defaults as { items?: { value: string; label: string }[] }).items ?? []}
            />
          ) : (
            <>
              {showImage ? (
                <div className="space-y-1.5">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    {section === "hero" ? "Background image " : "Section image"}
                  </FieldLabel>
                  <ImageUpload
                    multiple={false}
                    maxFiles={1}
                    initialImages={imageUrl ? [imageUrl] : []}
                    onChange={(files) => setImageFile(files[0] ?? null)}
                    label="Upload to S3"
                    hint="PNG, JPG or WEBP — stored in S3 and saved to DB"
                  />
                </div>
              ) : null}

              {section === "hero" ? <HeroFields control={control} errors={errors} /> : null}
              {section === "whyJoin" ? (
                <WhyJoinFields control={control} setValue={setValue} errors={errors} />
              ) : null}
              {section === "revenue" ? <RevenueFields control={control} errors={errors} /> : null}
              {section === "howItWorks" ? (
                <HowItWorksFields control={control} errors={errors} />
              ) : null}
              {section === "benefits" ? <BenefitsFields control={control} errors={errors} /> : null}
              {section === "businessTypes" ? (
                <BusinessTypesFields control={control} setValue={setValue} errors={errors} />
              ) : null}
              {section === "opportunity" ? (
                <OpportunityFields control={control} errors={errors} />
              ) : null}
              {section === "different" ? (
                <DifferentFields control={control} errors={errors} />
              ) : null}
              {section === "success" ? (
                <SuccessFields control={control} setValue={setValue} errors={errors} />
              ) : null}
              {section === "trust" ? <TrustFields control={control} errors={errors} /> : null}
              {section === "testimonials" ? (
                <TestimonialsFields control={control} errors={errors} />
              ) : null}
              {section === "faq" ? <FaqFields control={control} errors={errors} /> : null}
              {section === "join" ? <JoinFields control={control} errors={errors} /> : null}
              {section === "footer" ? <FooterFields control={control} errors={errors} /> : null}
            </>
          )}
        </div>
      </ScrollArea>

      {!isReadOnlyStats ? (
        <div className="flex shrink-0 justify-start border-t border-slate-100 pt-5">
          <Button
            type="submit"
            isLoading={isSaving}
            disabled={Object.keys(dirtyFields).length === 0 && !imageFile}
            className="h-12 min-w-40 rounded-xl font-semibold"
          >
            <Save className="mr-2 size-4" />
            Save section
          </Button>
        </div>
      ) : null}
    </form>
  );
}
