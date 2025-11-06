import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

describe('ConfirmModal', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('renderização', () => {
    it('não renderiza quando isOpen é false', () => {
      render(
        <ConfirmModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Confirmar ação"
          message="Tem certeza?"
        />
      )

      expect(screen.queryByText('Confirmar ação')).not.toBeInTheDocument()
    })

    it('renderiza quando isOpen é true', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Confirmar ação"
          message="Tem certeza?"
        />
      )

      expect(screen.getByText('Confirmar ação')).toBeInTheDocument()
      expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
    })

    it('renderiza com textos padrão dos botões', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      expect(screen.getByText('Confirmar')).toBeInTheDocument()
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    it('renderiza com textos personalizados dos botões', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          confirmText="Sim"
          cancelText="Não"
        />
      )

      expect(screen.getByText('Sim')).toBeInTheDocument()
      expect(screen.getByText('Não')).toBeInTheDocument()
    })

    it('exibe "Processando..." quando isLoading é true', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          isLoading={true}
        />
      )

      expect(screen.getByText('Processando...')).toBeInTheDocument()
    })
  })

  describe('interações', () => {
    it('chama onClose ao clicar no botão cancelar', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      const cancelButton = screen.getByText('Cancelar')
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).not.toHaveBeenCalled()
    })

    it('chama onConfirm ao clicar no botão confirmar', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      const confirmButton = screen.getByText('Confirmar')
      fireEvent.click(confirmButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('chama onClose ao clicar no backdrop', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      const backdrop = screen.getByText('Título').parentElement?.parentElement?.previousSibling as HTMLElement
      fireEvent.click(backdrop)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('chama onClose ao pressionar ESC', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      fireEvent.keyDown(window, { key: 'Escape' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('não chama onClose ao pressionar ESC quando isLoading', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          isLoading={true}
        />
      )

      fireEvent.keyDown(window, { key: 'Escape' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('não chama onClose ao clicar no backdrop quando isLoading', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          isLoading={true}
        />
      )

      const backdrop = screen.getByText('Título').parentElement?.parentElement?.previousSibling as HTMLElement
      fireEvent.click(backdrop)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('estado de loading', () => {
    it('desabilita ambos os botões quando isLoading é true', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          isLoading={true}
        />
      )

      const cancelButton = screen.getByText('Cancelar')
      const confirmButton = screen.getByText('Processando...')

      expect(cancelButton).toBeDisabled()
      expect(confirmButton).toBeDisabled()
    })

    it('não desabilita botões quando isLoading é false', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          isLoading={false}
        />
      )

      const cancelButton = screen.getByText('Cancelar')
      const confirmButton = screen.getByText('Confirmar')

      expect(cancelButton).not.toBeDisabled()
      expect(confirmButton).not.toBeDisabled()
    })
  })

  describe('classes CSS customizadas', () => {
    it('aplica classe padrão ao botão confirmar', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      const confirmButton = screen.getByText('Confirmar')
      expect(confirmButton).toHaveClass('bg-red-600')
      expect(confirmButton).toHaveClass('hover:bg-red-700')
    })

    it('aplica classe customizada ao botão confirmar', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
          confirmButtonClass="bg-green-600 hover:bg-green-700"
        />
      )

      const confirmButton = screen.getByText('Confirmar')
      expect(confirmButton).toHaveClass('bg-green-600')
      expect(confirmButton).toHaveClass('hover:bg-green-700')
    })
  })

  describe('scroll management', () => {
    it('bloqueia scroll do body quando modal abre', () => {
      const { rerender } = render(
        <ConfirmModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      // Initial state could be '' or 'unset' depending on test environment

      rerender(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restaura scroll do body quando modal fecha', () => {
      const { rerender, unmount } = render(
        <ConfirmModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <ConfirmModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Título"
          message="Mensagem"
        />
      )

      expect(document.body.style.overflow).toBe('unset')

      unmount()
      expect(document.body.style.overflow).toBe('unset')
    })
  })
})
