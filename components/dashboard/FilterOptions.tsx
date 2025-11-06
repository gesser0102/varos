import { getConsultors } from '@/lib/queries/users'
import { DatabaseError, logError } from '@/lib/errors'

export async function FilterOptions() {
  try {
    const consultors = await getConsultors()

    const consultorOptions = [
      { value: '', label: 'Todos' },
      ...consultors.map(c => ({ value: c.name, label: c.name }))
    ]

    const emailOptions = [
      { value: '', label: 'Todos' },
      ...consultors.map(c => ({ value: c.email, label: c.email }))
    ]

    return { consultorOptions, emailOptions }
  } catch (error) {
    logError(error, 'FilterOptions')
    throw new DatabaseError('Falha ao carregar opções de filtros')
  }
}
