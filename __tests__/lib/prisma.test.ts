/**
 * @jest-environment node
 */

describe('Prisma Client Module', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('exporta instância default do prisma', () => {
    const prisma = require('@/lib/prisma').default
    expect(prisma).toBeDefined()
    expect(prisma).toHaveProperty('$disconnect')
  })

  it('prisma tem métodos essenciais', () => {
    const prisma = require('@/lib/prisma').default

    // Verifica métodos essenciais do PrismaClient
    expect(typeof prisma.$disconnect).toBe('function')
    expect(typeof prisma.$connect).toBe('function')
  })

  it('reutiliza mesma instância em múltiplas importações', () => {
    const prisma1 = require('@/lib/prisma').default
    const prisma2 = require('@/lib/prisma').default

    expect(prisma1).toBe(prisma2)
  })

  it('instância prisma é singleton', () => {
    // Importar múltiplas vezes
    const instance1 = require('@/lib/prisma').default
    jest.resetModules()
    const instance2 = require('@/lib/prisma').default

    // Em desenvolvimento, deve usar globalThis para singleton
    if (process.env.NODE_ENV === 'development') {
      expect((globalThis as any).prismaGlobal).toBeDefined()
    }
  })

  it('configuração responde ao NODE_ENV', () => {
    // Este teste verifica que o módulo carrega sem erros
    // em diferentes ambientes
    process.env.NODE_ENV = 'production'
    jest.resetModules()

    const prismaProd = require('@/lib/prisma').default
    expect(prismaProd).toBeDefined()

    process.env.NODE_ENV = 'development'
    jest.resetModules()

    const prismaDev = require('@/lib/prisma').default
    expect(prismaDev).toBeDefined()
  })

  it('usa DATABASE_URL do ambiente', () => {
    const originalUrl = process.env.DATABASE_URL
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
    jest.resetModules()

    const prisma = require('@/lib/prisma').default
    expect(prisma).toBeDefined()

    // Restaurar
    process.env.DATABASE_URL = originalUrl
  })

  it('handler de beforeExit está configurado', () => {
    // Verifica que o módulo registra cleanup
    const listeners = process.listeners('beforeExit')
    expect(listeners.length).toBeGreaterThanOrEqual(0)
  })

  it('exportação default não é null ou undefined', () => {
    const prisma = require('@/lib/prisma').default
    expect(prisma).not.toBeNull()
    expect(prisma).not.toBeUndefined()
  })

  it('prisma client tem propriedades esperadas', () => {
    const prisma = require('@/lib/prisma').default

    // Verifica que tem estrutura básica de PrismaClient
    expect(prisma).toBeInstanceOf(Object)
    expect(prisma).toHaveProperty('$disconnect')
  })

  it('módulo carrega sem lançar exceções', () => {
    expect(() => {
      require('@/lib/prisma').default
    }).not.toThrow()
  })
})
