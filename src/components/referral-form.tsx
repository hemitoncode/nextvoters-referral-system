import React from 'react'
import Button from './ui/button'
import switchScreen from '@/lib/switch-screen'
import { generateReferralCode } from '@/lib/referral-utils'

const ReferralForm = () => {
  const handleSubmit = () => {
    generateReferralCode()
    switchScreen('share')
  }

  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
        Create Your Referral Code
      </h1>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          placeholder="Enter your email address"
        />
      </div>
        
      <Button onClick={handleSubmit}>
        Create my referral code
      </Button>
    </div>
  )
}

export default ReferralForm
