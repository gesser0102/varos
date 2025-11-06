import { render, screen, fireEvent } from '@testing-library/react'
import { MultiSelect } from '@/components/ui/MultiSelect'

describe('MultiSelect', () => {
  const mockOptions = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
    { value: '3', label: 'Opção 3' },
  ]

  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza com placeholder quando nenhum valor selecionado', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
          placeholder="Selecione itens"
        />
      )

      expect(screen.getByText('Selecione itens')).toBeInTheDocument()
    })

    it('mostra contador quando 1 item selecionado', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['1']}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('1 selecionado')).toBeInTheDocument()
    })

    it('mostra contador plural quando múltiplos itens selecionados', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['1', '2']}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('2 selecionados')).toBeInTheDocument()
    })

    it('renderiza botão com estado disabled', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
          disabled={true}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('aplica className customizado', () => {
      const { container } = render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
          className="custom-class"
        />
      )

      const selectDiv = container.firstChild as HTMLElement
      expect(selectDiv).toHaveClass('custom-class')
    })
  })

  describe('interação com dropdown', () => {
    it('abre dropdown ao clicar no botão', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
        />
      )

      expect(screen.queryByText('Opção 1')).not.toBeInTheDocument()

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('Opção 1')).toBeInTheDocument()
      expect(screen.getByText('Opção 2')).toBeInTheDocument()
      expect(screen.getByText('Opção 3')).toBeInTheDocument()
    })

    it('fecha dropdown ao clicar novamente no botão', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(screen.getByText('Opção 1')).toBeInTheDocument()

      fireEvent.click(button)
      expect(screen.queryByText('Opção 1')).not.toBeInTheDocument()
    })

    it('não abre dropdown quando disabled', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
          disabled={true}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.queryByText('Opção 1')).not.toBeInTheDocument()
    })
  })

  describe('seleção de itens', () => {
    it('adiciona item quando checkbox é clicado', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const checkbox = screen.getByRole('checkbox', { name: /Opção 1/ })
      fireEvent.click(checkbox)

      expect(mockOnChange).toHaveBeenCalledWith(['1'])
    })

    it('remove item quando checkbox já selecionado é clicado', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['1', '2']}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const checkbox = screen.getByRole('checkbox', { name: /Opção 1/ })
      fireEvent.click(checkbox)

      expect(mockOnChange).toHaveBeenCalledWith(['2'])
    })

    it('seleciona múltiplos itens', () => {
      const { rerender } = render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const checkbox1 = screen.getByRole('checkbox', { name: /Opção 1/ })
      fireEvent.click(checkbox1)
      expect(mockOnChange).toHaveBeenCalledWith(['1'])

      rerender(
        <MultiSelect
          options={mockOptions}
          value={['1']}
          onChange={mockOnChange}
        />
      )

      const checkbox2 = screen.getByRole('checkbox', { name: /Opção 2/ })
      fireEvent.click(checkbox2)
      expect(mockOnChange).toHaveBeenCalledWith(['1', '2'])
    })

    it('marca checkbox como checked quando item está selecionado', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['1', '3']}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const checkbox1 = screen.getByRole('checkbox', { name: /Opção 1/ })
      const checkbox2 = screen.getByRole('checkbox', { name: /Opção 2/ })
      const checkbox3 = screen.getByRole('checkbox', { name: /Opção 3/ })

      expect(checkbox1).toBeChecked()
      expect(checkbox2).not.toBeChecked()
      expect(checkbox3).toBeChecked()
    })
  })

  describe('ícone de seta', () => {
    it('roda ícone quando dropdown abre', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')

      expect(svg).not.toHaveClass('rotate-180')

      fireEvent.click(button)

      expect(svg).toHaveClass('rotate-180')
    })
  })

  describe('estilos condicionais', () => {
    it('usa cor de texto cinza para placeholder', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={mockOnChange}
          placeholder="Placeholder"
        />
      )

      const span = screen.getByText('Placeholder')
      expect(span).toHaveClass('text-gray-500')
    })

    it('usa cor de texto branca quando há seleção', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['1']}
          onChange={mockOnChange}
        />
      )

      const span = screen.getByText('1 selecionado')
      expect(span).toHaveClass('text-white')
    })
  })
})
