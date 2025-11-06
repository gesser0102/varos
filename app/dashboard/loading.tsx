import { TableSkeleton } from '@/components/dashboard/TableSkeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#131313] text-white">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-32 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-12 w-40 bg-[#1a1a1a] rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="mt-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg inline-block border border-[#2a2a2a] w-64">
            <div className="h-4 w-32 bg-[#2a2a2a] rounded animate-pulse mb-3" />
            <div className="h-10 w-20 bg-[#2a2a2a] rounded animate-pulse mb-2" />
            <div className="h-3 w-48 bg-[#2a2a2a] rounded animate-pulse" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-[#2a2a2a] rounded animate-pulse mb-2" />
                <div className="h-10 w-full bg-[#0a0a0a] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="mt-8">
          <TableSkeleton />
        </div>
      </div>
    </div>
  )
}
