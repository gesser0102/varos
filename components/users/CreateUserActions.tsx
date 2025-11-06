'use client'

import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function CreateUserActions() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Escutar quando o formulário está sendo submetido
    const form = document.getElementById('user-form') as HTMLFormElement

    const handleSubmitStart = () => setIsSubmitting(true)
    const handleSubmitEnd = () => setIsSubmitting(false)

    if (form) {
      form.addEventListener('submit', handleSubmitStart)
      window.addEventListener('beforeunload', handleSubmitEnd)
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', handleSubmitStart)
      }
      window.removeEventListener('beforeunload', handleSubmitEnd)
    }
  }, [])

  const handleSubmit = () => {
    const form = document.getElementById('user-form') as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  }

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="bg-[#1B3F1B] hover:bg-[#224d22] px-6 sm:px-10 py-3 rounded-full font-semibold text-base sm:text-lg tracking-wider text-[#00F700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
    >
      {isSubmitting && <LoadingSpinner size="sm" />}
      {isSubmitting ? 'Criando...' : 'Criar usuário'}
    </button>
  )
}
