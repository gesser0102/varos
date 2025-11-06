import { render, screen, fireEvent } from '@testing-library/react'
import { Disclaimer } from '@/components/ui/Disclaimer'

describe('Disclaimer', () => {
  it('renderiza children corretamente', () => {
    render(
      <Disclaimer>
        <p>Mensagem de aviso importante</p>
      </Disclaimer>
    )

    expect(screen.getByText('Mensagem de aviso importante')).toBeInTheDocument()
  })

  it('renderiza botão de fechar', () => {
    render(
      <Disclaimer>
        <p>Conteúdo</p>
      </Disclaimer>
    )

    const closeButton = screen.getByRole('button', { name: /fechar/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('esconde disclaimer ao clicar no botão fechar', () => {
    render(
      <Disclaimer>
        <p>Conteúdo para fechar</p>
      </Disclaimer>
    )

    expect(screen.getByText('Conteúdo para fechar')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)

    expect(screen.queryByText('Conteúdo para fechar')).not.toBeInTheDocument()
  })

  it('inicia visível por padrão', () => {
    render(
      <Disclaimer>
        <p>Visível inicialmente</p>
      </Disclaimer>
    )

    expect(screen.getByText('Visível inicialmente')).toBeInTheDocument()
  })

  it('renderiza children de qualquer tipo', () => {
    render(
      <Disclaimer>
        <div>
          <h3>Título</h3>
          <p>Parágrafo 1</p>
          <p>Parágrafo 2</p>
        </div>
      </Disclaimer>
    )

    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Parágrafo 1')).toBeInTheDocument()
    expect(screen.getByText('Parágrafo 2')).toBeInTheDocument()
  })

  it('renderiza ícone X no botão', () => {
    render(
      <Disclaimer>
        <p>Conteúdo</p>
      </Disclaimer>
    )

    const closeButton = screen.getByRole('button', { name: /fechar/i })
    const svg = closeButton.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('não renderiza nada após ser fechado', () => {
    const { container } = render(
      <Disclaimer>
        <p>Conteúdo</p>
      </Disclaimer>
    )

    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)

    expect(container.firstChild).toBeNull()
  })
})
