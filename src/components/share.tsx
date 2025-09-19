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
          <div className={shareType === "linkedin" ? `
              absolute inset-0 flex items-end justify-center 
              pb-[40px] pl-0 
              sm:pb-[50px] sm:pl-20 
              md:pb-[60px] md:pl-40 
              lg:pb-[72px] lg:pl-96
            ` : `
              absolute inset-0 flex items-end justify-center 
              pb-[32px] pl-0 
              sm:pb-[40px] sm:pl-10 
              md:pb-[50px] md:pl-10 
              lg:pb-[190px] lg:pl-40
            `
            }
            >
            <div className="px-2 rounded-lg">
              <p
                className="font-bold text-center leading-none"
                style={{ 
                  color: '#fcd34d',
                  fontSize: 'clamp(10px, 5vw, 30px)'  // responsive size
                }}
              >
                {referralCode}
              </p>
            </div>
          </div>
        </div>
        
        {/* Control buttons - outside capture area */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleToggleShare}
            className="px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors shadow-lg bg-white text-black"
          >
            Toggle to small banner
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