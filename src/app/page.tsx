'use client'

import HeroScreen from '@/components/hero-screen'
import WhatMeansScreen from '@/components/what-means-screen'
import WhatNextScreen from '@/components/what-next-screen'
import ReferralForm from '@/components/referral-form'
import Share from '@/components/share'
import useScreenStore from '@/store/use-screen-store'

export default function Home() {
  const currentScreen = useScreenStore((state) => state.currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'hero':
        return <HeroScreen />
      case 'what-it-means':
        return <WhatMeansScreen />
      case 'what-next':
        return <WhatNextScreen />
      case 'referral-form':
        return <ReferralForm />
      case 'share':
        return <Share />
      default:
        return <HeroScreen />
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {renderScreen()}
    </div>
  )
}
