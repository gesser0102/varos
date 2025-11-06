import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TableRowLink } from '@/components/ui/TableRowLink'
import { TableWithLoading } from '@/components/ui/TableWithLoading'
import { Pagination } from '@/components/ui/Pagination'
import { DatabaseError, logError } from '@/lib/errors'

type SearchParams = {
  consultor?: string
  email?: string
  startDate?: string
  endDate?: string
  page?: string
}

const ITEMS_PER_PAGE = 20

const getClients = async (searchParams: SearchParams) => {
  try {
    const page = parseInt(searchParams.page || '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

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

    // Otimização: Select específico ao invés de include tudo
    const [clients, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          age: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          clientConsultors: {
            select: {
              consultor: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.user.count({ where }),
    ])

    return { clients, totalCount, currentPage: page }
  } catch (error) {
    logError(error, 'getClients')
    throw new DatabaseError('Falha ao carregar lista de clientes')
  }
}

export async function ClientsTable({ searchParams }: { searchParams: SearchParams }) {
  const { clients, totalCount, currentPage } = await getClients(searchParams)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <TableWithLoading>
      <div className="bg-[#131313] overflow-hidden border border-[#222729] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
          <thead className="bg-[#131313]">
            <tr className="border-b border-[#222729]">
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[120px]">Nome</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[150px]">Email</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[120px]">Telefone</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[100px]">CPF</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[80px]">Idade</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[150px]">Endereço</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[140px]">Criado em</th>
              <th className="text-left px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] font-bold text-xs sm:text-sm tracking-[0.02em] min-w-[140px]">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 sm:p-8 text-gray-500 text-sm">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <TableRowLink key={client.id} href={`/usuarios/${client.id}/editar`}>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.name}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.email}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.phone || '-'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.cpf || '-'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.age ? `${client.age} anos` : '-'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">{client.address || 'Lorem ipsum dolor...'}</td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">
                    {format(new Date(client.createdAt), "dd/MM/yyyy 'às' HH:mm'h'", { locale: ptBR })}
                  </td>
                  <td className="px-3 sm:px-4 py-4 sm:py-8 text-[#B0B7BE] text-xs sm:text-sm tracking-[0.02em] bg-[#131516] border-b border-[#222729]">
                    {format(new Date(client.updatedAt), "dd/MM/yyyy 'às' HH:mm'h'", { locale: ptBR })}
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
