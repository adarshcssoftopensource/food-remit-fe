import { BasketDetails } from "@/feature/private/(store-admin)/basket-management/components/detail/basket-details";

interface BasketDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BasketDetailsPage({ params }: BasketDetailsPageProps) {
  const { id } = await params;
  return <BasketDetails id={id} />;
}
