import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { DatabaseError, logError } from '@/lib/errors'

const getTotalConsultores = unstable_cache(
  async () => {
    try {
      const totalConsultores = await prisma.user.count({
        where: { userType: 'CONSULTOR' }
      })

      // Get count from 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const consultoresLast7Days = await prisma.user.count({
        where: {
          userType: 'CONSULTOR',
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      })

      return { totalConsultores, consultoresLast7Days }
    } catch (error) {
      logError(error, 'getTotalConsultores')
      throw new DatabaseError('Falha ao carregar estatísticas de consultores')
    }
  },
  ['consultores-stats'],
  {
    revalidate: 300, // 5 minutos
    tags: ['users', 'consultors', 'stats'],
  }
)

export async function ConsultoresStatsCard() {
  const { totalConsultores, consultoresLast7Days } = await getTotalConsultores()

  return (
    <div className="w-full lg:w-auto">
      <div className="flex flex-col items-start p-4 gap-2 w-full sm:w-[212px] min-h-[137px] bg-[#131516] border border-[#222729] rounded-lg">
        <p className="text-[#B0B7BE] text-xs sm:text-sm font-normal tracking-[0.02em] leading-[135%] self-stretch">
          Total de consultores
        </p>
        <div className="flex flex-row items-center gap-[5px]">
          <span className="text-3xl sm:text-[38px] font-medium leading-[135%] tracking-[0.02em] text-[#B0B7BE] flex-grow">
            {totalConsultores}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none sm:w-6 sm:h-6">
            <path d="M4.5 19.5L19.5 4.5M19.5 4.5H8.25M19.5 4.5V15.75" stroke="#19C819" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[#B0B7BE] text-xs sm:text-sm font-normal tracking-[0.02em] leading-[135%] self-stretch">
          +{consultoresLast7Days} nos últimos 7 dias
        </p>
      </div>
    </div>
  )
}
