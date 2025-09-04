import React, { useState } from 'react'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'
import { platformType } from '@/types/platform'

const Share = () => {
  const referralCode = getReferralCode()
  const [platform, setPlatform] = useState<platformType>('linkedin')

  const handleLinkedInShare = () => {
    const text = `THRILLED TO BE A 2025 NEXT VOTERS FELLOW FINALIST! 🎉\n\nThis fellowship is for college & exceptional high school students who want to shape the future of democracy.\n\nFellows learn directly from Political Science professors like Morris Fiorina (Stanford) and Diana Mutz (UPenn), access $10,000+ in scholarships, and more.\n\nApplications are still open. Deadline to apply: September 14\n\nUse my referral code: ${referralCode}`
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nextvoters.org')}&title=${encodeURIComponent('Next Voters Fellowship Finalist')}&summary=${encodeURIComponent(text)}`
    
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  const handleInstagramShare = () => {
    const text = `THRILLED TO BE A 2025 NEXT VOTERS FELLOW FINALIST! 🎉\n\nThis fellowship is for college & exceptional high school students who want to shape the future of democracy.\n\nFellows learn directly from Political Science professors like Morris Fiorina (Stanford) and Diana Mutz (UPenn), access $10,000+ in scholarships, and more.\n\nApplications are still open. Deadline to apply: September 14\n\nUse my referral code: ${referralCode}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Next Voters Fellowship Finalist',
        text: text,
        url: 'https://nextvoters.org'
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const handleShare = () => {
    if (platform === 'linkedin') {
      handleLinkedInShare()
    } else {
      handleInstagramShare()
    }
  }

  const getPlatformName = () => {
    return platform === 'linkedin' ? 'LinkedIn' : 'Instagram'
  }

  return (
    <div className="max-w-4xl w-full">      
      {referralCode ? (
        <>
          {/* Platform Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button
                onClick={() => setPlatform('linkedin')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  platform === 'linkedin' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => setPlatform('instagram')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  platform === 'instagram' 
                    ? 'bg-white text-pink-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Instagram
              </button>
            </div>
          </div>

          <div className="relative bg-gray-100 p-6 rounded-lg mb-6 overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
              {/* Single Background PNG Image */}
              <img 
                src="/referral-graphic.png" 
                alt={`Next Voters Fellowship Background for ${getPlatformName()}`}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* HTML Text Overlay with Tailwind Absolute Positioning */}
              <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-yellow-300 text-center">
                {referralCode}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleShare} className="w-full" variant='secondary'>
              Share on {getPlatformName()}
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
