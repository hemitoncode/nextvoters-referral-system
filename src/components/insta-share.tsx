import React, { useRef, useState } from 'react'
import Image from 'next/image'

interface InstaShareProps {
    referralCode: string | null
}

const InstaShare: React.FC<InstaShareProps> = ({ referralCode }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const fullScreenRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="relative w-full rounded-lg overflow-hidden mb-6 bg-gray-100">
        {/* Responsive container using aspect ratio */}
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <Image
            src="/referral-graphic-small.png"
            alt="Next Voters Fellowship Background"
            fill
            className="object-contain"
          />
        </div>

        {/* Referral code overlay */}
        {referralCode && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <p className="text-xs sm:text-2xl font-extrabold text-yellow-300 text-center">
              {referralCode}
            </p>
          </div>
        )}
      </div>

      {/* Screenshot notes */}
      <div className="space-y-2 mb-6 text-center text-gray-600">
        <p className="text-sm">📸 Take a screenshot of your certificate above to share on social media</p>
        <p className="text-sm">💡 You can also use the LinkedIn button below to share your referral code</p>
      </div>
    </div>
  )
}

export default InstaShare
