import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renderiza com tamanho padrão md', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-5')
    expect(spinner).toHaveClass('h-5')
  })

  it('renderiza com tamanho sm', () => {
    render(<LoadingSpinner size="sm" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4')
    expect(spinner).toHaveClass('h-4')
  })

  it('renderiza com tamanho md', () => {
    render(<LoadingSpinner size="md" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-5')
    expect(spinner).toHaveClass('h-5')
  })

  it('renderiza com tamanho lg', () => {
    render(<LoadingSpinner size="lg" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-6')
    expect(spinner).toHaveClass('h-6')
  })

  it('tem aria-label para acessibilidade', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Carregando')
  })

  it('tem classes de animação', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('animate-spin')
    expect(spinner).toHaveClass('rounded-full')
  })
})
