"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { ObjectArrayFields, StringArrayFields } from "./array-fields";
import { FormTextField } from "./form-text-field";
import { MarketsCountryPicker } from "./markets-country-picker";

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

function StatsReadOnly({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-primary/8 border-primary/15 flex items-start gap-3 rounded-2xl border p-4">
        <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Live calculated stats</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Countries · Vendor stores · Active products · Completed orders (status 6)
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-5"
          >
            <p className="text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type FieldsProps = {
  control: any;
  setValue?: any;
  errors: any;
};

function fieldError(errors: FieldsProps["errors"], path: string) {
  const parts = path.split(".");
  let cur: unknown = errors;
  for (const part of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  if (cur && typeof cur === "object" && "message" in cur) {
    return String((cur as { message?: string }).message ?? "");
  }
  return undefined;
}

function HeroFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="subtitle"
        label="Subtitle"
        multiline
        error={fieldError(errors, "subtitle")}
      />
      <FormTextField
        control={control}
        name="ctaLabel"
        label="CTA label"
        error={fieldError(errors, "ctaLabel")}
      />
      {/* <FormTextField
        control={control}
        name="backgroundImageAlt"
        label="Image alt text"
        error={fieldError(errors, "backgroundImageAlt")}
      /> */}
    </>
  );
}

function WhyJoinFields({ control, setValue, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
      <FormTextField
        control={control}
        name="highlight"
        label="Highlight"
        multiline
        error={fieldError(errors, "highlight")}
      />
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="points"
        title="Points"
        error={fieldError(errors, "points")}
      />
      {/* <FormTextField
        control={control}
        name="imageAlt"
        label="Image alt"
        error={fieldError(errors, "imageAlt")}
      /> */}
    </>
  );
}

function RevenueFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
      {/* <FormTextField
        control={control}
        name="marketLabel"
        label="Market card label"
        error={fieldError(errors, "marketLabel")}
      /> */}
      <Controller
        name="markets"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <FieldLabel className="text-sm font-semibold text-slate-700">
              Markets (all world countries)
            </FieldLabel>
            <MarketsCountryPicker
              markets={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
            />
          </div>
        )}
      />
    </>
  );
}

function HowItWorksFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        error={fieldError(errors, "description")}
      />
      <ObjectArrayFields
        control={control}
        name="steps"
        title="Steps"
        emptyItem={{ step: "", title: "", description: "" }}
        fields={[
          { key: "step", label: "Step number" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        error={fieldError(errors, "steps")}
      />
    </>
  );
}

function BenefitsFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="items"
        title="Benefits"
        emptyItem={{ title: "", description: "" }}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}

function BusinessTypesFields({ control, setValue, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        error={fieldError(errors, "description")}
      />
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="types"
        title="Types"
        error={fieldError(errors, "types")}
      />
    </>
  );
}

function OpportunityFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="stories"
        title="Stories"
        emptyItem={{ from: "", habit: "", for: "" }}
        fields={[
          { key: "from", label: "From city" },
          { key: "habit", label: "Habit" },
          { key: "for", label: "For" },
        ]}
        error={fieldError(errors, "stories")}
      />
      <FormTextField
        control={control}
        name="closing"
        label="Closing line"
        multiline
        error={fieldError(errors, "closing")}
      />
    </>
  );
}

function DifferentFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="items"
        title="Differentiators"
        emptyItem={{ unlike: "", point: "" }}
        fields={[
          { key: "unlike", label: "Unlike…" },
          { key: "point", label: "Point", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}

function SuccessFields({ control, setValue, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="investments"
        title="Investments"
        error={fieldError(errors, "investments")}
      />
      {/* <FormTextField
        control={control}
        name="imageAlt"
        label="Image alt"
        error={fieldError(errors, "imageAlt")}
      /> */}
    </>
  );
}

function TrustFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="items"
        title="Trust items"
        emptyItem={{ title: "", description: "" }}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}

function TestimonialsFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="items"
        title="Testimonials"
        emptyItem={{ quote: "", name: "", role: "" }}
        fields={[
          { key: "quote", label: "Quote", multiline: true },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}

function FaqFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <ObjectArrayFields
        control={control}
        name="items"
        title="FAQs"
        emptyItem={{ question: "", answer: "" }}
        fields={[
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}

function JoinFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
    </>
  );
}

function FooterFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="tagline"
        label="Tagline"
        multiline
        error={fieldError(errors, "tagline")}
      />
      <FormTextField
        control={control}
        name="copyright"
        label="Copyright"
        error={fieldError(errors, "copyright")}
      />
    </>
  );
}

/** Send only changed keys. Dirty arrays are sent as the full current array. */
function pickDirtyFields(
  values: Record<string, unknown>,
  dirty: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(dirty)) {
    const marker = dirty[key];
    if (marker === true) {
      out[key] = values[key];
      continue;
    }
    if (Array.isArray(marker)) {
      if (marker.some((item) => Boolean(item))) {
        out[key] = values[key];
      }
      continue;
    }
    if (marker && typeof marker === "object") {
      const nestedValues = (values[key] ?? {}) as Record<string, unknown>;
      const nested = pickDirtyFields(nestedValues, marker as Record<string, unknown>);
      if (Object.keys(nested).length > 0) out[key] = nested;
    }
  }
  return out;
}
