import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/HeroSection";
import { WhatIsSection } from "@/components/WhatIsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TrustSection } from "@/components/TrustSection";
import { AtmosphereSection } from "@/components/AtmosphereSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";


export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingContent />;
}

function LandingContent() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <TrustSection />
      <AtmosphereSection />
      <FaqSection />
      <FinalCtaSection />

    </div>
  );
}
