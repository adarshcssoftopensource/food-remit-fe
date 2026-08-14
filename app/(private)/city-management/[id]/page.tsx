import CityManagerViewPage from "@/feature/private/city-management/components/city-manager-view";

export interface CityManagerViewPageProps {
  params: Promise<{ id: string }>;
}

function page({ params }: CityManagerViewPageProps) {
  return <CityManagerViewPage params={params} />;
}

export default page;
