import React from 'react'

interface NormalViewProps {
  setIsFullScreen: (value: boolean) => void
}

const NormalView: React.FC<NormalViewProps> = ({ setIsFullScreen }) => {
  return (
    <div className='w-full'>
        <div className="flex flex-col justify-center items-center min-h-[200px]">
        <button
            onClick={() => setIsFullScreen(true)}
            className="group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-blue-500 cursor-pointer"
        >
            <span className="relative z-10 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
                View your downloadable certificate!
            </span>
        </button>
        
        <div className="space-y-2 mb-6 text-center text-gray-600 pt-5">
            <p className="text-sm">📸 Download your very own certificate!</p>
            <p className="text-sm">💡 Share on your socials!</p>
        </div>
        </div>
    </div>
  )
}

export default NormalView