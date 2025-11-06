import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { DatabaseError, logError } from '@/lib/errors'

type SearchParams = {
  consultor?: string
  email?: string
  startDate?: string
  endDate?: string
}

const getStats = unstable_cache(
  async (searchParams: SearchParams) => {
    try {
      const where: any = {
        userType: 'CLIENTE',
      }

      if (searchParams.startDate || searchParams.endDate) {
        where.createdAt = {}
        if (searchParams.startDate) {
          where.createdAt.gte = new Date(searchParams.startDate)
        }
        if (searchParams.endDate) {
          where.createdAt.lte = new Date(searchParams.endDate)
        }
      }

      if (searchParams.consultor) {
        where.clientConsultors = {
          some: {
            consultor: {
              name: {
                contains: searchParams.consultor,
                mode: 'insensitive',
              },
            },
          },
        }
      }

      if (searchParams.email) {
        where.clientConsultors = {
          some: {
            consultor: {
              email: {
                contains: searchParams.email,
                mode: 'insensitive',
              },
            },
          },
        }
      }

      const totalClientes = await prisma.user.count({ where })

      // Get count from 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const clientesLast7Days = await prisma.user.count({
        where: {
          ...where,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      })

      return { totalClientes, clientesLast7Days }
    } catch (error) {
      logError(error, 'getStats')
      throw new DatabaseError('Falha ao carregar estatísticas do dashboard')
    }
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutos - stats atualizam com menos frequência
    tags: ['users', 'stats'],
  }
)

export async function DashboardStats({ searchParams }: { searchParams: SearchParams }) {
  const { totalClientes, clientesLast7Days } = await getStats(searchParams)

  return (
    <div className="mt-8">
      <div className="bg-[#1a1a1a] p-6 rounded-lg inline-block border border-[#2a2a2a]">
        <p className="text-gray-400 text-sm mb-2">Total de clientes</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold">{totalClientes}</span>
          <span className="text-green-500 text-xl">↗</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">nos últimos 7 dias: +{clientesLast7Days}</p>
      </div>
    </div>
  )
}
