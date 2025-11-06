import { render, screen, fireEvent } from '@testing-library/react'
import { TableRowLink } from '@/components/ui/TableRowLink'
import { TableWithLoading } from '@/components/ui/TableWithLoading'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('TableRowLink', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renderiza children dentro de uma tr', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/test">
              <td>Cell 1</td>
              <td>Cell 2</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
  })

  it('tem classe cursor-pointer', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/test">
              <td>Content</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    const row = screen.getByText('Content').closest('tr')
    expect(row).toHaveClass('cursor-pointer')
  })

  it('tem classes de hover', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/test">
              <td>Content</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    const row = screen.getByText('Content').closest('tr')
    expect(row).toHaveClass('hover:bg-[#1a1a1a]')
    expect(row).toHaveClass('transition-colors')
  })

  it('navega para href ao clicar', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/usuarios/123">
              <td>User Name</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    const row = screen.getByText('User Name').closest('tr')
    fireEvent.click(row!)

    expect(mockPush).toHaveBeenCalledWith('/usuarios/123')
  })

  it('ativa loading ao clicar', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/test">
              <td>Click me</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    const row = screen.getByText('Click me').closest('tr')
    fireEvent.click(row!)

    // Loading should be active
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('funciona com múltiplas células', () => {
    render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/test">
              <td>Name</td>
              <td>Email</td>
              <td>Status</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('navega corretamente com diferentes hrefs', () => {
    const { rerender } = render(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/page1">
              <td>Link 1</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    fireEvent.click(screen.getByText('Link 1').closest('tr')!)
    expect(mockPush).toHaveBeenCalledWith('/page1')

    mockPush.mockClear()

    rerender(
      <TableWithLoading>
        <table>
          <tbody>
            <TableRowLink href="/page2">
              <td>Link 2</td>
            </TableRowLink>
          </tbody>
        </table>
      </TableWithLoading>
    )

    fireEvent.click(screen.getByText('Link 2').closest('tr')!)
    expect(mockPush).toHaveBeenCalledWith('/page2')
  })
})
