import { PartnerLeadDetail } from "@/feature/private/(store-admin)/partner-leads/detail";

export default async function PartnerLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PartnerLeadDetail id={id} />;
}
