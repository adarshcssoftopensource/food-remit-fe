import { ProductBoxDetail } from "@/feature/private/(super-admin)/product-boxes-management/detail";

export default async function ProductBoxDetailPage({
  params,
}: {
  params: Promise<{ boxId: string }>;
}) {
  const { boxId } = await params;
  return <ProductBoxDetail boxId={boxId} />;
}
