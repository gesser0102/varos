import { Suspense } from 'react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { ClientsTable } from '@/components/dashboard/ClientsTable'
import { ClientesStatsCard } from '@/components/dashboard/ClientesStats'
import { TableSkeleton } from '@/components/dashboard/TableSkeleton'
import { FilterOptions } from '@/components/dashboard/FilterOptions'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { Disclaimer } from '@/components/ui/Disclaimer'

export const revalidate = 60 // Cache de 1 minuto

type SearchParams = Promise<{
  consultor?: string
  email?: string
  startDate?: string
  endDate?: string
}>

export default async function DashboardPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const { consultorOptions, emailOptions } = await FilterOptions()

  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <DashboardHeader />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8 mb-6 sm:mb-8">
          <Suspense fallback={
            <div className="w-full lg:w-auto">
              <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-[#2a2a2a]">
                <div className="h-4 bg-[#2a2a2a] rounded w-32 mb-2 animate-pulse"></div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 bg-[#2a2a2a] rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-[#2a2a2a] rounded w-8 animate-pulse"></div>
                </div>
                <div className="h-3 bg-[#2a2a2a] rounded w-48 animate-pulse"></div>
              </div>
            </div>
          }>
            <ClientesStatsCard searchParams={searchParams} />
          </Suspense>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 w-full lg:w-auto">
            <LoadingLink
              href="/usuarios/novo"
              className="bg-[#1B3F1B] hover:bg-[#224d22] border border-[#222729] px-4 py-3 sm:py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="text-[#00F700] font-normal text-sm sm:text-base tracking-wider">Criar usuário</span>
              <span className="text-[#00F700] text-xl sm:text-2xl">+</span>
            </LoadingLink>
            <DashboardFilters
              consultorOptions={consultorOptions}
              emailOptions={emailOptions}
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <Disclaimer>
            💡 <span className="text-gray-300">Dica:</span> Clique em qualquer cliente na tabela para editá-lo
          </Disclaimer>

          <Suspense fallback={<TableSkeleton />}>
            <ClientsTable searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
