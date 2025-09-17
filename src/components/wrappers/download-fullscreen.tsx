import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'

interface DownloadFullScreenWrapperProps {
  referralCode: string | null
  fullScreenRef: React.RefObject<HTMLDivElement | null>
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>
  imageName: string
}

const DownloadFullScreenWrapper: React.FC<DownloadFullScreenWrapperProps> = ({ 
  referralCode, 
  fullScreenRef, 
  setIsFullScreen, 
  imageName 
}) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = imageName
  }, [imageName])

  const handleDownload = async () => {
    if (!fullScreenRef?.current) return
    
    try {
      // Wait for image to load
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const element = fullScreenRef.current
      const rect = element.getBoundingClientRect()
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        logging: false,
        width: rect.width,
        height: rect.height,
        windowWidth: rect.width,
        windowHeight: rect.height,
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

  // Calculate display dimensions that fit the screen while maintaining aspect ratio
  const getDisplayDimensions = () => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { width: '90vw', height: '90vh' }
    }

    const imageAspectRatio = imageDimensions.width / imageDimensions.height
    const screenAspectRatio = window.innerWidth / window.innerHeight

    if (imageAspectRatio > screenAspectRatio) {
      // Image is wider than screen ratio - fit to width
      const width = Math.min(window.innerWidth * 0.9, imageDimensions.width)
      const height = width / imageAspectRatio
      return { width: `${width}px`, height: `${height}px` }
    } else {
      // Image is taller than screen ratio - fit to height
      const height = Math.min(window.innerHeight * 0.9, imageDimensions.height)
      const width = height * imageAspectRatio
      return { width: `${width}px`, height: `${height}px` }
    }
  }

  const displayDimensions = getDisplayDimensions()

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Capture area - this is what gets downloaded */}
      <div
        ref={fullScreenRef}
        className="relative flex-shrink-0"
        style={{
          width: displayDimensions.width,
          height: displayDimensions.height,
          backgroundColor: 'transparent'
        }}
      >
        <Image
          src={imageName}
          alt="Referral Image"
          fill
          className="object-contain"
          priority
          unoptimized={true}
        />
        {referralCode && (
          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <div className="px-2 rounded-lg">
              <p
                className="font-bold text-center leading-none"
                style={{ 
                  color: '#fcd34d',
                  fontSize: 'clamp(20px, 5vw, 44px)'  // responsive size
                }}
              >
                {referralCode}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Control buttons - outside capture area */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setIsFullScreen(false)}
          className="px-4 py-2 rounded-lg font-semibold bg-white text-black hover:bg-gray-100 transition-colors shadow-lg"
        >
          Close
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-green-700 transition-colors shadow-lg"
          style={{ backgroundColor: '#16a34a' }}
        >
          Download
        </button>
      </div>
    </div>
  )
}

export default DownloadFullScreenWrapper