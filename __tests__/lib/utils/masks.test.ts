import { maskCPF, maskCEP, maskPhone, unmask } from '@/lib/utils/masks'

describe('Mask Utilities', () => {
  describe('maskCPF', () => {
    it('formata CPF com 11 dígitos', () => {
      expect(maskCPF('12345678909')).toBe('123.456.789-09')
    })

    it('formata CPF parcial com 9 dígitos', () => {
      expect(maskCPF('123456789')).toBe('123.456.789')
    })

    it('formata CPF parcial com 6 dígitos', () => {
      expect(maskCPF('123456')).toBe('123.456')
    })

    it('formata CPF parcial com 3 dígitos', () => {
      expect(maskCPF('123')).toBe('123')
    })

    it('remove caracteres não numéricos', () => {
      expect(maskCPF('123abc456def789gh09')).toBe('123.456.789-09')
    })

    it('limita a 11 dígitos', () => {
      expect(maskCPF('123456789091234')).toBe('123.456.789-09')
    })

    it('retorna vazio quando entrada é vazia', () => {
      expect(maskCPF('')).toBe('')
    })

    it('preserva formatação existente ao re-formatar', () => {
      expect(maskCPF('123.456.789-09')).toBe('123.456.789-09')
    })
  })

  describe('maskCEP', () => {
    it('formata CEP com 8 dígitos', () => {
      expect(maskCEP('12345678')).toBe('12345-678')
    })

    it('formata CEP parcial com 5 dígitos', () => {
      expect(maskCEP('12345')).toBe('12345')
    })

    it('formata CEP parcial com 6 dígitos', () => {
      expect(maskCEP('123456')).toBe('12345-6')
    })

    it('remove caracteres não numéricos', () => {
      expect(maskCEP('12345-678')).toBe('12345-678')
    })

    it('limita a 8 dígitos', () => {
      expect(maskCEP('123456789012')).toBe('12345-678')
    })

    it('retorna vazio quando entrada é vazia', () => {
      expect(maskCEP('')).toBe('')
    })

    it('remove letras', () => {
      expect(maskCEP('12abc345def678')).toBe('12345-678')
    })
  })

  describe('maskPhone', () => {
    it('formata telefone com 11 dígitos (celular)', () => {
      expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
    })

    it('formata telefone com 10 dígitos (fixo)', () => {
      expect(maskPhone('1134567890')).toBe('(11) 34567-890')
    })

    it('formata telefone parcial com 2 dígitos', () => {
      expect(maskPhone('11')).toBe('11')
    })

    it('formata telefone parcial com 7 dígitos', () => {
      expect(maskPhone('1198765')).toBe('(11) 98765')
    })

    it('formata telefone parcial com 8 dígitos', () => {
      expect(maskPhone('11987654')).toBe('(11) 98765-4')
    })

    it('remove caracteres não numéricos', () => {
      expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
    })

    it('limita a 11 dígitos', () => {
      expect(maskPhone('119876543219999')).toBe('(11) 98765-4321')
    })

    it('retorna vazio quando entrada é vazia', () => {
      expect(maskPhone('')).toBe('')
    })

    it('remove letras', () => {
      expect(maskPhone('11abc98765def4321')).toBe('(11) 98765-4321')
    })
  })

  describe('unmask', () => {
    it('remove formatação de CPF', () => {
      expect(unmask('123.456.789-09')).toBe('12345678909')
    })

    it('remove formatação de CEP', () => {
      expect(unmask('12345-678')).toBe('12345678')
    })

    it('remove formatação de telefone', () => {
      expect(unmask('(11) 98765-4321')).toBe('11987654321')
    })

    it('remove todos os caracteres não numéricos', () => {
      expect(unmask('abc123def456ghi789')).toBe('123456789')
    })

    it('retorna vazio quando entrada é vazia', () => {
      expect(unmask('')).toBe('')
    })

    it('retorna apenas dígitos de string mista', () => {
      expect(unmask('R$ 1.234,56')).toBe('123456')
    })

    it('mantém string sem caracteres especiais', () => {
      expect(unmask('123456789')).toBe('123456789')
    })
  })
})
