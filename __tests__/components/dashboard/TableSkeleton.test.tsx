import { render } from '@testing-library/react'
import { TableSkeleton } from '@/components/dashboard/TableSkeleton'

describe('TableSkeleton', () => {
  it('renderiza uma tabela', () => {
    const { container } = render(<TableSkeleton />)

    const table = container.querySelector('table')
    expect(table).toBeInTheDocument()
  })

  it('renderiza thead com 8 colunas', () => {
    const { container } = render(<TableSkeleton />)

    const headers = container.querySelectorAll('thead th')
    expect(headers).toHaveLength(8)
  })

  it('renderiza 5 linhas de skeleton', () => {
    const { container } = render(<TableSkeleton />)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(5)
  })

  it('cada linha tem 8 células', () => {
    const { container } = render(<TableSkeleton />)

    const firstRow = container.querySelector('tbody tr')
    const cells = firstRow?.querySelectorAll('td')
    expect(cells).toHaveLength(8)
  })

  it('todos skeleton items têm animação pulse', () => {
    const { container } = render(<TableSkeleton />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    // 8 headers + (5 rows * 8 cells) = 48 skeleton items
    expect(skeletons.length).toBe(48)
  })

  it('tem classes de cor corretas', () => {
    const { container } = render(<TableSkeleton />)

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-[#131313]')
    expect(wrapper).toHaveClass('border-[#222729]')
  })

  it('tabela tem largura total', () => {
    const { container } = render(<TableSkeleton />)

    const table = container.querySelector('table')
    expect(table).toHaveClass('w-full')
    expect(table).toHaveClass('table-fixed')
  })

  it('células do tbody têm background correto', () => {
    const { container } = render(<TableSkeleton />)

    const cell = container.querySelector('tbody td')
    expect(cell).toHaveClass('bg-[#131516]')
  })
})
