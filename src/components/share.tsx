import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import Button from './ui/button'
import { getReferralCode } from '@/lib/referral-utils'
import { ShareType } from '@/types/share'

const Share = () => {
  const referralCode = getReferralCode()
  const [shareType, setShareType] = useState<ShareType>("linkedin")
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const fullScreenRef = useRef<HTMLDivElement | null>(null) 
  const imageName = shareType === "linkedin" ? "/referral-graphic.png" : "/referral-graphic-small.png"

  const handleToggleShare = () => {
    setShareType(shareType === "linkedin" ? "instagram" : "linkedin")
  }

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

  // Calculate display dimensions - bigger size, scrollable on mobile
  const getDisplayDimensions = () => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { width: '100vw', height: '100vh' }
    }

    const imageAspectRatio = imageDimensions.width / imageDimensions.height
    
    // On mobile (< 768px), use larger fixed dimensions that may require scrolling
    if (window.innerWidth < 768) {
      const baseWidth = Math.max(imageDimensions.width * 0.8, 400)
      const height = baseWidth / imageAspectRatio
      return { width: `${baseWidth}px`, height: `${height}px` }
    }
    
    // On desktop, make it bigger but still fit reasonably
    const maxWidth = Math.min(window.innerWidth * 0.95, imageDimensions.width * 1.2)
    const height = maxWidth / imageAspectRatio
    const maxHeight = window.innerHeight * 0.95
    
    if (height > maxHeight) {
      const adjustedHeight = maxHeight
      const adjustedWidth = adjustedHeight * imageAspectRatio
      return { width: `${adjustedWidth}px`, height: `${adjustedHeight}px` }
    }
    
    return { width: `${maxWidth}px`, height: `${height}px` }
  }

  if (!referralCode) {
    return (
      <div className="max-w-4xl w-full">
        <p className="text-gray-600">No referral code generated yet.</p>
      </div>
    )
  }

  const displayDimensions = getDisplayDimensions()

  return (
    <div className="max-w-4xl w-full">
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-auto">
        {/* Capture area - this is what gets downloaded */}
        <div
          ref={fullScreenRef}
          className="relative flex-shrink-0 my-4 mx-2"
          style={{
            width: displayDimensions.width,
            height: displayDimensions.height,
            backgroundColor: 'transparent',
            minWidth: displayDimensions.width,
            minHeight: displayDimensions.height
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
          <div className={shareType === "linkedin" ? `
          absolute inset-0 flex items-end justify-center
          pb-[15px] pl-25
          md:pb-[100px] md:pl-20
          lg:pb-[20] lg:pl-96
          ` : `
          absolute inset-0 flex items-end justify-center
          pb-[158px] pl-24
          md:pb-[180px] md:pl-32
          lg:pb-[190px] lg:pl-40
          `
          }
          >
          <div className="px-2 rounded-lg">
          <p
          className="font-bold text-center leading-none text-[#fcd34d] text-lg md:text-xl lg:text-2xl"
          >
          {referralCode}
          </p>
          </div>
          </div>
        </div>
        
        {/* Control buttons - fixed position, outside capture area */}
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleToggleShare}
            className="px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors shadow-lg bg-white text-black"
          >
            {shareType === "linkedin" ?  "Toggle to small banner" : "Toggle to large banner"}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-green-700 transition-colors shadow-lg bg-[#16a34a]"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default Share