import { Suspense } from 'react'
import { getUserById } from '@/lib/queries/users'
import { EditUserForm } from '@/components/users/EditUserForm'
import { EditUserActions } from '@/components/users/EditUserActions'
import { UserFormSkeleton } from '@/components/users/UserFormSkeleton'
import { LoadingLink } from '@/components/ui/LoadingLink'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage(props: PageProps) {
  const params = await props.params

  // Apenas buscar dados mínimos para o header - o resto carrega com Suspense
  const user = await getUserById(params.id)

  if (!user) {
    return null // Será tratado pelo EditUserForm com notFound()
  }

  // Determinar qual dashboard mostrar baseado no tipo de usuário
  const dashboardUrl = user.userType === 'CONSULTOR' ? '/consultores' : '/dashboard'

  return (
    <div className="min-h-screen bg-[#131313] text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-4">
          <LoadingLink href={dashboardUrl} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
            ← Voltar para dashboard
          </LoadingLink>

          <EditUserActions userId={user.id} userType={user.userType} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Editar usuário</h1>

        <Suspense fallback={<UserFormSkeleton />}>
          <EditUserForm userId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
