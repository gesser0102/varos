/**
 * @jest-environment node
 */

import { validateCSRF, withCSRF } from '@/lib/csrf'
import { headers } from 'next/headers'

// Mock headers do Next.js
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

describe('CSRF Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateCSRF', () => {
    it('permite requisição com next-action header válido', async () => {
      const mockHeaders = new Map([
        ['next-action', 'abc123'],
        ['origin', 'http://localhost:3000'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('bloqueia requisição sem next-action header', async () => {
      const mockHeaders = new Map([
        ['origin', 'http://localhost:3000'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).rejects.toThrow('Invalid request: Not a Server Action')
    })

    it('permite Server Action de origem permitida', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'http://localhost:3000'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('bloqueia requisição de origem não permitida', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'http://evil-site.com'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).rejects.toThrow('CSRF validation failed')
    })

    it('bloqueia requisição sem headers necessários', async () => {
      const mockHeaders = new Map()

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).rejects.toThrow('Invalid request: Not a Server Action')
    })

    it('permite localhost em diferentes portas', async () => {
      const mockHeaders3001 = new Map([
        ['next-action', 'true'],
        ['origin', 'http://localhost:3001'],
        ['host', 'localhost:3001'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders3001)
      await expect(validateCSRF()).resolves.not.toThrow()

      const mockHeaders127 = new Map([
        ['next-action', 'true'],
        ['origin', 'http://127.0.0.1:3000'],
        ['host', '127.0.0.1:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders127)
      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('valida referer header como fallback', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['referer', 'http://localhost:3000/dashboard'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('bloqueia quando referer é de origem diferente', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['referer', 'http://evil-site.com/attack'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).rejects.toThrow('CSRF validation failed')
    })
  })

  describe('Allowed Origins', () => {
    it('considera localhost:3000 como origem permitida', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'http://localhost:3000'],
        ['host', 'localhost:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('considera localhost:3001 como origem permitida', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'http://localhost:3001'],
        ['host', 'localhost:3001'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('considera 127.0.0.1:3000 como origem permitida', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'http://127.0.0.1:3000'],
        ['host', '127.0.0.1:3000'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })
  })

  describe('Production scenarios', () => {
    it('valida origem do próprio host em produção', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'https://varos.vercel.app'],
        ['host', 'varos.vercel.app'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).resolves.not.toThrow()
    })

    it('bloqueia subdomain diferente em produção', async () => {
      const mockHeaders = new Map([
        ['next-action', 'true'],
        ['origin', 'https://evil.vercel.app'],
        ['host', 'varos.vercel.app'],
      ])

      ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

      await expect(validateCSRF()).rejects.toThrow('CSRF validation failed')
    })
  })
})

describe('withCSRF wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('executa action quando CSRF válido', async () => {
    const mockHeaders = new Map([
      ['next-action', 'true'],
      ['origin', 'http://localhost:3000'],
      ['host', 'localhost:3000'],
    ])
    ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

    const mockAction = jest.fn().mockResolvedValue('success')
    const wrappedAction = withCSRF(mockAction)

    const result = await wrappedAction('arg1', 'arg2')

    expect(result).toBe('success')
    expect(mockAction).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('bloqueia action quando CSRF inválido', async () => {
    const mockHeaders = new Map([
      ['next-action', 'true'],
      ['origin', 'http://evil-site.com'],
      ['host', 'localhost:3000'],
    ])
    ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

    const mockAction = jest.fn()
    const wrappedAction = withCSRF(mockAction)

    await expect(wrappedAction()).rejects.toThrow('CSRF validation failed')
    expect(mockAction).not.toHaveBeenCalled()
  })

  it('preserva tipos da função original', async () => {
    const mockHeaders = new Map([
      ['next-action', 'true'],
      ['origin', 'http://localhost:3000'],
      ['host', 'localhost:3000'],
    ])
    ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

    const typedAction = async (id: number, name: string): Promise<{ id: number; name: string }> => {
      return { id, name }
    }

    const wrapped = withCSRF(typedAction)
    const result = await wrapped(1, 'test')

    expect(result).toEqual({ id: 1, name: 'test' })
  })

  it('passa múltiplos argumentos corretamente', async () => {
    const mockHeaders = new Map([
      ['next-action', 'true'],
      ['origin', 'http://localhost:3000'],
      ['host', 'localhost:3000'],
    ])
    ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

    const mockAction = jest.fn().mockResolvedValue(null)
    const wrappedAction = withCSRF(mockAction)

    await wrappedAction('a', 'b', 'c', 'd')

    expect(mockAction).toHaveBeenCalledWith('a', 'b', 'c', 'd')
  })

  it('valida CSRF antes de executar action', async () => {
    const mockHeaders = new Map([
      ['next-action', 'true'],
      ['origin', 'http://localhost:3000'],
      ['host', 'localhost:3000'],
    ])
    ;(headers as jest.Mock).mockResolvedValue(mockHeaders)

    const callOrder: string[] = []

    // Mock validateCSRF através do headers
    const originalHeaders = headers
    const validateSpy = jest.fn(async () => {
      callOrder.push('validate')
      return mockHeaders
    })
    ;(headers as jest.Mock).mockImplementation(validateSpy)

    const mockAction = jest.fn().mockImplementation(async () => {
      callOrder.push('action')
      return 'done'
    })

    const wrappedAction = withCSRF(mockAction)
    await wrappedAction()

    expect(callOrder).toEqual(['validate', 'action'])
  })
})
