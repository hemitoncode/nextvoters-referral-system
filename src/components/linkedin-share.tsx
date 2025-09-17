import React, { useState, useRef } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import DownloadFullScreenWrapper from './wrappers/download-fullscreen'
import NormalView from './ui/normal-view'

interface LinkedInShareProps {
  referralCode: string | null
}

const LinkedInShare: React.FC<LinkedInShareProps> = ({ referralCode }) => {
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
        />
      )}

      {/* Normal view */}
      {!isFullScreen && (
        <NormalView setIsFullScreen={setIsFullScreen} />
      )}
    </div>
  )
}

export default LinkedInShare