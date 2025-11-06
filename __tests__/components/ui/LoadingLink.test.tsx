import { render, screen, fireEvent } from '@testing-library/react'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoadingLink', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renderiza link com children', () => {
    render(
      <LoadingLink href="/dashboard">
        Ir para Dashboard
      </LoadingLink>
    )

    expect(screen.getByText('Ir para Dashboard')).toBeInTheDocument()
  })

  it('renderiza link com href correto', () => {
    render(
      <LoadingLink href="/usuarios">
        Ver Usuários
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/usuarios')
  })

  it('aplica className customizado', () => {
    render(
      <LoadingLink href="/test" className="custom-class">
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('mostra loading spinner ao clicar', () => {
    render(
      <LoadingLink href="/dashboard">
        Click me
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('chama router.push ao clicar', () => {
    render(
      <LoadingLink href="/usuarios">
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockPush).toHaveBeenCalledWith('/usuarios')
  })

  it('previne comportamento padrão do link', () => {
    render(
      <LoadingLink href="/test">
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    const event = { preventDefault: jest.fn() } as any

    fireEvent.click(link, event)

    // O preventDefault é chamado internamente
    expect(mockPush).toHaveBeenCalled()
  })

  it('chama onClick customizado quando fornecido', () => {
    const mockOnClick = jest.fn()

    render(
      <LoadingLink href="/test" onClick={mockOnClick}>
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando não fornecido', () => {
    render(
      <LoadingLink href="/test">
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(mockPush).toHaveBeenCalled()
  })

  it('mantém className ao mostrar loading', () => {
    render(
      <LoadingLink href="/test" className="my-custom-class">
        Link
      </LoadingLink>
    )

    const link = screen.getByRole('link')
    fireEvent.click(link)

    const loadingContainer = screen.getByText('Carregando...').parentElement
    expect(loadingContainer).toHaveClass('my-custom-class')
  })

  it('não renderiza link original quando em loading', () => {
    render(
      <LoadingLink href="/test">
        Original Link
      </LoadingLink>
    )

    fireEvent.click(screen.getByRole('link'))

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
