import React, { useState } from 'react'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'
import { ShareType } from '@/types/share'
import LinkedInShare from './linkedin-share'
import InstaShare from './insta-share'

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
          {shareType === "linkedin" ? (
            <LinkedInShare referralCode={referralCode} />
          ) : (
            <InstaShare referralCode={referralCode} />
          )}
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
