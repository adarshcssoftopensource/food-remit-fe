"use client";

import { useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";

import type { Basket } from "../types/basket.types";
import { usePublishBasket } from "./use-basket-lifecycle";
import { useUpdateBasketStatus } from "./use-update-basket-status";

/**
 * Publish / Set Inactive / Reactivate for list and detail
 * views. Render `dialogs` once in the consuming component.
 */
export function useBasketLifecycleActions() {
  const publishMutation = usePublishBasket();
  const statusMutation = useUpdateBasketStatus();
  const [confirmInactive, setConfirmInactive] = useState<Basket | null>(null);

  const pendingId =
    (publishMutation.isPending && publishMutation.variables?.id) ||
    (statusMutation.isPending && statusMutation.variables?.id) ||
    null;

  const dialogs = (
    <ConfirmationDialog
      open={Boolean(confirmInactive)}
      onOpenChange={(open) => !open && setConfirmInactive(null)}
      title="Set basket inactive?"
      description={`"${confirmInactive?.name ?? ""}" will be hidden from customers. You can reactivate it anytime.`}
      confirmLabel="Set Inactive"
      isLoading={statusMutation.isPending}
      onConfirm={async () => {
        if (!confirmInactive) return;
        await statusMutation.mutateAsync({ id: confirmInactive.id, status: "INACTIVE" });
        setConfirmInactive(null);
      }}
    />
  );

  const toggleStatus = async (basket: Basket, status: "ACTIVE" | "INACTIVE") => {
    await statusMutation.mutateAsync({ id: basket.id, status });
  };

  return {
    publish: (basket: Basket) => publishMutation.mutate({ id: basket.id }),
    reactivate: (basket: Basket) => statusMutation.mutate({ id: basket.id, status: "ACTIVE" }),
    setInactive: (basket: Basket) => statusMutation.mutate({ id: basket.id, status: "INACTIVE" }),
    promptSetInactive: setConfirmInactive,
    toggleStatus,
    pendingId,
    dialogs,
  };
}
