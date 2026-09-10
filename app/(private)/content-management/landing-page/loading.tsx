import { PageHeader } from "@/components/common/page-header";
import { LandingPageSkeleton } from "@/feature/private/content-management/landing-page/components/landing-page-skeleton";

export default function LandingPageLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Page"
        description="Edit vendor landing sections. Navbar and Become a Vendor Partner stay system-controlled."
      />
      <LandingPageSkeleton />
    </div>
  );
}
