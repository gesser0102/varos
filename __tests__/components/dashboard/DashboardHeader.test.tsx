import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('DashboardHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza logo da VAROS', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const logo = screen.getByAltText('VAROS')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-varos.png')
  })

  it('renderiza links de navegação', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Consultores')).toBeInTheDocument()
  })

  it('destaca link ativo em /dashboard', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const clientesLink = screen.getByText('Clientes')
    expect(clientesLink).toHaveClass('text-white')
    expect(clientesLink).toHaveClass('font-medium')
  })

  it('destaca link ativo em /consultores', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/consultores')

    render(<DashboardHeader />)

    const consultoresLink = screen.getByText('Consultores')
    expect(consultoresLink).toHaveClass('text-white')
    expect(consultoresLink).toHaveClass('font-medium')
  })

  it('links não ativos têm cor cinza', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const consultoresLink = screen.getByText('Consultores')
    expect(consultoresLink).toHaveClass('text-gray-400')
  })

  it('renderiza botão de menu mobile', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveClass('md:hidden')
  })

  it('abre menu mobile ao clicar no botão', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)

    // Menu mobile deve aparecer
    const mobileLinks = screen.getAllByText('Clientes')
    expect(mobileLinks.length).toBeGreaterThan(1) // Desktop + Mobile
  })

  it('fecha menu mobile ao clicar novamente', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const menuButton = screen.getByRole('button')

    // Abrir menu
    fireEvent.click(menuButton)
    expect(screen.getAllByText('Clientes').length).toBeGreaterThan(1)

    // Fechar menu
    fireEvent.click(menuButton)
    // Menu mobile fechado, apenas versão desktop visível
    expect(screen.getAllByText('Clientes').length).toBe(1)
  })

  it('navegação desktop está oculta em mobile', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    const { container } = render(<DashboardHeader />)

    const desktopNav = container.querySelector('nav.hidden.md\\:flex')
    expect(desktopNav).toBeInTheDocument()
  })

  it('logo tem dimensões responsivas', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    render(<DashboardHeader />)

    const logo = screen.getByAltText('VAROS')
    expect(logo).toHaveClass('w-20')
    expect(logo).toHaveClass('sm:w-[101px]')
  })

  it('header tem border bottom', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/dashboard')

    const { container } = render(<DashboardHeader />)

    const header = container.firstChild
    expect(header).toHaveClass('border-b')
    expect(header).toHaveClass('border-[#222729]')
  })
})
