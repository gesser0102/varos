'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOptions = options.filter(opt => value.includes(opt.value))

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const displayText = selectedOptions.length > 0
    ? `${selectedOptions.length} selecionado${selectedOptions.length > 1 ? 's' : ''}`
    : placeholder

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-4 py-2 text-white text-sm text-left flex items-center justify-between hover:border-[#3a3a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOptions.length > 0 ? 'text-white' : 'text-gray-500'}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-xl max-h-60 overflow-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <label
                key={option.value}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                    className="w-5 h-5 bg-[#131313] border border-[#3a3a3a] rounded appearance-none cursor-pointer checked:bg-green-700 checked:border-green-700 transition-colors"
                  />
                  {isSelected && (
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-300">{option.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
