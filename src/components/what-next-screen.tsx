import React from 'react'
import Button from './ui/button'
import switchScreen from '@/lib/switch-screen'

const WhatNextScreen = () => {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
        What&apos;s next?
      </h1>
      
      <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
        A key role fellows will play will be on spreading the word about Next Voters technology to empower voters. That&apos;s why for the last part of the application process, we want to see your ability to spread the word. On the next screen, you&apos;ll get a graphic with a referral code for the fellowship you can post on LinkedIn and/or your Instagram story. Your referral code will be tracked on incoming applications and tied back to your application, helping to boost your chances.
      </p>
      
      <Button onClick={() => switchScreen('referral-form')}>
        Next
      </Button>
    </div>
  )
}

export default WhatNextScreen