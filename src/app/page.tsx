import SolutionSection from '@/components/SolutionSection'
import CommitmentJourney from '@/components/CommitmentJourney/CommitmentJourney'
import ImpactSection from '@/components/ImpactSection'
import { HeroSection } from "@/components/landing-page/sections/HeroSection";
import { Navigation } from "@/components/landing-page/Navigation";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Navigation />
      <main id="main-content">
        <HeroSection />
      <CommitmentJourney />
      <ImpactSection />
      <SolutionSection />
      </main>
    </div>

  )
}