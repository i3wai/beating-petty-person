import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/HeroSection";
import { WhatIsSection } from "@/components/WhatIsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TrustSection } from "@/components/TrustSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { FooterNote } from "@/components/FooterNote";

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
      <FinalCtaSection />
      <FooterNote />
    </div>
  );
}
