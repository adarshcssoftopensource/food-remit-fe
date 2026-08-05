import { notFound } from "next/navigation";

import { MOCK_STORE_REPORTS } from "@/constants/report-management";
import { StoreReportDetail } from "@/feature/private/report-management/components/store-report-detail";

interface StoreReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreReportDetailPage({ params }: StoreReportDetailPageProps) {
  const { id } = await params;
  const store = MOCK_STORE_REPORTS.find((item) => item.id === id);

  if (!store) {
    notFound();
  }

  return <StoreReportDetail store={store} />;
}
