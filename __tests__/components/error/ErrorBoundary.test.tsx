import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

// Componente que lança erro para testar
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    // Suprimir console.error nos testes
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renderiza children quando não há erro', () => {
    render(
      <ErrorBoundary>
        <div>Content without error</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Content without error')).toBeInTheDocument()
  })

  it('renderiza UI de erro quando componente filho lança erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
  })

  it('mostra mensagem de erro padrão', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeInTheDocument()
  })

  it('mostra botão de recarregar página', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Recarregar página')).toBeInTheDocument()
  })

  it('mostra ícone de alerta', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  it('mostra detalhes do erro em details element', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Detalhes do erro')).toBeInTheDocument()
  })

  it('expande detalhes do erro ao clicar', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const details = screen.getByText('Detalhes do erro')
    fireEvent.click(details)

    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('botão de recarregar é clicável', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByText('Recarregar página')

    // Verifica que o botão existe e é clicável (não lança erro ao clicar)
    expect(reloadButton).toBeInTheDocument()
    expect(() => fireEvent.click(reloadButton)).not.toThrow()
  })

  it('renderiza fallback customizado quando fornecido', () => {
    const customFallback = <div>Custom error UI</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    expect(screen.queryByText('Algo deu errado')).not.toBeInTheDocument()
  })

  it('chama console.error ao capturar erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('getDerivedStateFromError retorna estado correto', () => {
    const error = new Error('Test error')
    const state = ErrorBoundary.getDerivedStateFromError(error)

    expect(state).toEqual({
      hasError: true,
      error: error,
    })
  })

  it('não renderiza erro quando children não lançam exceção', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
    expect(screen.queryByText('Algo deu errado')).not.toBeInTheDocument()
  })

  it('estado inicial não tem erro', () => {
    const errorBoundary = new ErrorBoundary({ children: <div>test</div> })
    expect(errorBoundary.state.hasError).toBe(false)
    expect(errorBoundary.state.error).toBeNull()
  })

  it('UI de erro tem classes CSS corretas', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(container.firstChild).toHaveClass('min-h-screen')
    expect(container.firstChild).toHaveClass('bg-[#131313]')
  })

  it('botão de recarregar tem estilo correto', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const button = screen.getByText('Recarregar página')
    expect(button).toHaveClass('bg-[#1B3F1B]')
    expect(button).toHaveClass('text-[#00F700]')
  })
})
