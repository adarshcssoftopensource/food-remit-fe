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

export function VendorLandingPage() {
  return (
    <div className="vendor-landing bg-white text-slate-950 antialiased">
      <SiteHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyJoinSection />
        <RevenueSection />
        <HowItWorksSection />
        <BenefitsSection />
        <BusinessTypesSection />
        <OpportunitySection />
        <DifferentSection />
        <SuccessSection />
        <TrustSection />
        <TestimonialsSection />
        <FaqSection />
        <JoinSection />
      </main>
      <SiteFooter />
      <FloatingCta />
    </div>
  );
}
