import React, { useState, useRef } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import DownloadFullScreenWrapper from './wrappers/download-fullscreen'

interface LinkedInShareProps {
  referralCode: string | null
}

const LinkedInShare: React.FC<LinkedInShareProps> = ({ referralCode }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const fullScreenRef = useRef<HTMLDivElement | null>(null)

  const handleDownload = async () => {
    if (!fullScreenRef.current) return
    
    try {      
      const canvas = await html2canvas(fullScreenRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        logging: false,
        width: fullScreenRef.current.offsetWidth,
        height: fullScreenRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      })
      
      const link = document.createElement('a')
      link.download = `referral-${referralCode || 'image'}.png`
      link.href = canvas.toDataURL('image/png', 0.95)
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to download image. Please try taking a screenshot instead.')
    }
  }

  return (
    <div>
      {/* Fullscreen overlay */}
      {isFullScreen && (
        <DownloadFullScreenWrapper 
          referralCode={referralCode} 
          fullScreenRef={fullScreenRef} 
          setIsFullScreen={setIsFullScreen} 
          handleDownload={handleDownload} 
        />
      )}

      {/* Normal view */}
      {!isFullScreen && (
        <div className="w-full">
          <div 
            className="relative w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden mb-6 shadow-2xl h-[500px] sm:h-[700px]"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/referral-graphic.png"
                alt="Next Voters Fellowship Background"
                fill
                className="object-contain"
                priority
                unoptimized={true}
              />
            </div>
            {referralCode && (
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <div 
                  className="px-5 py-2 rounded-md"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <p 
                    className="text-base sm:text-lg md:text-2xl font-semibold text-center"
                  >
                    {referralCode}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2 mb-6">
            <p 
              className="text-sm sm:text-base text-center"
              style={{ color: '#374151' }}
            >
              📸 Take a screenshot of your certificate above to share on social media
            </p>
            <p 
              className="text-sm sm:text-base text-center"
              style={{ color: '#374151' }}
            >
              💡 You can also use the LinkedIn button below to share your referral code
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => setIsFullScreen(true)}
              className="px-4 py-2 rounded-md font-semibold"
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
            >
              Full Screen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkedInShare