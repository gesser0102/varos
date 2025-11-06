import { LoadingSpinner } from './LoadingSpinner'

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-lg">Carregando...</p>
      </div>
    </div>
  )
}
