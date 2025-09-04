import React from 'react'
import Button from './ui/button'
import switchScreen from '@/lib/switch-screen'

const HeroScreen = () => {
  return (
    <div className="max-w-2xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Congrats on being selected as a finalist! 🎉
        </h1>
      </div>
      
      <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
        We received incredible applications from students across USA & Canada, and loved how you answered our 2 essay prompts.
      </p>
      
      <Button onClick={() => switchScreen('what-it-means')}>
        Next
      </Button>
    </div>
  )
}

export default HeroScreen
