import { userSchema } from '@/lib/validations/user'

describe('User Validation Schema', () => {
  describe('name validation', () => {
    it('aceita nome válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })

    it('rejeita nome com menos de 3 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'Jo',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve ter no mínimo 3 caracteres')
      }
    })

    it('rejeita nome com mais de 100 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'a'.repeat(101),
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve ter no máximo 100 caracteres')
      }
    })

    it('rejeita nome com números', () => {
      const result = userSchema.safeParse({
        name: 'João Silva 123',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve conter apenas letras')
      }
    })

    it('aceita nome com acentos', () => {
      const result = userSchema.safeParse({
        name: 'José María Ñoño',
        email: 'jose@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('aceita email válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })

    it('converte email para minúsculo', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'JOAO@EXAMPLE.COM',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('joao@example.com')
      }
    })

    it('rejeita email inválido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'email-invalido',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('rejeita email com menos de 5 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'a@b',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
    })

    it('rejeita email com mais de 100 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'a'.repeat(95) + '@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('phone validation', () => {
    it('aceita telefone válido com 9 dígitos', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        phone: '(11) 98765-4321'
      })
      expect(result.success).toBe(true)
    })

    it('aceita telefone válido com 8 dígitos', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        phone: '(11) 3456-7890'
      })
      expect(result.success).toBe(true)
    })

    it('aceita telefone sem espaço', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        phone: '(11)98765-4321'
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo telefone vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        phone: ''
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo telefone omitido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })

    it('rejeita telefone com formato inválido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        phone: '11987654321'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('userType validation', () => {
    it('aceita userType CLIENTE', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })

    it('aceita userType CONSULTOR', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CONSULTOR'
      })
      expect(result.success).toBe(true)
    })

    it('rejeita userType inválido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'ADMIN'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid')
      }
    })
  })

  describe('cpf validation', () => {
    it('aceita CPF válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cpf: '123.456.789-09'
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo CPF vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cpf: ''
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo CPF omitido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })

    it('rejeita CPF com formato inválido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cpf: '12345678909'
      })
      expect(result.success).toBe(false)
    })

    it('rejeita CPF com dígitos verificadores inválidos', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cpf: '123.456.789-00'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CPF inválido')
      }
    })

    it('rejeita CPF com todos os dígitos iguais', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cpf: '111.111.111-11'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('age validation', () => {
    it('aceita idade válida', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 25
      })
      expect(result.success).toBe(true)
    })

    it('aceita idade de 18 anos', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 18
      })
      expect(result.success).toBe(true)
    })

    it('aceita idade de 120 anos', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 120
      })
      expect(result.success).toBe(true)
    })

    it('rejeita idade menor que 18', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 17
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Idade mínima é 18 anos')
      }
    })

    it('rejeita idade maior que 120', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 121
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Idade máxima é 120 anos')
      }
    })

    it('rejeita idade decimal', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        age: 25.5
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Idade deve ser um número inteiro')
      }
    })

    it('aceita campo idade omitido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('cep validation', () => {
    it('aceita CEP válido com hífen', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cep: '12345-678'
      })
      expect(result.success).toBe(true)
    })

    it('aceita CEP válido sem hífen', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cep: '12345678'
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo CEP vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cep: ''
      })
      expect(result.success).toBe(true)
    })

    it('rejeita CEP com formato inválido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        cep: '123'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CEP inválido. Use o formato XXXXX-XXX')
      }
    })
  })

  describe('state validation', () => {
    it('aceita estado válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        state: 'SP'
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo state vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        state: ''
      })
      expect(result.success).toBe(true)
    })

    it('rejeita estado com 1 caractere', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        state: 'S'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Estado deve ter 2 caracteres')
      }
    })

    it('rejeita estado com 3 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        state: 'SPP'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('address validation', () => {
    it('aceita endereço válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: 'Rua das Flores, 123'
      })
      expect(result.success).toBe(true)
    })

    it('aceita endereço com 5 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: 'Rua 1'
      })
      expect(result.success).toBe(true)
    })

    it('aceita endereço com 200 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: 'a'.repeat(200)
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo address vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: ''
      })
      expect(result.success).toBe(true)
    })

    it('rejeita endereço com menos de 5 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: 'Rua'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Endereço deve ter entre 5 e 200 caracteres')
      }
    })

    it('rejeita endereço com mais de 200 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        address: 'a'.repeat(201)
      })
      expect(result.success).toBe(false)
    })
  })

  describe('complement validation', () => {
    it('aceita complemento válido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        complement: 'Apto 101'
      })
      expect(result.success).toBe(true)
    })

    it('aceita campo complement vazio', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        complement: ''
      })
      expect(result.success).toBe(true)
    })

    it('aceita complemento com 100 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        complement: 'a'.repeat(100)
      })
      expect(result.success).toBe(true)
    })

    it('rejeita complemento com mais de 100 caracteres', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE',
        complement: 'a'.repeat(101)
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Complemento deve ter no máximo 100 caracteres')
      }
    })
  })

  describe('clientIds validation', () => {
    it('aceita array de clientIds', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CONSULTOR',
        clientIds: ['id1', 'id2', 'id3']
      })
      expect(result.success).toBe(true)
    })

    it('aceita array vazio de clientIds', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CONSULTOR',
        clientIds: []
      })
      expect(result.success).toBe(true)
    })

    it('usa array vazio como default quando omitido', () => {
      const result = userSchema.safeParse({
        name: 'João Silva',
        email: 'joao@example.com',
        userType: 'CLIENTE'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.clientIds).toEqual([])
      }
    })
  })
})
