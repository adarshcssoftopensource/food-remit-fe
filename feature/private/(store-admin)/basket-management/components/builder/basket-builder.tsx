"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  FileText,
  ImageIcon,
  LayoutGrid,
  ListOrdered,
  Loader2,
  Rocket,
  Save,
  ScanEye,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch, type FieldPath } from "react-hook-form";
import type { z } from "zod";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WizardStepper, type WizardStep } from "@/components/common/wizard-stepper";
import { errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/config/routes";

import { useActiveBasketStore } from "../../hooks/use-active-basket-store";
import { useBasketPricingPreview } from "../../hooks/use-basket-pricing-preview";
import { useSaveBasket } from "../../hooks/use-save-basket";
import {
  EMPTY_BASKET_FORM,
  basketFormSchema,
  basketToFormValues,
  formValuesToPayload,
  type BasketFormValues,
} from "../../schema/basket-form.schema";
import type { BasketDetail } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";
import { BasketStatusBadge } from "../shared/basket-badges";
import { BasketStoreSwitcher } from "../shared/basket-store-switcher";
import { BasketSummaryCard } from "../shared/basket-summary-card";
import { BasketPublished } from "./basket-published";
import { ImageAvailabilityStep } from "./steps/image-availability-step";
import { InfoStep } from "./steps/info-step";
import { ItemsStep } from "./steps/items-step";
import { PricingStep } from "./steps/pricing-step";
import { QuantitiesStep } from "./steps/quantities-step";
import { ReviewStep, type BuilderStepId } from "./steps/review-step";
import { TypeStep } from "./steps/type-step";

const STEPS: (WizardStep & { id: BuilderStepId })[] = [
  { id: "type", label: "Basket type", icon: LayoutGrid },
  { id: "info", label: "Information", icon: FileText },
  { id: "items", label: "Select items", icon: ShoppingBasket },
  { id: "quantities", label: "Quantities", icon: ListOrdered },
  { id: "pricing", label: "Pricing", icon: Calculator },
  { id: "image", label: "Image & availability", icon: ImageIcon },
  { id: "review", label: "Preview", icon: ScanEye },
];

const STEP_FIELDS: Partial<Record<BuilderStepId, FieldPath<BasketFormValues>[]>> = {
  type: ["basketType"],
  info: ["name", "shortDescription", "description", "householdSize"],
  items: ["items"],
  quantities: ["items"],
};

const stepIndex = (id: BuilderStepId) => STEPS.findIndex((s) => s.id === id);
const stepAt = (index: number): BuilderStepId => STEPS[index]?.id ?? "review";

interface BasketBuilderProps {
  basket?: BasketDetail;
}

export function BasketBuilder({ basket }: BasketBuilderProps) {
  const router = useRouter();
  const isEdit = Boolean(basket);
  const {
    stores,
    activeStore,
    setActiveStoreId,
    isLoading: storesLoading,
  } = useActiveBasketStore();

  const [savedBasket, setSavedBasket] = useState<BasketDetail | undefined>(basket);
  const [published, setPublished] = useState<BasketDetail | null>(null);
  const [current, setCurrent] = useState(isEdit ? stepIndex("review") : 0);
  const [maxReached, setMaxReached] = useState(isEdit ? STEPS.length - 1 : 0);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<BasketFormValues, unknown, z.output<typeof basketFormSchema>>({
    resolver: zodResolver(basketFormSchema),
    defaultValues: basket ? basketToFormValues(basket) : EMPTY_BASKET_FORM,
    mode: "onTouched",
  });
  const { control, trigger, getValues, reset, formState } = form;
  const [items, basketType, name, shortDescription, householdSize, image] = useWatch({
    control,
    name: ["items", "basketType", "name", "shortDescription", "householdSize", "image"],
  });

  const store =
    savedBasket?.store ??
    (activeStore ? { id: activeStore.id, storeName: activeStore.storeName } : null);
  const storeId = savedBasket?.storeId ?? store?.id;
  const isPublished = Boolean(savedBasket && savedBasket.status !== "DRAFT");

  const pricingInput = useMemo(
    () => items.map(({ itemId, quantity }) => ({ itemId, quantity })),
    [items],
  );
  const pricingQuery = useBasketPricingPreview(storeId, pricingInput);
  const pricing = items.length > 0 ? pricingQuery.data : undefined;
  const pricingLoading = pricingQuery.isFetching;

  const save = useSaveBasket();

  useEffect(() => {
    if (!formState.isDirty || published) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formState.isDirty, published]);

  const goTo = (index: number) => {
    setCurrent(index);
    setMaxReached((m) => Math.max(m, index));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateStep = async (id: BuilderStepId) => {
    const fields = STEP_FIELDS[id];
    if (fields && !(await trigger(fields, { shouldFocus: true }))) return false;
    if ((id === "items" || id === "quantities") && getValues("items").length === 0) {
      errorToast({ description: "Add at least one item to your basket." });
      return false;
    }
    return true;
  };

  const next = async () => {
    if (await validateStep(stepAt(current))) goTo(current + 1);
  };

  const jumpTo = async (index: number) => {
    if (index <= current) return goTo(index);
    for (let i = current; i < index; i++) {
      if (!(await validateStep(stepAt(i)))) return goTo(i);
    }
    goTo(index);
  };

  const persist = async (publish: boolean) => {
    const values = getValues();
    const res = await save.mutateAsync({
      id: savedBasket?.id,
      payload: formValuesToPayload(values, { storeId: savedBasket ? undefined : storeId, publish }),
    });
    setSavedBasket(res.data);
    reset(values);
    return res.data;
  };

  const handleSaveDraft = async () => {
    if (!(await trigger("name"))) {
      goTo(stepIndex("info"));
      errorToast({ description: "Add a basket name before saving." });
      return;
    }
    await persist(false).catch(() => undefined);
  };

  const handlePublish = async () => {
    for (const step of STEPS) {
      if (!(await validateStep(step.id))) return goTo(stepIndex(step.id));
    }
    if (pricing?.hasUnavailableItems && getValues("isActive")) {
      errorToast({ description: "Remove unavailable items before publishing an active basket." });
      return goTo(stepIndex("quantities"));
    }
    const wasPublished = isPublished;
    const result = await persist(true).catch(() => null);
    if (!result) return;
    if (wasPublished) router.push(ROUTES.ADMIN.BASKETS.DETAILS(result.id));
    else setPublished(result);
  };

  const createAnother = () => {
    reset(EMPTY_BASKET_FORM);
    setSavedBasket(undefined);
    setPublished(null);
    setCurrent(0);
    setMaxReached(0);
    if (isEdit) router.push(ROUTES.ADMIN.BASKETS.CREATE);
  };

  if (published) return <BasketPublished basket={published} onCreateAnother={createAnother} />;

  if (!storesLoading && !store) {
    return (
      <Empty className="mt-10 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Store />
          </EmptyMedia>
          <EmptyTitle>No store assigned</EmptyTitle>
          <EmptyDescription>
            Baskets are created for a store. Ask an administrator to assign you a store first.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const stepId = stepAt(current);
  const isLast = current === STEPS.length - 1;
  const busy = save.isPending;
  const title = isEdit ? `Edit ${basket!.name}` : "Create a basket";

  const showAside = stepId === "type" || stepId === "info" || stepId === "quantities";
  const storeForSwitcher = savedBasket?.store
    ? (stores.find((s) => s.id === savedBasket.storeId) ?? {
        ...savedBasket.store,
        storeImage: null,
        city: null,
        status: null,
      })
    : activeStore;

  return (
    <FormProvider {...form}>
      <div ref={topRef} className="scroll-mt-24 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Baskets", href: ROUTES.ADMIN.BASKETS.ROOT },
            ...(savedBasket
              ? [{ label: savedBasket.name, href: ROUTES.ADMIN.BASKETS.DETAILS(savedBasket.id) }]
              : []),
            { label: isEdit ? "Edit" : "Create", active: true },
          ]}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 py-6 text-white sm:px-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 left-1/3 size-56 rounded-full bg-white/10"
            />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur sm:flex">
                  <ShoppingBasket className="size-7" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
                    {savedBasket && (
                      <BasketStatusBadge status={savedBasket.status} className="bg-white/90" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-emerald-50/90">
                    Build a ready-to-buy basket from your store&apos;s catalogue in a few simple
                    steps.
                  </p>
                </div>
              </div>
              <BasketStoreSwitcher
                stores={stores}
                activeStore={storeForSwitcher}
                onChange={setActiveStoreId}
                isLoading={storesLoading && !savedBasket}
                disabled={Boolean(savedBasket) || items.length > 0}
                className="text-slate-900"
              />
            </div>
          </div>
          <div className="px-4 py-5 sm:px-8">
            <WizardStepper
              steps={STEPS}
              currentIndex={current}
              maxReachableIndex={maxReached}
              onStepClick={jumpTo}
            />
          </div>
        </div>

        <div className={showAside ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]" : ""}>
          <div
            key={stepId}
            className="animate-in fade-in slide-in-from-bottom-2 min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-950"
          >
            {stepId === "type" && <TypeStep />}
            {stepId === "info" && <InfoStep onChangeType={() => goTo(stepIndex("type"))} />}
            {stepId === "items" && (
              <ItemsStep storeId={storeId} storeName={store?.storeName} pricing={pricing} />
            )}
            {stepId === "quantities" && (
              <QuantitiesStep pricing={pricing} onAddMore={() => goTo(stepIndex("items"))} />
            )}
            {stepId === "pricing" && <PricingStep pricing={pricing} loading={pricingLoading} />}
            {stepId === "image" && (
              <ImageAvailabilityStep
                customerPrice={pricing?.customerPrice}
                originalPrice={pricing?.customerOriginalPrice}
                currencySymbol={pricing?.currencySymbol}
                isPublished={isPublished}
              />
            )}
            {stepId === "review" && (
              <ReviewStep
                pricing={pricing}
                pricingLoading={pricingLoading}
                onEditStep={(id) => goTo(stepIndex(id))}
              />
            )}
          </div>

          {showAside && (
            <aside className="hidden xl:block">
              <div className="sticky top-24 space-y-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    <span className="relative flex size-2">
                      <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                      <span className="bg-primary relative inline-flex size-2 rounded-full" />
                    </span>
                    Live preview
                  </p>
                  <BasketSummaryCard
                    name={name}
                    shortDescription={shortDescription}
                    basketType={basketType ?? "CUSTOM"}
                    householdSize={householdSize}
                    image={image}
                    itemCount={items.length}
                    totalUnits={pricing?.totalUnits ?? 0}
                    price={pricing?.customerPrice ?? 0}
                    originalPrice={pricing?.customerOriginalPrice}
                    currencySymbol={pricing?.currencySymbol}
                  />
                </div>
                {pricing && (
                  <div className="space-y-2 rounded-3xl border border-slate-200/80 bg-white p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Item discounts</span>
                        <strong className="text-rose-600 tabular-nums">
                          −{formatMoney(pricing.discountAmount, pricing.currencySymbol)}
                        </strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food Remit markup</span>
                      <strong className="tabular-nums">
                        +{formatMoney(pricing.markupAmount, pricing.currencySymbol)}
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 dark:border-slate-700">
                      <span className="font-semibold">Your estimated payout</span>
                      <strong className="text-sm tabular-nums">
                        {formatMoney(pricing.estimatedPayout, pricing.currencySymbol)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="sticky bottom-3 z-30 mt-6">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-md sm:px-4 dark:border-slate-800 dark:bg-slate-950/95">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              current === 0 ? router.push(ROUTES.ADMIN.BASKETS.ROOT) : goTo(current - 1)
            }
            disabled={busy}
            className="h-10 rounded-xl"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{current === 0 ? "Cancel" : "Back"}</span>
          </Button>
          <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 md:flex dark:border-slate-800">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase">Basket price</p>
              <p className="text-sm font-black tabular-nums">
                {pricing ? formatMoney(pricing.customerPrice, pricing.currencySymbol) : "—"}
                {pricing && pricing.customerSavings > 0 && (
                  <span className="ml-1.5 text-[11px] font-medium text-slate-400 line-through">
                    {formatMoney(pricing.customerOriginalPrice, pricing.currencySymbol)}
                  </span>
                )}
              </p>
            </div>
            <span className="text-muted-foreground text-xs">
              {items.length} items · Step {current + 1}/{STEPS.length}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isPublished && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={busy}
                className="h-10 rounded-xl"
              >
                {busy && !isLast ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                <span className="hidden sm:inline">Save draft</span>
              </Button>
            )}
            {isPublished && !isLast && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePublish}
                disabled={busy}
                className="h-10 rounded-xl"
              >
                <Save className="size-4" />
                <span className="hidden sm:inline">Save changes</span>
              </Button>
            )}
            {isLast ? (
              <Button
                type="button"
                onClick={handlePublish}
                disabled={busy}
                className="h-11 rounded-xl px-6 shadow-md shadow-emerald-600/20"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isPublished ? (
                  <Save className="size-4" />
                ) : (
                  <Rocket className="size-4" />
                )}
                {isPublished ? "Save changes" : "Publish basket"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={next}
                disabled={busy}
                className="h-11 rounded-xl px-6 shadow-md shadow-emerald-600/20"
              >
                Next <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
