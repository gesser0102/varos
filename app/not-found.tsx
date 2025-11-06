import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center p-8">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-2">Página não encontrada</h2>
        <p className="text-gray-400 mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-[#1B3F1B] hover:bg-[#224d22] text-[#00F700] font-medium py-2 px-6 rounded transition-colors"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  )
}
