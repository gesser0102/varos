import { render, screen, fireEvent } from '@testing-library/react'
import { CustomSelect } from '@/components/ui/CustomSelect'

describe('CustomSelect', () => {
  const mockOptions = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
    { value: '3', label: 'Opção 3' },
  ]

  it('renderiza com placeholder quando sem valor', () => {
    render(
      <CustomSelect
        value=""
        onChange={jest.fn()}
        options={mockOptions}
        placeholder="Selecione uma opção"
      />
    )

    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument()
  })

  it('mostra valor selecionado', () => {
    render(
      <CustomSelect
        value="2"
        onChange={jest.fn()}
        options={mockOptions}
        placeholder="Selecione"
      />
    )

    expect(screen.getByText('Opção 2')).toBeInTheDocument()
  })

  it('abre dropdown ao clicar no botão', () => {
    render(
      <CustomSelect
        value=""
        onChange={jest.fn()}
        options={mockOptions}
        placeholder="Selecione"
      />
    )

    // Inicialmente opções não estão visíveis
    expect(screen.queryByText('Opção 1')).not.toBeInTheDocument()

    // Clicar no botão
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Agora opções devem estar visíveis
    expect(screen.getByText('Opção 1')).toBeInTheDocument()
    expect(screen.getByText('Opção 2')).toBeInTheDocument()
    expect(screen.getByText('Opção 3')).toBeInTheDocument()
  })

  it('chama onChange quando seleciona opção', () => {
    const mockOnChange = jest.fn()

    render(
      <CustomSelect
        value=""
        onChange={mockOnChange}
        options={mockOptions}
        placeholder="Selecione"
      />
    )

    // Abrir dropdown
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Clicar em uma opção
    const option2 = screen.getByText('Opção 2')
    fireEvent.click(option2)

    expect(mockOnChange).toHaveBeenCalledWith('2')
  })

  it('aplica className customizado', () => {
    const { container } = render(
      <CustomSelect
        value=""
        onChange={jest.fn()}
        options={mockOptions}
        placeholder="Selecione"
        className="custom-class"
      />
    )

    const selectDiv = container.firstChild as HTMLElement
    expect(selectDiv).toHaveClass('custom-class')
  })

  it('funciona com disabled state', () => {
    render(
      <CustomSelect
        value=""
        onChange={jest.fn()}
        options={mockOptions}
        placeholder="Selecione"
        disabled={true}
      />
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
