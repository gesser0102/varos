import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Pagination } from '@/components/ui/Pagination'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTableLoading } from '@/components/ui/TableWithLoading'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock useTableLoading
jest.mock('@/components/ui/TableWithLoading', () => ({
  useTableLoading: jest.fn(),
}))

describe('Pagination', () => {
  const mockPush = jest.fn()
  const mockSetIsLoading = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')
    ;(useTableLoading as jest.Mock).mockReturnValue({
      setIsLoading: mockSetIsLoading,
    })

    // Mock window.innerWidth for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  describe('renderização básica', () => {
    it('renderiza informações de paginação corretamente', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
      expect(screen.getAllByText('1').length).toBeGreaterThan(0)
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('renderiza botões Anterior e Próxima', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getByText('Anterior')).toBeInTheDocument()
      expect(screen.getByText('Próxima')).toBeInTheDocument()
    })

    it('renderiza números de página', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getAllByText('1').length).toBeGreaterThan(0)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('estado dos botões', () => {
    it('desabilita botão Anterior na primeira página', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const anteriorButton = screen.getByText('Anterior')
      expect(anteriorButton).toBeDisabled()
    })

    it('desabilita botão Próxima na última página', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const proximaButton = screen.getByText('Próxima')
      expect(proximaButton).toBeDisabled()
    })

    it('habilita ambos os botões em páginas intermediárias', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const anteriorButton = screen.getByText('Anterior')
      const proximaButton = screen.getByText('Próxima')

      expect(anteriorButton).not.toBeDisabled()
      expect(proximaButton).not.toBeDisabled()
    })
  })

  describe('navegação', () => {
    it('navega para página anterior ao clicar em Anterior', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const anteriorButton = screen.getByText('Anterior')
      fireEvent.click(anteriorButton)

      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard?page=2')
      })
    })

    it('navega para próxima página ao clicar em Próxima', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const proximaButton = screen.getByText('Próxima')
      fireEvent.click(proximaButton)

      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard?page=3')
      })
    })

    it('navega para página específica ao clicar em número', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const pageButton = screen.getAllByText('4')[0]
      fireEvent.click(pageButton)

      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard?page=4')
      })
    })

    it('preserva outros parâmetros de query ao navegar', () => {
      ;(useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams('consultor=123&userType=CLIENTE')
      )

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const proximaButton = screen.getByText('Próxima')
      fireEvent.click(proximaButton)

      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('consultor=123')
        )
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('userType=CLIENTE')
        )
      })
    })
  })

  describe('cálculo de itens exibidos', () => {
    it('calcula corretamente itens da primeira página', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getAllByText('1').length).toBeGreaterThan(0)
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('calcula corretamente itens da última página com número não exato', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={3}
          totalItems={25}
          itemsPerPage={10}
        />
      )

      expect(screen.getByText('21')).toBeInTheDocument()
      expect(screen.getAllByText('25').length).toBeGreaterThanOrEqual(2) // Total items + end item
    })

    it('calcula corretamente itens de página intermediária', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getByText('11')).toBeInTheDocument()
      expect(screen.getByText('20')).toBeInTheDocument()
    })
  })

  describe('exibição de números de página', () => {
    it('mostra todas as páginas quando total é menor que 7', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(2) // Label + button
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('mostra apenas 7 páginas quando total é maior', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={20}
          totalItems={200}
          itemsPerPage={10}
        />
      )

      const pageButtons = screen.getAllByRole('button').filter(btn =>
        /^\d+$/.test(btn.textContent || '')
      )
      expect(pageButtons).toHaveLength(7)
    })

    it('destaca a página atual', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
        />
      )

      const currentPageButtons = screen.getAllByText('3')
      const pageButton = currentPageButtons.find(btn =>
        btn.tagName === 'BUTTON'
      )

      expect(pageButton).toHaveClass('bg-[#1B3F1B]')
      expect(pageButton).toHaveClass('text-[#00F700]')
    })
  })

  describe('caso com 1 item', () => {
    it('exibe corretamente com apenas 1 item total', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          totalItems={1}
          itemsPerPage={10}
        />
      )

      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(3) // start, end, page button
      expect(screen.getByText('Anterior')).toBeDisabled()
      expect(screen.getByText('Próxima')).toBeDisabled()
    })
  })
})
