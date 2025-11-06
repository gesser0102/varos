import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditUserActions } from '@/components/users/EditUserActions'
import { useRouter } from 'next/navigation'
import { deleteUser } from '@/lib/actions/users'
import { toast } from 'sonner'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/actions/users', () => ({
  deleteUser: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('EditUserActions', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  it('renderiza botões de atualizar e deletar', () => {
    render(<EditUserActions userId="123" userType="CLIENTE" />)

    expect(screen.getByText('Atualizar usuário')).toBeInTheDocument()
    expect(screen.getByText('Deletar usuário')).toBeInTheDocument()
  })

  it('abre modal de confirmação ao clicar em atualizar', () => {
    render(<EditUserActions userId="123" userType="CLIENTE" />)

    const updateButton = screen.getByText('Atualizar usuário')
    fireEvent.click(updateButton)

    expect(screen.getByText('Confirmar atualização')).toBeInTheDocument()
    expect(screen.getByText('Deseja salvar as alterações feitas neste usuário?')).toBeInTheDocument()
  })

  it('abre modal de confirmação ao clicar em deletar', () => {
    render(<EditUserActions userId="123" userType="CLIENTE" />)

    const deleteButton = screen.getByText('Deletar usuário')
    fireEvent.click(deleteButton)

    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    expect(screen.getByText(/Esta ação não pode ser desfeita/)).toBeInTheDocument()
  })

  it('fecha modal de atualização ao clicar em cancelar', () => {
    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Atualizar usuário'))
    expect(screen.getByText('Confirmar atualização')).toBeInTheDocument()

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    waitFor(() => {
      expect(screen.queryByText('Confirmar atualização')).not.toBeInTheDocument()
    })
  })

  it('submete formulário ao confirmar atualização', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    const requestSubmitSpy = jest.fn()
    form.requestSubmit = requestSubmitSpy
    document.body.appendChild(form)

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Atualizar usuário'))
    fireEvent.click(screen.getByText('Atualizar'))

    expect(requestSubmitSpy).toHaveBeenCalled()
  })

  it('chama deleteUser ao confirmar exclusão', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Usuário deletado',
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith('123')
    })
  })

  it('mostra toast de sucesso após deletar', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Usuário deletado com sucesso',
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuário deletado com sucesso')
    })
  })

  it('redireciona para /dashboard após deletar cliente', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Deletado',
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('redireciona para /consultores após deletar consultor', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Deletado',
    })

    render(<EditUserActions userId="456" userType="CONSULTOR" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/consultores')
    })
  })

  it('mostra toast de erro quando falha ao deletar', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Erro ao deletar',
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao deletar')
    })
  })

  it('desabilita botões durante submissão', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    document.body.appendChild(form)

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.submit(form)

    const updateButton = screen.getByText('Atualizando...')
    const deleteButton = screen.getByText('Deletar usuário')

    expect(updateButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('mostra loading spinner durante atualização', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    document.body.appendChild(form)

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.submit(form)

    expect(screen.getByText('Atualizando...')).toBeInTheDocument()
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('chama refresh do router após deletar', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Deletado',
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('fecha modal após deletar com sucesso', async () => {
    ;(deleteUser as jest.Mock).mockResolvedValue({
      success: true,
    })

    render(<EditUserActions userId="123" userType="CLIENTE" />)

    fireEvent.click(screen.getByText('Deletar usuário'))
    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Deletar'))

    await waitFor(() => {
      expect(screen.queryByText('Confirmar exclusão')).not.toBeInTheDocument()
    })
  })

  it('remove event listeners ao desmontar', () => {
    const form = document.createElement('form')
    form.id = 'user-form'
    const removeEventListenerSpy = jest.spyOn(form, 'removeEventListener')
    const windowRemoveSpy = jest.spyOn(window, 'removeEventListener')
    document.body.appendChild(form)

    const { unmount } = render(<EditUserActions userId="123" userType="CLIENTE" />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function))
    expect(windowRemoveSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })
})
