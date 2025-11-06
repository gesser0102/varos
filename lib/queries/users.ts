import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { DatabaseError, NotFoundError, logError } from '@/lib/errors'

export const getConsultors = unstable_cache(
  async () => {
    try {
      return await prisma.user.findMany({
        where: {
          userType: 'CONSULTOR'
        },
        select: {
          id: true,
          name: true,
          email: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      logError(error, 'getConsultors')
      throw new DatabaseError('Falha ao carregar lista de consultores')
    }
  },
  ['consultors-list'],
  {
    tags: ['users', 'consultors'],
    revalidate: 900 // 15 minutos - dados que mudam pouco
  }
)

export const getUserById = unstable_cache(
  async (id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          clientConsultors: {
            include: {
              consultor: true
            }
          },
          consultorClients: {
            include: {
              client: true
            }
          }
        }
      })

      if (!user) {
        throw new NotFoundError('Usuário não encontrado')
      }

      return user
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      logError(error, 'getUserById')
      throw new DatabaseError('Falha ao carregar dados do usuário')
    }
  },
  ['user-by-id'],
  {
    revalidate: 300, // 5 minutos
    tags: ['users'],
  }
)

export const getClientesList = unstable_cache(
  async () => {
    try {
      return await prisma.user.findMany({
        where: {
          userType: 'CLIENTE'
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    } catch (error) {
      logError(error, 'getClientesList')
      throw new DatabaseError('Falha ao carregar lista de clientes')
    }
  },
  ['clientes-list'],
  {
    tags: ['users', 'clientes'],
    revalidate: 600 // 10 minutos - usada em formulários
  }
)
