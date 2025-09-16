import React from 'react'
import Image from 'next/image'

interface LinkedInShareProps {
  referralCode: string | null
}

const LinkedInShare: React.FC<LinkedInShareProps> = ({ referralCode }) => {
  return (
    <div className="max-w-4xl w-full">
      <div className="relative w-full rounded-lg overflow-hidden mb-6 h-64 sm:h-96 bg-gray-100">
        {/* Background image */}
        <Image
          src="/referral-graphic.png"
          alt="Next Voters Fellowship Background"
          fill
          className="object-cover"
        />

        {/* Referral code overlay */}
        {referralCode && (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <p className="text-xs sm:text-2xl font-extrabold text-yellow-300 text-center">
              {referralCode}
            </p>
          </div>
        )}
      </div>

      {/* Screenshot notes */}
      <div className="space-y-2 mb-6">
        <p className="text-sm text-gray-600 text-center">
          📸 Take a screenshot of your certificate above to share on social media
        </p>
        <p className="text-sm text-gray-600 text-center">
          💡 You can also use the LinkedIn button below to share your referral code
        </p>
      </div>
    </div>
  )
}

export default LinkedInShare
