import SolutionSection from '@/components/SolutionSection'
import CommitmentJourney from '@/components/CommitmentJourney/CommitmentJourney'
import { HeroSection } from '@/components/landing-page/sections/HeroSection'
import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      <HeroSection />
      <CommitmentJourney />
      <SolutionSection />
    </div>

  )
}
