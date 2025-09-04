import React from 'react'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'

const Share = () => {

  const referralCode = getReferralCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
  }

  const handleShare = () => {
    const text = `Check out Next Voters Fellowship! Use my referral code: ${referralCode}`
    if (navigator.share) {
      navigator.share({
        title: 'Next Voters Fellowship',
        text: text,
        url: 'https://nextvoters.org'
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">
        Your Referral Code
      </h1>
      
      {referralCode ? (
        <>
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Your unique referral code:</p>
            <p className="text-2xl font-mono font-bold text-blue-600">{referralCode}</p>
          </div>
          
          <div className="space-y-4">
            <Button onClick={handleCopy} variant="secondary" className="w-full">
              Copy Code
            </Button>
            <Button onClick={handleShare} className="w-full">
              Share
            </Button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No referral code generated yet.</p>
      )}
    </div>
  )
}

export default Share