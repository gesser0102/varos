'use client'

import { useState } from 'react'

type DisclaimerProps = {
  children: React.ReactNode
}

export function Disclaimer({ children }: DisclaimerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="mb-3 sm:mb-4 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 text-gray-400 hover:text-gray-200 transition-colors"
        style={{ top: '.8rem' }}
        aria-label="Fechar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="text-xs sm:text-sm text-gray-400 pr-7 sm:pr-8">
        {children}
      </div>
    </div>
  )
}
