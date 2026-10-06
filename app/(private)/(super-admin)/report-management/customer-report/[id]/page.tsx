import { CustomerReportDetail } from "@/feature/private/(super-admin)/report-management/components/customer-report/customer-report-detail";

interface CustomerReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerReportDetailPage({ params }: CustomerReportDetailPageProps) {
  const { id } = await params;
  return <CustomerReportDetail customerId={id} />;
}
