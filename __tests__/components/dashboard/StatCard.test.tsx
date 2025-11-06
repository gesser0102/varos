import { render, screen } from '@testing-library/react'
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard'

describe('StatCard', () => {
  it('renderiza título e valor', () => {
    render(<StatCard title="Total de Usuários" value={150} />)

    expect(screen.getByText('Total de Usuários')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renderiza valor como string', () => {
    render(<StatCard title="Status" value="Ativo" />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renderiza subtitle quando fornecido', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        subtitle="+10% este mês"
      />
    )

    expect(screen.getByText('+10% este mês')).toBeInTheDocument()
  })

  it('não renderiza subtitle quando não fornecido', () => {
    render(<StatCard title="Total de Usuários" value={150} />)

    expect(screen.queryByText(/mês/i)).not.toBeInTheDocument()
  })

  it('renderiza ícone de tendência up', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        trend="up"
      />
    )

    expect(screen.getByText('↗')).toBeInTheDocument()
  })

  it('renderiza ícone de tendência down', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        trend="down"
      />
    )

    expect(screen.getByText('↘')).toBeInTheDocument()
  })

  it('não renderiza ícone quando trend é neutral', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        trend="neutral"
      />
    )

    expect(screen.queryByText('↗')).not.toBeInTheDocument()
    expect(screen.queryByText('↘')).not.toBeInTheDocument()
  })

  it('não renderiza ícone quando trend não é fornecido', () => {
    render(<StatCard title="Total de Usuários" value={150} />)

    expect(screen.queryByText('↗')).not.toBeInTheDocument()
    expect(screen.queryByText('↘')).not.toBeInTheDocument()
  })

  it('aplica classe de cor verde para trend up', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        trend="up"
      />
    )

    const icon = screen.getByText('↗')
    expect(icon).toHaveClass('text-green-500')
  })

  it('aplica classe de cor vermelha para trend down', () => {
    render(
      <StatCard
        title="Total de Usuários"
        value={150}
        trend="down"
      />
    )

    const icon = screen.getByText('↘')
    expect(icon).toHaveClass('text-red-500')
  })

  it('renderiza todos os elementos juntos', () => {
    render(
      <StatCard
        title="Total de Vendas"
        value="R$ 10.000"
        subtitle="Último mês"
        trend="up"
      />
    )

    expect(screen.getByText('Total de Vendas')).toBeInTheDocument()
    expect(screen.getByText('R$ 10.000')).toBeInTheDocument()
    expect(screen.getByText('Último mês')).toBeInTheDocument()
    expect(screen.getByText('↗')).toBeInTheDocument()
  })
})

describe('StatCardSkeleton', () => {
  it('renderiza skeleton loading', () => {
    const { container } = render(<StatCardSkeleton />)

    const skeletonElements = container.querySelectorAll('.animate-pulse')
    expect(skeletonElements).toHaveLength(3)
  })

  it('mantém estrutura similar ao StatCard', () => {
    const { container } = render(<StatCardSkeleton />)

    expect(container.querySelector('.bg-\\[\\#1a1a1a\\]')).toBeInTheDocument()
    expect(container.querySelector('.border-\\[\\#2a2a2a\\]')).toBeInTheDocument()
  })
})
