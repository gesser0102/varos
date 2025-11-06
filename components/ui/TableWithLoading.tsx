'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type TableLoadingContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const TableLoadingContext = createContext<TableLoadingContextType | undefined>(undefined)

export function useTableLoading() {
  const context = useContext(TableLoadingContext)
  if (!context) {
    throw new Error('useTableLoading must be used within TableWithLoading')
  }
  return context
}

type TableWithLoadingProps = {
  children: ReactNode
}

export function TableWithLoading({ children }: TableWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <TableLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-[#131313]/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" />
              <span className="text-gray-300 text-lg">Carregando...</span>
            </div>
          </div>
        )}
        {children}
      </div>
    </TableLoadingContext.Provider>
  )
}
