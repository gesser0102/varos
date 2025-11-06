'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useEffect, useState } from 'react'
import { useTableLoading } from './TableWithLoading'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { setIsLoading } = useTableLoading()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false)
    }
  }, [isPending, setIsLoading])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    const url = `${pathname}?${params.toString()}` as any
    setIsLoading(true)
    startTransition(() => {
      router.push(url)
    })
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 sm:px-4 py-4 sm:py-6 border-t bg-[#131313] border-x border-b border-[#222729] rounded-b-lg">
      <div className="text-xs sm:text-sm text-[#B0B7BE] text-center sm:text-left">
        Mostrando <span className="font-semibold">{startItem}</span> a <span className="font-semibold">{endItem}</span> de{' '}
        <span className="font-semibold">{totalItems}</span> resultados
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-center">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#B0B7BE] bg-[#131516] border border-[#222729] rounded hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, isMobile ? 3 : 7) }, (_, i) => {
            let pageNumber: number
            const maxPages = isMobile ? 3 : 7

            if (totalPages <= maxPages) {
              pageNumber = i + 1
            } else if (currentPage <= Math.floor(maxPages / 2) + 1) {
              pageNumber = i + 1
            } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
              pageNumber = totalPages - maxPages + 1 + i
            } else {
              pageNumber = currentPage - Math.floor(maxPages / 2) + i
            }

            return (
              <button
                key={pageNumber}
                onClick={() => updatePage(pageNumber)}
                disabled={isPending}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                  currentPage === pageNumber
                    ? 'bg-[#1B3F1B] text-[#00F700] border border-[#00F700]'
                    : 'text-[#B0B7BE] bg-[#131516] border border-[#222729] hover:bg-[#1a1a1a]'
                }`}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#B0B7BE] bg-[#131516] border border-[#222729] rounded hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
