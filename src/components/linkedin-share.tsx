import React from 'react'
import Image from 'next/image'

interface LinkedInShareProps {
  referralCode: string | null
}

const LinkedInShare: React.FC<LinkedInShareProps> = ({ referralCode }) => {
  return (
    <div className="w-full">
      <div className="relative w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden mb-6 shadow-2xl h-[500px] sm:h-[700px] bg-gray-200">
        {/* Image container */}
        <div className="relative w-full h-full">
          <Image
            src="/referral-graphic.png"
            alt="Next Voters Fellowship Background"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Referral code overlay */}
        {referralCode && (
          <div className="absolute inset-0 flex items-end justify-center pb-25">
            <div className="bg-opacity-40 px-5 py-2 rounded-md">
              <p className="text-base sm:text-lg md:text-2xl font-semibold text-yellow-300 text-center">
                {referralCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot notes */}
      <div className="space-y-2 mb-6">
        <p className="text-sm sm:text-base text-gray-700 text-center">
          📸 Take a screenshot of your certificate above to share on social media
        </p>
        <p className="text-sm sm:text-base text-gray-700 text-center">
          💡 You can also use the LinkedIn button below to share your referral code
        </p>
      </div>
    </div>
  )
}

export default LinkedInShare
