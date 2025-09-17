import React, { useState, useRef } from 'react'
import DownloadFullScreenWrapper from './wrappers/download-fullscreen'
import NormalView from './ui/normal-view'

interface InstaShareProps {
  referralCode: string | null
}

const InstaShare: React.FC<InstaShareProps> = ({ referralCode }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const fullScreenRef = useRef<HTMLDivElement | null>(null)

  return (
    <div>
      {/* Fullscreen overlay */}
      {isFullScreen && (
        <DownloadFullScreenWrapper 
          referralCode={referralCode} 
          fullScreenRef={fullScreenRef} 
          setIsFullScreen={setIsFullScreen} 
          imageName="/referral-graphic-small.png"
        />
      )}

      {/* Normal view */}
      {!isFullScreen && (
        <NormalView setIsFullScreen={setIsFullScreen} />
      )}
    </div>
  )
}

export default InstaShare