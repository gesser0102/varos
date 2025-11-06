import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type StatCardProps = {
  title: string
  value: number | string
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 w-full sm:min-w-[200px] flex-1 sm:flex-none">
      <p className="text-gray-400 text-xs sm:text-sm mb-2">{title}</p>
      <div className="flex items-center gap-2 sm:gap-3">
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        {trend === 'up' && <span className="text-green-500 text-lg sm:text-xl">↗</span>}
        {trend === 'down' && <span className="text-red-500 text-lg sm:text-xl">↘</span>}
      </div>
      {subtitle && <p className="text-gray-500 text-xs sm:text-sm mt-2">{subtitle}</p>}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 w-full sm:min-w-[200px] flex-1 sm:flex-none">
      <div className="h-4 bg-[#2a2a2a] rounded w-32 mb-2 animate-pulse"></div>
      <div className="h-8 bg-[#2a2a2a] rounded w-16 mb-2 animate-pulse"></div>
      <div className="h-3 bg-[#2a2a2a] rounded w-40 animate-pulse"></div>
    </div>
  )
}
