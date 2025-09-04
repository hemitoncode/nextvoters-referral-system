import React, { useState } from 'react'
import Button from './ui/button'
import switchScreen from '@/lib/switch-screen'
import { generateReferralCode, getReferralCode } from '@/lib/referral-utils'
import { addVerificationCode } from '@/lib/verification-utils'

const ReferralForm = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      if (!email) {
        throw new Error("Email is empty. Cannot continue forward until we have a email")
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email")
      } 
      
      generateReferralCode()
      
      let referralCode = getReferralCode()
      
      let attempts = 0
      const maxAttempts = 5
      let result = null
      
      while (attempts < maxAttempts) {
        result = await addVerificationCode(referralCode, email)
        
        if (result.success) {
          console.log('Verification code saved successfully:', result.code)
          break
        } else if (result.error === 'Verification code already exists') {
          throw new Error('Code conflict detected, regenerating...')
          generateReferralCode()
          referralCode = getReferralCode()
          attempts++
        } else {
          throw new Error(`Failed to save verification code: ${result.error}`)
          break
        }
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Unable to generate a unique verification code. Please try again.')
        return
      }
      
      switchScreen('share')
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          placeholder="Enter your email address"
        />
      </div>
        
      <Button onClick={handleSubmit}>
        {isLoading ? 'Creating...' : 'Create my referral code'}
      </Button>
    </div>
  )
}

export default ReferralForm
