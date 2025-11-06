/**
 * Utilitários para tratamento de erros
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Erro ao acessar o banco de dados') {
    super(message, 'DATABASE_ERROR', 500)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Dados inválidos') {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Registro não encontrado') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string = 'Erro ao comunicar com serviço externo') {
    super(message, 'EXTERNAL_API_ERROR', 502)
    this.name = 'ExternalAPIError'
  }
}

/**
 * Formata mensagens de erro para o usuário
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Ocorreu um erro inesperado. Por favor, tente novamente.'
}

/**
 * Log de erro com contexto
 */
export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const prefix = context ? `[${context}]` : '[Error]'

  console.error(`${prefix} ${timestamp}:`, error)

  if (error instanceof Error) {
    console.error('Stack:', error.stack)
  }
}

/**
 * Wrapper para try-catch com logging automático
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    logError(error, context)

    if (fallback !== undefined) {
      return fallback
    }

    throw error
  }
}
