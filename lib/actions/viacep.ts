'use server'

import { fetchAddressByCep } from '@/lib/services/viacep'
import type { ViaCepResponse } from '@/lib/services/viacep'

/**
 * Server Action para buscar endereço por CEP
 * Esta action executa no servidor, evitando problemas de CSP
 */
export async function getAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  try {
    return await fetchAddressByCep(cep)
  } catch (error) {
    // Re-throw para que o cliente possa tratar o erro
    throw error
  }
}

