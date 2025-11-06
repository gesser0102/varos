export function TableSkeleton() {
  return (
    <div className="bg-[#131313] overflow-hidden border border-[#222729]">
      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#131313]">
            <tr className="border-b border-[#222729]">
              <th className="px-4 py-8 w-[12%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[15%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[10%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[10%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[8%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[18%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[13%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-8 w-[14%]">
                <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-[#222729]">
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-8 bg-[#131516]">
                  <div className="h-4 bg-[#222729] rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
