import CountryManagerViewPage from "@/feature/private/(super-admin)/country-management/components/country-manager-view";

export interface CountryManagerViewPageProps {
  params: Promise<{ id: string }>;
}

function page({ params }: CountryManagerViewPageProps) {
  return <CountryManagerViewPage params={params} />;
}

export default page;
