/**
 * @jest-environment node
 */

import { fetchAddressByCep } from '@/lib/services/viacep'
import { ValidationError, ExternalAPIError } from '@/lib/errors'

// Mock global fetch
global.fetch = jest.fn()

describe('ViaCEP Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for expected errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('fetchAddressByCep', () => {
    it('retorna endereço quando CEP é válido', async () => {
      const mockResponse = {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchAddressByCep('01310-100')

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
        { next: { revalidate: 3600 } }
      )
    })

    it('remove formatação do CEP antes de buscar', async () => {
      const mockResponse = {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      await fetchAddressByCep('01310-100')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
        { next: { revalidate: 3600 } }
      )
    })

    it('retorna null quando CEP não existe', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ erro: true })
      })

      const result = await fetchAddressByCep('99999-999')

      expect(result).toBeNull()
    })

    it('lança ValidationError quando CEP tem menos de 8 dígitos', async () => {
      await expect(fetchAddressByCep('1234')).rejects.toThrow(ValidationError)
      await expect(fetchAddressByCep('1234')).rejects.toThrow('CEP deve ter 8 dígitos')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('lança ValidationError quando CEP tem mais de 8 dígitos', async () => {
      await expect(fetchAddressByCep('123456789')).rejects.toThrow(ValidationError)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('lança ValidationError quando CEP está vazio', async () => {
      await expect(fetchAddressByCep('')).rejects.toThrow(ValidationError)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('lança ExternalAPIError quando API retorna erro HTTP', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(fetchAddressByCep('01310-100')).rejects.toThrow(ExternalAPIError)
      await expect(fetchAddressByCep('01310-100')).rejects.toThrow('Serviço de CEP temporariamente indisponível')
    })

    it('lança ExternalAPIError quando fetch falha', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(fetchAddressByCep('01310-100')).rejects.toThrow(ExternalAPIError)
      await expect(fetchAddressByCep('01310-100')).rejects.toThrow('Erro ao buscar endereço pelo CEP')
    })

    it('lança ExternalAPIError quando JSON parsing falha', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(fetchAddressByCep('01310-100')).rejects.toThrow(ExternalAPIError)
    })

    it('aceita CEP sem hífen', async () => {
      const mockResponse = {
        cep: '01310100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchAddressByCep('01310100')

      expect(result).toEqual(mockResponse)
    })

    it('remove caracteres não numéricos do CEP', async () => {
      const mockResponse = {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      await fetchAddressByCep('013a10b-1c00')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
        { next: { revalidate: 3600 } }
      )
    })

    it('usa cache de 1 hora', async () => {
      const mockResponse = {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      await fetchAddressByCep('01310-100')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
        { next: { revalidate: 3600 } }
      )
    })
  })
})
