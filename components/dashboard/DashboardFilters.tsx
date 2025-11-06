'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useRef, useEffect, useCallback } from 'react'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { useDebouncedCallback } from 'use-debounce'

type FilterOptionsProps = {
  consultorOptions: Array<{ value: string; label: string }>
  emailOptions: Array<{ value: string; label: string }>
}

export function DashboardFilters({ consultorOptions, emailOptions }: FilterOptionsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  const consultor = searchParams.get('consultor') || ''
  const email = searchParams.get('email') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyFilters = useCallback((newConsultor?: string, newEmail?: string, newStartDate?: string, newEndDate?: string) => {
    const params = new URLSearchParams()

    const consultorValue = newConsultor !== undefined ? newConsultor : consultor
    const emailValue = newEmail !== undefined ? newEmail : email
    const startValue = newStartDate !== undefined ? newStartDate : startDate
    const endValue = newEndDate !== undefined ? newEndDate : endDate

    if (consultorValue) params.set('consultor', consultorValue)
    if (emailValue) params.set('email', emailValue)
    if (startValue) params.set('startDate', startValue)
    if (endValue) params.set('endDate', endValue)

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }, [consultor, email, startDate, endDate, router])

  // Debounce de 500ms para evitar múltiplas requisições
  const debouncedApplyFilters = useDebouncedCallback(applyFilters, 500)

  const applyDateFilter = () => {
    if (tempStartDate && tempEndDate) {
      applyFilters(undefined, undefined, tempStartDate, tempEndDate)
      setShowDatePicker(false)
    }
  }

  const clearDateFilter = () => {
    setTempStartDate('')
    setTempEndDate('')
    applyFilters(undefined, undefined, '', '')
    setShowDatePicker(false)
  }

  const formatDateDisplay = () => {
    if (startDate && endDate) {
      // Adiciona 'T00:00:00' para forçar timezone local
      const start = new Date(startDate + 'T00:00:00')
      const end = new Date(endDate + 'T00:00:00')
      return `${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`
    }
    return '21/10/2025 até 21/12/2025'
  }

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4 border border-[#222729] rounded-lg p-3 sm:p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
        <label className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Nome do consultor</label>
        <CustomSelect
          options={consultorOptions}
          value={consultor}
          onChange={(value) => applyFilters(value, undefined, undefined, undefined)}
          placeholder="John Doe"
          disabled={isPending}
          className="w-full sm:min-w-[200px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
        <label className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Email do consultor</label>
        <CustomSelect
          options={emailOptions}
          value={email}
          onChange={(value) => applyFilters(undefined, value, undefined, undefined)}
          placeholder="johndoe@gm..."
          disabled={isPending}
          className="w-full sm:min-w-[200px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 relative w-full lg:w-auto" ref={datePickerRef}>
        <label className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Período</label>
        <div
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 sm:px-4 py-2 text-white text-xs sm:text-sm w-full sm:min-w-[280px] cursor-pointer hover:border-[#3a3a3a] transition-colors"
        >
          {formatDateDisplay()}
        </div>

        {showDatePicker && (
          <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 shadow-xl z-50 w-full sm:w-auto sm:min-w-[320px]">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data inicial</label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data final</label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={applyDateFilter}
                  disabled={!tempStartDate || !tempEndDate}
                  className="flex-1 bg-green-700 hover:bg-green-600 px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aplicar
                </button>
                <button
                  onClick={clearDateFilter}
                  className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
