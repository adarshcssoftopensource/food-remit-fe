import { BasketEditor } from "@/feature/private/(store-admin)/basket-management/components/builder/basket-editor";

interface EditBasketPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBasketPage({ params }: EditBasketPageProps) {
  const { id } = await params;
  return <BasketEditor id={id} />;
}
