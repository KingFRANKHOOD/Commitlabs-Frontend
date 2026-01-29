'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreateCommitmentStepSelectType from '@/components/CreateCommitmentStepSelectType'

export default function CreateCommitment() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<'safe' | 'balanced' | 'aggressive' | null>(null)

  const handleSelectType = (type: 'safe' | 'balanced' | 'aggressive') => {
    setSelectedType(type)
  }

  const handleNext = (type: 'safe' | 'balanced' | 'aggressive') => {
    // For now, just log and show alert
    console.log('Selected commitment type:', type)
    alert(`Proceeding to next step with ${type} commitment type`)
    // In a real implementation, you would navigate to step 2
    // setStep(2)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      // Navigate back to home or previous page
      window.location.href = '/'
    }
  }

  // Render Step 1 - Select Type
  if (step === 1) {
    return (
      <CreateCommitmentStepSelectType
        selectedType={selectedType}
        onSelectType={handleSelectType}
        onNext={handleNext}
        onBack={handleBack}
      />
    )
  }

  // Future steps would be rendered here
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Step {step}</h1>
        <p className="text-gray-400 mb-8">Future steps will be implemented here</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

