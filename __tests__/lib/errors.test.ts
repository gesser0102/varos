import {
  AppError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  ExternalAPIError,
  getErrorMessage,
  logError,
  withErrorHandling
} from '@/lib/errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('cria erro com mensagem', () => {
      const error = new AppError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('AppError')
      expect(error.code).toBeUndefined()
      expect(error.statusCode).toBeUndefined()
    })

    it('cria erro com código e statusCode', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 500)
      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.statusCode).toBe(500)
    })
  })

  describe('DatabaseError', () => {
    it('cria erro com mensagem padrão', () => {
      const error = new DatabaseError()
      expect(error.message).toBe('Erro ao acessar o banco de dados')
      expect(error.name).toBe('DatabaseError')
      expect(error.code).toBe('DATABASE_ERROR')
      expect(error.statusCode).toBe(500)
    })

    it('cria erro com mensagem customizada', () => {
      const error = new DatabaseError('Falha na conexão')
      expect(error.message).toBe('Falha na conexão')
      expect(error.code).toBe('DATABASE_ERROR')
      expect(error.statusCode).toBe(500)
    })
  })

  describe('ValidationError', () => {
    it('cria erro com mensagem padrão', () => {
      const error = new ValidationError()
      expect(error.message).toBe('Dados inválidos')
      expect(error.name).toBe('ValidationError')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
    })

    it('cria erro com mensagem customizada', () => {
      const error = new ValidationError('Email inválido')
      expect(error.message).toBe('Email inválido')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
    })
  })

  describe('NotFoundError', () => {
    it('cria erro com mensagem padrão', () => {
      const error = new NotFoundError()
      expect(error.message).toBe('Registro não encontrado')
      expect(error.name).toBe('NotFoundError')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
    })

    it('cria erro com mensagem customizada', () => {
      const error = new NotFoundError('Usuário não encontrado')
      expect(error.message).toBe('Usuário não encontrado')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
    })
  })

  describe('ExternalAPIError', () => {
    it('cria erro com mensagem padrão', () => {
      const error = new ExternalAPIError()
      expect(error.message).toBe('Erro ao comunicar com serviço externo')
      expect(error.name).toBe('ExternalAPIError')
      expect(error.code).toBe('EXTERNAL_API_ERROR')
      expect(error.statusCode).toBe(502)
    })

    it('cria erro com mensagem customizada', () => {
      const error = new ExternalAPIError('API indisponível')
      expect(error.message).toBe('API indisponível')
      expect(error.code).toBe('EXTERNAL_API_ERROR')
      expect(error.statusCode).toBe(502)
    })
  })
})

describe('getErrorMessage', () => {
  it('retorna mensagem de AppError', () => {
    const error = new AppError('Test error')
    expect(getErrorMessage(error)).toBe('Test error')
  })

  it('retorna mensagem de ValidationError', () => {
    const error = new ValidationError('Invalid data')
    expect(getErrorMessage(error)).toBe('Invalid data')
  })

  it('retorna mensagem de Error genérico', () => {
    const error = new Error('Generic error')
    expect(getErrorMessage(error)).toBe('Generic error')
  })

  it('retorna string quando erro é string', () => {
    expect(getErrorMessage('String error')).toBe('String error')
  })

  it('retorna mensagem padrão para erro desconhecido', () => {
    expect(getErrorMessage(null)).toBe('Ocorreu um erro inesperado. Por favor, tente novamente.')
    expect(getErrorMessage(undefined)).toBe('Ocorreu um erro inesperado. Por favor, tente novamente.')
    expect(getErrorMessage(123)).toBe('Ocorreu um erro inesperado. Por favor, tente novamente.')
    expect(getErrorMessage({})).toBe('Ocorreu um erro inesperado. Por favor, tente novamente.')
  })
})

describe('logError', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('loga erro sem contexto', () => {
    const error = new Error('Test error')
    logError(error)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Error]'),
      error
    )
  })

  it('loga erro com contexto', () => {
    const error = new Error('Test error')
    logError(error, 'TestContext')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[TestContext]'),
      error
    )
  })

  it('loga stack trace para Error', () => {
    const error = new Error('Test error')
    logError(error)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Stack:', error.stack)
  })

  it('loga erro que não é Error', () => {
    logError('String error', 'Context')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Context]'),
      'String error'
    )
  })
})

describe('withErrorHandling', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('retorna resultado quando função executa com sucesso', async () => {
    const fn = async () => 'success'
    const result = await withErrorHandling(fn, 'TestContext')

    expect(result).toBe('success')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('loga erro e re-lança quando função falha', async () => {
    const error = new Error('Test error')
    const fn = async () => {
      throw error
    }

    await expect(withErrorHandling(fn, 'TestContext')).rejects.toThrow('Test error')
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('retorna fallback quando função falha e fallback é fornecido', async () => {
    const error = new Error('Test error')
    const fn = async () => {
      throw error
    }

    const result = await withErrorHandling(fn, 'TestContext', 'fallback')

    expect(result).toBe('fallback')
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('loga erro com contexto correto', async () => {
    const error = new Error('Test error')
    const fn = async () => {
      throw error
    }

    try {
      await withErrorHandling(fn, 'MyContext')
    } catch (e) {
      // Expected to throw
    }

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[MyContext]'),
      error
    )
  })

  it('funciona com diferentes tipos de retorno', async () => {
    const fnNumber = async () => 42
    const fnObject = async () => ({ key: 'value' })
    const fnArray = async () => [1, 2, 3]

    expect(await withErrorHandling(fnNumber, 'Context')).toBe(42)
    expect(await withErrorHandling(fnObject, 'Context')).toEqual({ key: 'value' })
    expect(await withErrorHandling(fnArray, 'Context')).toEqual([1, 2, 3])
  })
})
