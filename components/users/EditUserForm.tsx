import { notFound } from 'next/navigation'
import { getUserById, getClientesList } from '@/lib/queries/users'
import { UserForm } from '@/components/users/UserForm'
import { NotFoundError } from '@/lib/errors'

type EditUserFormProps = {
  userId: string
}

export async function EditUserForm({ userId }: EditUserFormProps) {
  try {
    const user = await getUserById(userId)

    if (!user) {
      notFound()
    }

    // Buscar clientes disponíveis (agora cacheado)
    const clientes = await getClientesList()

    // Transform data to match UserForm expectations
    const userData = {
      ...user,
      clientIds: user.userType === 'CONSULTOR'
        ? user.consultorClients.map(cc => cc.client.id)
        : [],
      consultorIds: user.userType === 'CLIENTE'
        ? user.clientConsultors.map(cc => cc.consultor.id)
        : []
    }

    return <UserForm user={userData} clientes={clientes} />
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound()
    }
    throw error
  }
}
