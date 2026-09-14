import { CustomerReportDetail } from "@/feature/private/report-management/components/customer-report-detail";

interface CustomerReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerReportDetailPage({ params }: CustomerReportDetailPageProps) {
  const { id } = await params;
  return <CustomerReportDetail customerId={id} />;
}
