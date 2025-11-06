import { z } from 'zod'

// Validação de CPF brasileiro
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  // Valida os dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit === 10 || digit === 11) digit = 0
  if (digit !== parseInt(cleaned.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit === 10 || digit === 11) digit = 0
  if (digit !== parseInt(cleaned.charAt(10))) return false

  return true
}

// Validação de CEP brasileiro
const cepRegex = /^\d{5}-?\d{3}$/

// Validação de telefone brasileiro
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/

export const userSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  email: z.string()
    .email('Email inválido')
    .min(5, 'Email deve ter no mínimo 5 caracteres')
    .max(100, 'Email deve ter no máximo 100 caracteres')
    .toLowerCase(),

  phone: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || phoneRegex.test(val),
      'Telefone inválido. Use o formato (XX) XXXXX-XXXX'
    ),

  userType: z.enum(['CLIENTE', 'CONSULTOR'], {
    message: 'Tipo de usuário inválido'
  }),

  cpf: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || cpfRegex.test(val),
      'CPF inválido. Use o formato XXX.XXX.XXX-XX'
    )
    .refine(
      (val) => !val || val === '' || validateCPF(val),
      'CPF inválido'
    ),

  age: z.number()
    .int('Idade deve ser um número inteiro')
    .min(18, 'Idade mínima é 18 anos')
    .max(120, 'Idade máxima é 120 anos')
    .optional(),

  cep: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || cepRegex.test(val),
      'CEP inválido. Use o formato XXXXX-XXX'
    ),

  state: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || val.length === 2,
      'Estado deve ter 2 caracteres'
    ),

  address: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || (val.length >= 5 && val.length <= 200),
      'Endereço deve ter entre 5 e 200 caracteres'
    ),

  complement: z.string()
    .optional()
    .refine(
      (val) => !val || val === '' || val.length <= 100,
      'Complemento deve ter no máximo 100 caracteres'
    ),

  clientIds: z.array(z.string()).default([])
})

export type UserSchemaType = z.infer<typeof userSchema>
