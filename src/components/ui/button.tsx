import React from 'react'


interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

const Button = ({ children, onClick, variant = 'primary', className = '' }: ButtonProps) => {
  const baseClasses = 'font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
    secondary: 'border border-blue-300 text-blue-600 hover:bg-blue-50'
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
