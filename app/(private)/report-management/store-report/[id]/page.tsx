import { StoreReportDetail } from "@/feature/private/report-management/components/store-report-detail";

interface StoreReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreReportDetailPage({ params }: StoreReportDetailPageProps) {
  const { id } = await params;
  return <StoreReportDetail storeId={id} />;
}
