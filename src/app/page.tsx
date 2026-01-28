import ImpactSection from '@/components/ImpactSection'
import { HeroSection } from '@/components/landing-page/sections/HeroSection'
import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      <HeroSection />
      <ImpactSection />
    </div>
  )
}
