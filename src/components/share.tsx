import React, { useState } from 'react'
import Image from 'next/image'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'
import { ShareType } from '@/types/share'

const Share = () => {
  const referralCode = getReferralCode()
  const [shareType, setShareType] = useState<ShareType>("linkedin")

  const handleToggleShare = () => {
    setShareType(shareType === "linkedin" ? "instagram" : "linkedin")
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
              <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs sm:text-2xl font-extrabold text-yellow-300 text-center">
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
        </>
      ) : (
        <p className="text-gray-600">No referral code generated yet.</p>
      )}

      <Button onClick={handleToggleShare} className="w-full">
        {shareType === "linkedin" ? (
          <>
            Share on Instagram
          </>
        ) : (
          <>
            Share on LinkedIn
          </>
        )}
      </Button>
    </div>
  )
}

export default Share
