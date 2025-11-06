import React from 'react'
import { render, screen, renderHook, act } from '@testing-library/react'
import { TableWithLoading, useTableLoading } from '@/components/ui/TableWithLoading'

describe('TableWithLoading', () => {
  it('renderiza children corretamente', () => {
    render(
      <TableWithLoading>
        <div>Table Content</div>
      </TableWithLoading>
    )

    expect(screen.getByText('Table Content')).toBeInTheDocument()
  })

  it('não mostra loading por padrão', () => {
    render(
      <TableWithLoading>
        <div>Content</div>
      </TableWithLoading>
    )

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
  })

  it('mostra overlay de loading quando isLoading é true', () => {
    function TestComponent() {
      const { setIsLoading } = useTableLoading()

      // Set loading on mount
      React.useEffect(() => {
        setIsLoading(true)
      }, [setIsLoading])

      return <div>Content</div>
    }

    render(
      <TableWithLoading>
        <TestComponent />
      </TableWithLoading>
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('mostra spinner quando carregando', () => {
    function TestComponent() {
      const { setIsLoading } = useTableLoading()

      React.useEffect(() => {
        setIsLoading(true)
      }, [setIsLoading])

      return <div>Content</div>
    }

    render(
      <TableWithLoading>
        <TestComponent />
      </TableWithLoading>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('useTableLoading', () => {
  it('retorna contexto quando usado dentro do provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableWithLoading>{children}</TableWithLoading>
    )

    const { result } = renderHook(() => useTableLoading(), { wrapper })

    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.setIsLoading).toBe('function')
  })

  it('lança erro quando usado fora do provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useTableLoading())
    }).toThrow('useTableLoading must be used within TableWithLoading')

    consoleSpy.mockRestore()
  })

  it('permite alternar estado de loading', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TableWithLoading>{children}</TableWithLoading>
    )

    const { result } = renderHook(() => useTableLoading(), { wrapper })

    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setIsLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setIsLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })
})
