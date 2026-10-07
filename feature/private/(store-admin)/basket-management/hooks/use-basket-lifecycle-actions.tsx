"use client";

import { useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";

import { ScheduleInactiveDialog } from "../components/shared/schedule-inactive-dialog";
import type { Basket } from "../types/basket.types";
import { usePublishBasket, useScheduleBasketInactive } from "./use-basket-lifecycle";
import { useUpdateBasketStatus } from "./use-update-basket-status";

/**
 * Publish / Set Inactive / Reactivate / Schedule Inactive for list and detail
 * views. Render `dialogs` once in the consuming component.
 */
export function useBasketLifecycleActions() {
  const publishMutation = usePublishBasket();
  const statusMutation = useUpdateBasketStatus();
  const scheduleMutation = useScheduleBasketInactive();
  const [confirmInactive, setConfirmInactive] = useState<Basket | null>(null);
  const [scheduling, setScheduling] = useState<Basket | null>(null);

  const pendingId =
    (publishMutation.isPending && publishMutation.variables?.id) ||
    (statusMutation.isPending && statusMutation.variables?.id) ||
    null;

  const dialogs = (
    <>
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
      <ScheduleInactiveDialog
        basket={scheduling}
        onOpenChange={(open) => !open && setScheduling(null)}
        isPending={scheduleMutation.isPending}
        onSubmit={async (at) => {
          if (!scheduling) return;
          await scheduleMutation.mutateAsync({ id: scheduling.id, at });
          setScheduling(null);
        }}
      />
    </>
  );

  return {
    publish: (basket: Basket) => publishMutation.mutate({ id: basket.id }),
    reactivate: (basket: Basket) => statusMutation.mutate({ id: basket.id, status: "ACTIVE" }),
    setInactive: setConfirmInactive,
    scheduleInactive: setScheduling,
    pendingId,
    dialogs,
  };
}
