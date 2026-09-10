import { Metadata } from "next";
import { CreditDetailPage } from "@/feature/private/credits-management/credit-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Credit Request Details | Food Remit",
  description: "View credit details, unmarked items, and execute refund payout.",
};

export default async function CreditsManagementDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CreditDetailPage id={id} />;
}
