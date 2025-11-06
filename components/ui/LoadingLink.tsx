'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from './LoadingSpinner'

type LoadingLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function LoadingLink({ href, children, className = '', onClick }: LoadingLinkProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsNavigating(true)

    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }

    router.push(href as any)
  }

  if (isNavigating) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="text-gray-400">Carregando...</span>
      </div>
    )
  }

  return (
    <Link href={href as any} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
