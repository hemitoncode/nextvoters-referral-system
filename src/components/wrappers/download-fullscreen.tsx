import React from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import { image } from 'html2canvas/dist/types/css/types/image'

interface DownloadFullScreenWrapperProps {
    referralCode: string | null
    fullScreenRef: React.RefObject<HTMLDivElement | null>
    setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>
    imageName: string
}

const DownloadFullScreenWrapper: React.FC<DownloadFullScreenWrapperProps> = ({ referralCode, fullScreenRef, setIsFullScreen, imageName }) => {
    const handleDownload = async () => {
        if (!fullScreenRef?.current) return
    
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
        <div className="fixed inset-0 z-50" style={{ backgroundColor: '#000000' }}>
          {/* Capture area - this is what gets downloaded */}
          <div
            ref={fullScreenRef}
            className="absolute inset-0"
            style={{ 
              backgroundColor: '#000000',
              width: '100vw',
              height: '100vh'
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageName}
                alt="Next Voters Fellowship Background"
                fill
                className="object-contain"
                priority
                unoptimized={true}
              />
              {referralCode && (
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="py-10 rounded-md">
                    <p 
                      className="text-2xl sm:text-4xl font-semibold text-center"
                      style={{ color: '#fcd34d' }}
                    >
                      {referralCode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control buttons - outside capture area */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setIsFullScreen(false)}
              className="px-6 py-2 rounded-md font-semibold bg-white text-black cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2 rounded-md font-semibold bg-[#16a34a] cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
  )
}

export default DownloadFullScreenWrapper