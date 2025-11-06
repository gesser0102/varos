import { ExternalAPIError, ValidationError, logError } from '@/lib/errors'

export type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  try {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '')

    // Valida formato
    if (cleanCep.length !== 8) {
      throw new ValidationError('CEP deve ter 8 dígitos')
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    })

    if (!response.ok) {
      throw new ExternalAPIError('Serviço de CEP temporariamente indisponível')
    }

    const data = await response.json()

    if (data.erro) {
      return null // CEP não encontrado (válido mas não existe)
    }

    return data
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ExternalAPIError) {
      logError(error, 'fetchAddressByCep')
      throw error
    }

    logError(error, 'fetchAddressByCep')
    throw new ExternalAPIError('Erro ao buscar endereço pelo CEP')
  }
}
