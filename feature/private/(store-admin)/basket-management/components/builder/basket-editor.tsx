"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useGetBasket } from "../../hooks/use-get-basket";
import { BasketNotFound } from "../shared/basket-not-found";
import { BasketBuilder } from "./basket-builder";

export function BasketEditor({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetBasket(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-80 rounded-xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-120 w-full rounded-2xl" />
      </div>
    );
  }
  if (isError || !data?.data) return <BasketNotFound />;

  return <BasketBuilder key={data.data.id} basket={data.data} />;
}
