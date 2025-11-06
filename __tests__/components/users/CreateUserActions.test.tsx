import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateUserActions } from '@/components/users/CreateUserActions'

describe('CreateUserActions', () => {
  beforeEach(() => {
    // Limpar o DOM antes de cada teste
    document.body.innerHTML = ''
  })

  it('renderiza botão com texto inicial', () => {
    render(<CreateUserActions />)

    expect(screen.getByText('Criar usuário')).toBeInTheDocument()
  })

  it('botão não está desabilitado inicialmente', () => {
    render(<CreateUserActions />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('submete formulário ao clicar no botão', () => {
    // Criar um formulário mock
    const form = document.createElement('form')
    form.id = 'user-form'
    const requestSubmitSpy = jest.fn()
    form.requestSubmit = requestSubmitSpy
    document.body.appendChild(form)

    render(<CreateUserActions />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(requestSubmitSpy).toHaveBeenCalled()
  })

  it('não faz nada se formulário não existe', () => {
    render(<CreateUserActions />)

    const button = screen.getByRole('button')

    // Não deve lançar erro
    expect(() => fireEvent.click(button)).not.toThrow()
  })

  it('mostra estado de loading ao submeter formulário', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    document.body.appendChild(form)

    render(<CreateUserActions />)

    // Disparar evento de submit no formulário
    fireEvent.submit(form)

    expect(screen.getByText('Criando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
  })

  it('desabilita botão durante submissão', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    document.body.appendChild(form)

    render(<CreateUserActions />)

    const button = screen.getByRole('button')
    fireEvent.submit(form)

    expect(button).toBeDisabled()
  })

  it('remove event listeners ao desmontar', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    const removeEventListenerSpy = jest.spyOn(form, 'removeEventListener')
    const windowRemoveSpy = jest.spyOn(window, 'removeEventListener')
    document.body.appendChild(form)

    const { unmount } = render(<CreateUserActions />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function))
    expect(windowRemoveSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('reseta estado ao beforeunload', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    document.body.appendChild(form)

    render(<CreateUserActions />)

    // Ativar loading
    fireEvent.submit(form)
    expect(screen.getByText('Criando...')).toBeInTheDocument()

    // Disparar beforeunload
    fireEvent(window, new Event('beforeunload'))

    // Estado deve resetar
    waitFor(() => {
      expect(screen.getByText('Criar usuário')).toBeInTheDocument()
    })
  })

  it('funciona sem formulário presente', () => {
    const { container } = render(<CreateUserActions />)

    // Não deve lançar erro mesmo sem form
    expect(container).toBeInTheDocument()
  })

  it('tem classes CSS corretas', () => {
    render(<CreateUserActions />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[#1B3F1B]')
    expect(button).toHaveClass('text-[#00F700]')
    expect(button).toHaveClass('rounded-full')
  })
})
