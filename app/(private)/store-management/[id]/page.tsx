import StoreViewPage from "@/feature/private/store-management/components/store-view";

export interface StoreViewPageProps {
  params: Promise<{ id: string }>;
}

function page({ params }: StoreViewPageProps) {
  return <StoreViewPage params={params} />;
}

export default page;
