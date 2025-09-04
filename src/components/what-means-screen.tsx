import React from 'react'
import Button from './ui/button'
import switchScreen from '@/lib/switch-screen'

const WhatMeansScreen = () => {

  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
        What does it mean to be a Next Voters Fellowship Finalist?
      </h1>
      
      <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
        All Finalists will receive an invite to join our exclusive community of other finalists, selected fellows, and the Next Voters team. Even if you're not selected as a fellow, you'll be part of a community of people who want to shape the future of democracy.
      </p>
      
      <Button onClick={() => switchScreen('what-next')}>
        Next
      </Button>
    </div>
  )
}

export default WhatMeansScreen
