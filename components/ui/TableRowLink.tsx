'use client'

import { useRouter } from 'next/navigation'
import { useTableLoading } from './TableWithLoading'

type TableRowLinkProps = {
  href: string
  children: React.ReactNode
}

export function TableRowLink({ href, children }: TableRowLinkProps) {
  const router = useRouter()
  const { setIsLoading } = useTableLoading()

  const handleClick = () => {
    setIsLoading(true)
    router.push(href as any)
  }

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-[#1a1a1a] transition-colors cursor-pointer"
    >
      {children}
    </tr>
  )
}
