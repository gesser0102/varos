import { headers } from 'next/headers'

/**
 * Valida se a requisição veio de uma origem confiável (proteção CSRF)
 * Deve ser chamada em todas as Server Actions que modificam dados
 */
export async function validateCSRF(): Promise<void> {
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')
  const referer = headersList.get('referer')

  // Server Actions do Next.js incluem o header 'next-action'
  const isServerAction = headersList.has('next-action')

  if (!isServerAction) {
    throw new Error('Invalid request: Not a Server Action')
  }

  // Validar origin ou referer
  if (origin && host) {
    const originUrl = new URL(origin)
    const expectedHosts = [
      host,
      'localhost:3000',
      'localhost:3001',
      '127.0.0.1:3000',
      '127.0.0.1:3001',
    ]

    const isValidOrigin = expectedHosts.some(
      (expectedHost) =>
        originUrl.host === expectedHost ||
        originUrl.host === host
    )

    if (!isValidOrigin) {
      throw new Error('CSRF validation failed: Invalid origin')
    }
  } else if (referer && host) {
    const refererUrl = new URL(referer)
    if (refererUrl.host !== host && !refererUrl.host.includes('localhost')) {
      throw new Error('CSRF validation failed: Invalid referer')
    }
  }
}

/**
 * HOF que envolve uma Server Action com validação CSRF
 * Uso:
 * export const minhaAction = withCSRF(async (data) => {
 *   // implementação
 * })
 */
export function withCSRF<T extends (...args: any[]) => Promise<any>>(
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    await validateCSRF()
    return action(...args)
  }) as T
}
