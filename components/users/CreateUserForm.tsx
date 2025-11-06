import { UserForm } from '@/components/users/UserForm'
import { getClientesList } from '@/lib/queries/users'

export async function CreateUserForm() {
  const clientes = await getClientesList()

  return <UserForm clientes={clientes} />
}
