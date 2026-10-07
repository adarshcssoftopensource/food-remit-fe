"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Save, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
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
import { cn } from "@/lib/utils";

import { useActiveBasketStore } from "../../hooks/use-active-basket-store";
import { useBasketPricingPreview } from "../../hooks/use-basket-pricing-preview";
import { useSaveBasket } from "../../hooks/use-save-basket";
import {
  EMPTY_BASKET_FORM,
  basketFormSchema,
  basketToFormValues,
  formValuesToPayload,
  getPublishIssues,
  pricingOptionsOf,
  type BasketFormValues,
  type BasketSectionId,
} from "../../schema/basket-form.schema";
import type { BasketDetail } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";
import { BasketStatusBadge } from "../shared/basket-badges";
import { BasketStoreSwitcher } from "../shared/basket-store-switcher";
import { BasketPublished } from "./basket-published";
import { sectionDomId } from "./section-card";
import { AvailabilitySection } from "./sections/availability-section";
import { ContentsSection } from "./sections/contents-section";
import { ImageSection } from "./sections/image-section";
import { InformationSection } from "./sections/information-section";
import { PricingSection } from "./sections/pricing-section";
import { SummarySection } from "./sections/summary-section";
import { TemplateSection } from "./sections/template-section";

interface BasketBuilderProps {
  basket?: BasketDetail;
}

const scrollToSection = (id: BasketSectionId) =>
  document.getElementById(sectionDomId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Single guided page to create a basket, edit a draft, or edit a published basket */
export function BasketBuilder({ basket }: BasketBuilderProps) {
  const router = useRouter();
  const {
    stores,
    activeStore,
    setActiveStoreId,
    isLoading: storesLoading,
  } = useActiveBasketStore();

  const [published, setPublished] = useState<BasketDetail | null>(null);
  const [showIssues, setShowIssues] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const form = useForm<BasketFormValues, unknown, z.output<typeof basketFormSchema>>({
    resolver: zodResolver(basketFormSchema),
    defaultValues: basket ? basketToFormValues(basket) : EMPTY_BASKET_FORM,
    mode: "onTouched",
  });
  const { control, trigger, getValues, reset, setError, formState } = form;
  const values = useWatch({ control }) as BasketFormValues;
  const { items, pricingMode, vendorDiscountPercent, manualVendorPrice } = values;

  const store =
    basket?.store ??
    (activeStore ? { id: activeStore.id, storeName: activeStore.storeName } : null);
  const storeId = basket?.storeId ?? store?.id;
  const isPublished = Boolean(basket && basket.status !== "DRAFT");
  const isDraft = basket?.status === "DRAFT";

  const pricingInput = useMemo(
    () => items.map(({ itemId, quantity }) => ({ itemId, quantity })),
    [items],
  );
  const pricingQuery = useBasketPricingPreview(
    storeId,
    pricingInput,
    pricingOptionsOf({ pricingMode, vendorDiscountPercent, manualVendorPrice }),
  );
  const pricing = items.length > 0 ? pricingQuery.data : undefined;

  const issues = getPublishIssues(values, pricing);
  const issueSections = new Set(showIssues ? issues.map((i) => i.section) : []);
  const save = useSaveBasket();
  const busy = save.isPending;

  useEffect(() => {
    if (!formState.isDirty || published) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [formState.isDirty, published]);

  const persist = async (publish: boolean) => {
    const current = getValues();
    const res = await save.mutateAsync({
      id: basket?.id,
      payload: formValuesToPayload(current, { storeId: basket ? undefined : storeId, publish }),
    });
    reset(current);
    return res.data;
  };

  const handleSaveDraft = async () => {
    if (!(await trigger())) return;
    const saved = await persist(false).catch(() => null);
    if (saved && !basket) router.replace(ROUTES.ADMIN.BASKETS.EDIT(saved.id));
  };

  /** Create Basket (publish) for new baskets and drafts; Save changes for published baskets */
  const handleSubmit = async () => {
    const valid = await trigger();
    const current = getValues();
    const blocking = getPublishIssues(current, pricing);
    if (!valid || blocking.length) {
      setShowIssues(true);
      for (const issue of blocking) {
        if (issue.field === "name" || issue.field === "description") {
          setError(issue.field, { message: issue.message });
        }
      }
      const first = blocking[0];
      if (first) {
        scrollToSection(first.section);
        errorToast({
          description: isPublished
            ? `Fix before saving: ${first.message}.`
            : `Complete the basket before creating it: ${first.message}.`,
        });
      }
      return;
    }
    const saved = await persist(!isPublished).catch(() => null);
    if (!saved) return;
    if (isPublished) router.push(ROUTES.ADMIN.BASKETS.DETAILS(saved.id));
    else setPublished(saved);
  };

  const cancel = () =>
    formState.isDirty ? setConfirmLeave(true) : router.push(ROUTES.ADMIN.BASKETS.ROOT);

  const createAnother = () => {
    if (basket) return router.push(ROUTES.ADMIN.BASKETS.CREATE);
    reset(EMPTY_BASKET_FORM);
    setPublished(null);
    setShowIssues(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const title = isPublished ? "Edit Basket" : isDraft ? "Edit Draft" : "Create Basket";
  const submitLabel = isPublished ? "Save Changes" : "Create Basket";
  const storeForSwitcher = basket?.store
    ? (stores.find((s) => s.id === basket.storeId) ?? {
        ...basket.store,
        storeImage: null,
        city: null,
        status: null,
      })
    : activeStore;

  const actions = (size: "header" | "footer") => (
    <div className={cn("flex items-center gap-2", size === "footer" && "ml-auto")}>
      <Button
        type="button"
        variant="outline"
        onClick={cancel}
        disabled={busy}
        className="h-10 rounded-xl"
      >
        Cancel
      </Button>
      {!isPublished && (
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={busy}
          className="text-primary h-10 rounded-xl border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900"
        >
          {busy && save.variables?.payload.publish === false ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span className={size === "footer" ? "hidden sm:inline" : ""}>Save as Draft</span>
        </Button>
      )}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={busy}
        className="h-10 rounded-xl px-5 shadow-md shadow-emerald-600/20"
      >
        {busy && save.variables?.payload.publish !== false ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CheckCircle2 className="size-4" />
        )}
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <FormProvider {...form}>
      <div className="space-y-5">
        <Breadcrumbs
          items={[
            { label: "Baskets", href: ROUTES.ADMIN.BASKETS.ROOT },
            ...(basket
              ? [
                  {
                    label: basket.name || "Untitled basket",
                    href: ROUTES.ADMIN.BASKETS.DETAILS(basket.id),
                  },
                ]
              : []),
            { label: basket ? "Edit" : "Create", active: true },
          ]}
        />

        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-950">
          <div className="min-w-0 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  {title}
                </h1>
                {basket && <BasketStatusBadge status={basket.status} />}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Build a ready-to-buy basket by selecting a template, adding items, setting pricing,
                availability, and image.
              </p>
            </div>
            <BasketStoreSwitcher
              stores={stores}
              activeStore={storeForSwitcher}
              onChange={setActiveStoreId}
              isLoading={storesLoading && !basket}
              disabled={Boolean(basket) || items.length > 0}
            />
          </div>
          <div className="hidden lg:block">{actions("header")}</div>
        </header>

        <TemplateSection hasIssue={issueSections.has("template")} />
        <InformationSection hasIssue={issueSections.has("information")} />
        <ContentsSection
          storeId={storeId}
          pricing={pricing}
          hasIssue={issueSections.has("contents")}
        />
        <PricingSection
          pricing={pricing}
          loading={pricingQuery.isFetching}
          hasIssue={issueSections.has("pricing")}
        />
        <AvailabilitySection hasIssue={issueSections.has("availability")} />
        <ImageSection />
        <SummarySection
          pricing={pricing}
          issues={issues}
          onJump={scrollToSection}
          statusNote={
            isPublished
              ? `${basket?.status === "ACTIVE" ? "Active" : "Inactive"} · status unchanged`
              : "Active · Visible to customers"
          }
        />
      </div>

      <div className="sticky bottom-3 z-30 mt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-md sm:px-4 dark:border-slate-800 dark:bg-slate-950/95">
          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">
              Final customer price
            </p>
            <p className="text-sm font-black tabular-nums">
              {pricing ? formatMoney(pricing.customerPrice, pricing.currencySymbol) : "—"}
              {pricing && pricing.savingsPercent > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                  {pricing.savingsPercent}% off
                </span>
              )}
            </p>
          </div>
          <span className="text-muted-foreground hidden text-xs md:inline">
            {items.length} items
            {pricing
              ? ` · You receive ${formatMoney(pricing.estimatedPayout, pricing.currencySymbol)}`
              : ""}
          </span>
          {actions("footer")}
        </div>
      </div>

      <ConfirmationDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Discard unsaved changes?"
        description="Your changes to this basket haven't been saved. Save it as a draft to keep working on it later."
        confirmLabel="Discard changes"
        variant="destructive"
        onConfirm={() => {
          setConfirmLeave(false);
          reset(getValues());
          router.push(ROUTES.ADMIN.BASKETS.ROOT);
        }}
      />
    </FormProvider>
  );
}
