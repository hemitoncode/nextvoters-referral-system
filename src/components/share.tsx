import React from 'react'
import Image from 'next/image'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'

const Share = () => {
  const referralCode = getReferralCode()

  const handleLinkedInShare = () => {
    const text = `THRILLED TO BE A 2025 NEXT VOTERS FELLOW FINALIST! 🎉\n\nThis fellowship is for college & exceptional high school students who want to shape the future of democracy.\n\nFellows learn directly from Political Science professors like Morris Fiorina (Stanford) and Diana Mutz (UPenn), access $10,000+ in scholarships, and more.\n\nApplications are still open. Deadline to apply: September 14\n\nUse my referral code: ${referralCode}`
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nextvoters.org')}&title=${encodeURIComponent('Next Voters Fellowship Finalist')}&summary=${encodeURIComponent(text)}`
    
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div className="max-w-4xl w-full">      
      {referralCode ? (
        <>
          <div className="relative bg-gray-100 p-6 rounded-lg mb-6 overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
              {/* Single Background PNG Image */}
              <Image 
                src="/referral-graphic.png" 
                alt="Next Voters Fellowship Background"
                fill
                className="object-cover"
              />
              
              {/* HTML Text Overlay with Tailwind Absolute Positioning */}
              <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-yellow-300 text-center">
                {referralCode}
              </p>
            </div>
          </div>

          {/* Screenshot Notes */}
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-600 text-center">
              📸 Take a screenshot of your certificate above to share on social media
            </p>
            <p className="text-sm text-gray-600 text-center">
              💡 You can also use the LinkedIn button below to share your referral code
            </p>
          </div>

          <div className="space-y-4">
            <Button onClick={handleLinkedInShare} className="w-full" variant='secondary'>
              Share on LinkedIn
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
