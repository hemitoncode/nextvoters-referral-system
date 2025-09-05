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
        throw new Error("Please enter an email address")
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format")
      }

      let attempts = 0
      const maxAttempts = 5
      let success = false

      while (attempts < maxAttempts && !success) {
        attempts++
        generateReferralCode()
        const referralCode = getReferralCode()

        const result = await addVerificationCode(referralCode, email)

        if (result?.success) {
          success = true
          switchScreen('share')
        } else if (result?.error === 'Verification code already exists') {
          // retry with new code
          continue
        } else {
          throw new Error(result?.error || 'Unknown error occurred')
        }
      }

      if (!success) {
        throw new Error('Unable to generate a unique referral code. Please try again.')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
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
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
