import React, { useState, useRef } from 'react'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'
import { ShareType } from '@/types/share'
import DownloadFullScreenWrapper from './wrappers/download-fullscreen'

const Share = () => {
  const referralCode = getReferralCode()
  const [shareType, setShareType] = useState<ShareType>("linkedin")
  const fullScreenRef = useRef<HTMLDivElement | null>(null) 

  return (
    <div className="max-w-4xl w-full">      
      {referralCode ? (
        <>
          {shareType === "linkedin" ? (
          <DownloadFullScreenWrapper 
            referralCode={referralCode} 
            fullScreenRef={fullScreenRef} 
            imageName="/referral-graphic.png"
          />          
        ) : (
          <DownloadFullScreenWrapper 
            referralCode={referralCode} 
            fullScreenRef={fullScreenRef} 
            imageName="/referral-graphic-small.png"
          />          
        )}
        </>
      ) : (
        <p className="text-gray-600">No referral code generated yet.</p>
      )}

    </div>
  )
}

export default Share
