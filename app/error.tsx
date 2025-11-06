'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center p-8">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-red-500 text-2xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Erro na aplicação</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Desculpe, ocorreu um erro ao processar sua solicitação.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-4">
            Código do erro: {error.digest}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 bg-[#1B3F1B] hover:bg-[#224d22] text-[#00F700] font-medium py-2 px-4 rounded transition-colors"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
