import { Suspense } from 'react'
import { CreateUserForm } from '@/components/users/CreateUserForm'
import { CreateUserActions } from '@/components/users/CreateUserActions'
import { UserFormSkeleton } from '@/components/users/UserFormSkeleton'
import { LoadingLink } from '@/components/ui/LoadingLink'

export const dynamic = 'force-dynamic'

export default function NovoUsuarioPage() {
  return (
    <div className="min-h-screen bg-[#131313] text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-4">
          <LoadingLink href="/dashboard" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
            ← Voltar para dashboard
          </LoadingLink>

          <CreateUserActions />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Criar usuário</h1>

        <Suspense fallback={<UserFormSkeleton />}>
          <CreateUserForm />
        </Suspense>
      </div>
    </div>
  )
}
