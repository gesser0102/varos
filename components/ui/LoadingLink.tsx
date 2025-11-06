'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type LoadingLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  skeletonClassName?: string
}

export function LoadingLink({ href, children, className = '', onClick, skeletonClassName }: LoadingLinkProps) {
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
      <div className={skeletonClassName || className} aria-hidden="true">
        <div className="flex items-center justify-center gap-2 opacity-50">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </div>
      </div>
    )
  }

  return (
    <Link href={href as any} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
