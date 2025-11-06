import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TableRowLink } from '@/components/ui/TableRowLink'
import { TableWithLoading } from '@/components/ui/TableWithLoading'
import { Pagination } from '@/components/ui/Pagination'
import { DatabaseError, logError } from '@/lib/errors'

const ITEMS_PER_PAGE = 20

type SearchParams = {
  page?: string
}

const getConsultores = async (page: number) => {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE

    // Otimização: Select específico ao invés de include para evitar N+1
    const [consultores, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          userType: 'CONSULTOR',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              consultorClients: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.user.count({
        where: {
          userType: 'CONSULTOR',
        },
      }),
    ])

    return { consultores, totalCount, currentPage: page }
  } catch (error) {
    logError(error, 'getConsultores')
    throw new DatabaseError('Falha ao carregar lista de consultores')
  }
}

export async function ConsultoresTable({ searchParams }: { searchParams?: SearchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const { consultores, totalCount, currentPage } = await getConsultores(page)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <TableWithLoading>
      <div className="bg-[#131313] overflow-hidden border border-[#222729] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
          <thead className="bg-[#131313]">
            <tr className="border-b border-[#222729]">
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[120px]">Nome</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[180px]">Email</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[120px]">Telefone</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[120px]">CPF</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[100px]">Clientes</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[140px]">Criado em</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[140px]">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {consultores.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 sm:p-8 text-gray-500 text-sm">
                  Nenhum consultor encontrado
                </td>
              </tr>
            ) : (
              consultores.map((consultor) => (
                <TableRowLink key={consultor.id} href={`/usuarios/${consultor.id}/editar`}>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{consultor.name}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{consultor.email}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{consultor.phone || '-'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{consultor.cpf || '-'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{consultor._count.consultorClients} clientes</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">
                    {format(new Date(consultor.createdAt), "dd/MM/yyyy 'às' HH:mm'h'", { locale: ptBR })}
                  </td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">
                    {format(new Date(consultor.updatedAt), "dd/MM/yyyy 'às' HH:mm'h'", { locale: ptBR })}
                  </td>
                </TableRowLink>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
    </TableWithLoading>
  )
}
