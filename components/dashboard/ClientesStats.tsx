import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { DatabaseError, logError } from '@/lib/errors'

type SearchParams = {
  consultor?: string
  email?: string
  startDate?: string
  endDate?: string
}

const getTotalClientes = unstable_cache(
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
      logError(error, 'getTotalClientes')
      throw new DatabaseError('Falha ao carregar estatísticas de clientes')
    }
  },
  ['clientes-stats'],
  {
    revalidate: 300, // 5 minutos
    tags: ['users', 'clientes', 'stats'],
  }
)

export async function ClientesStatsCard({ searchParams }: { searchParams: SearchParams }) {
  const { totalClientes, clientesLast7Days } = await getTotalClientes(searchParams)

  return (
    <div className="w-full lg:w-auto">
      <div className="flex flex-col items-start p-4 gap-2 w-full sm:w-[212px] min-h-[137px] bg-[#131516] border border-[#222729] rounded-lg">
        <p className="text-[#B0B7BE] text-xs sm:text-sm font-normal tracking-[0.02em] leading-[135%] self-stretch">
          Total de clientes
        </p>
        <div className="flex flex-row items-center gap-[5px]">
          <span className="text-3xl sm:text-[38px] font-medium leading-[135%] tracking-[0.02em] text-[#B0B7BE] flex-grow">
            {totalClientes}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none sm:w-6 sm:h-6">
            <path d="M4.5 19.5L19.5 4.5M19.5 4.5H8.25M19.5 4.5V15.75" stroke="#19C819" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[#B0B7BE] text-xs sm:text-sm font-normal tracking-[0.02em] leading-[135%] self-stretch">
          nos últimos 7 dias
        </p>
      </div>
    </div>
  )
}
