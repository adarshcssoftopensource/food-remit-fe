"use client";

import { useGetLandingPage } from "@/feature/private/content-management/landing-page/hooks/use-get-landing-page";

import { BenefitsSection } from "./components/benefits-section";
import { BusinessTypesSection } from "./components/business-types-section";
import { DifferentSection } from "./components/different-section";
import { FaqSection } from "./components/faq-section";
import { FloatingCta } from "./components/floating-cta";
import { HeroSection } from "./components/hero-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { JoinSection } from "./components/join-section";
import { OpportunitySection } from "./components/opportunity-section";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { StatsSection, TestimonialsSection } from "./components/stats-section";
import { SuccessSection, TrustSection } from "./components/success-section";
import { RevenueSection, WhyJoinSection } from "./components/why-join-section";
import { mergeLandingContent } from "./lib/merge-landing-content";
import { ProfileLoadingScreen } from "@/components/profile-loading-screen";

export function VendorLandingPage() {
  const { data, isLoading, isError } = useGetLandingPage(false);
  const content = mergeLandingContent(data?.data?.content);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-sm text-slate-500">
        <ProfileLoadingScreen isText={false} />
      </div>
    );
  }

  if (isError && !data?.data?.content) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-white text-sm text-red-600">
        Unable to load landing page.
      </div>
    );
  }

  return (
    <div id="top" className="vendor-landing antialiased">
      <SiteHeader />
      <main>
        <HeroSection data={content.hero} />
        <StatsSection data={content.stats} />
        <WhyJoinSection data={content.whyJoin} />
        <RevenueSection data={content.revenue} />
        <HowItWorksSection data={content.howItWorks} />
        <BenefitsSection data={content.benefits} />
        <BusinessTypesSection data={content.businessTypes} />
        <OpportunitySection data={content.opportunity} />
        <DifferentSection data={content.different} />
        <SuccessSection data={content.success} />
        <TrustSection data={content.trust} />
        <TestimonialsSection data={content.testimonials} />
        <FaqSection data={content.faq} />
        <JoinSection data={content.join} />
      </main>
      <SiteFooter data={content.footer} />
      <FloatingCta />
    </div>
  );
}
