import { ShoppingBasket } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/config/routes";

export function BasketNotFound() {
  return (
    <Empty className="mt-10 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBasket />
        </EmptyMedia>
        <EmptyTitle>Basket not found</EmptyTitle>
        <EmptyDescription>
          This basket may have been deleted or belongs to another store.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={ROUTES.ADMIN.BASKETS.ROOT} className={buttonVariants()}>
          Back to baskets
        </Link>
      </EmptyContent>
    </Empty>
  );
}
