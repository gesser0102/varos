'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'
import { UserType } from '@prisma/client'
import { logError } from '@/lib/errors'
import { validateCSRF } from '@/lib/csrf'

export type UserFormData = {
  id?: string
  name: string
  email: string
  phone?: string
  userType: UserType
  cpf?: string
  age?: number
  cep?: string
  state?: string
  address?: string
  complement?: string
  clientIds?: string[]
}

export async function createUser(data: UserFormData) {
  // CSRF Protection
  await validateCSRF()

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        cpf: data.cpf,
        age: data.age,
        cep: data.cep,
        state: data.state,
        address: data.address,
        complement: data.complement,
      },
    })

    // Se for consultor e tiver clientes selecionados
    if (data.userType === 'CONSULTOR' && data.clientIds && data.clientIds.length > 0) {
      await prisma.consultorClient.createMany({
        data: data.clientIds.map(clientId => ({
          consultorId: user.id,
          clientId,
        })),
      })
    }

    // Revalidar múltiplas tags e paths
    revalidateTag('users', 'max')
    revalidateTag('clients', 'max')
    revalidateTag('stats', 'max')
    revalidateTag('clients-table', 'max')
    revalidateTag('dashboard-stats', 'max')
    revalidatePath('/dashboard')
    revalidatePath('/usuarios/novo')

    return { success: true, user, message: 'Usuário criado com sucesso!' }
  } catch (error: any) {
    logError(error, 'createUser')

    // Tratamento específico de erros do Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      if (field === 'email') {
        return { success: false, error: 'Este email já está cadastrado', field: 'email' }
      }
      if (field === 'cpf') {
        return { success: false, error: 'Este CPF já está cadastrado', field: 'cpf' }
      }
      return { success: false, error: 'Já existe um registro com estes dados' }
    }

    if (error.code === 'P2003') {
      return { success: false, error: 'Referência inválida. Verifique os dados e tente novamente.' }
    }

    return { success: false, error: 'Erro ao criar usuário. Tente novamente.' }
  }
}

export async function updateUser(id: string, data: UserFormData) {
  // CSRF Protection
  await validateCSRF()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        cpf: data.cpf,
        age: data.age,
        cep: data.cep,
        state: data.state,
        address: data.address,
        complement: data.complement,
      },
    })

    // Atualizar relacionamentos se for consultor
    if (data.userType === 'CONSULTOR' && data.clientIds !== undefined) {
      // Remover relacionamentos antigos
      await prisma.consultorClient.deleteMany({
        where: { consultorId: id },
      })

      // Criar novos relacionamentos
      if (data.clientIds.length > 0) {
        await prisma.consultorClient.createMany({
          data: data.clientIds.map(clientId => ({
            consultorId: id,
            clientId,
          })),
        })
      }
    }

    // Revalidar múltiplas tags e paths
    revalidateTag('users', 'max')
    revalidateTag('clients', 'max')
    revalidateTag('stats', 'max')
    revalidateTag('clients-table', 'max')
    revalidateTag('dashboard-stats', 'max')
    revalidatePath('/dashboard')
    revalidatePath('/usuarios/novo')
    revalidatePath(`/usuarios/${id}/editar`)

    return { success: true, user, message: 'Usuário atualizado com sucesso!' }
  } catch (error: any) {
    logError(error, 'updateUser')

    // Tratamento específico de erros do Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      if (field === 'email') {
        return { success: false, error: 'Este email já está cadastrado', field: 'email' }
      }
      if (field === 'cpf') {
        return { success: false, error: 'Este CPF já está cadastrado', field: 'cpf' }
      }
      return { success: false, error: 'Já existe um registro com estes dados' }
    }

    if (error.code === 'P2025') {
      return { success: false, error: 'Usuário não encontrado' }
    }

    if (error.code === 'P2003') {
      return { success: false, error: 'Referência inválida. Verifique os dados e tente novamente.' }
    }

    return { success: false, error: 'Erro ao atualizar usuário. Tente novamente.' }
  }
}

export async function deleteUser(id: string) {
  // CSRF Protection
  await validateCSRF()

  try {
    await prisma.user.delete({
      where: { id },
    })

    // Revalidar múltiplas tags e paths
    revalidateTag('users', 'max')
    revalidateTag('clients', 'max')
    revalidateTag('stats', 'max')
    revalidateTag('clients-table', 'max')
    revalidateTag('dashboard-stats', 'max')
    revalidatePath('/dashboard')
    revalidatePath('/usuarios/novo')

    return { success: true, message: 'Usuário deletado com sucesso!' }
  } catch (error: any) {
    console.error('Error deleting user:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'Usuário não encontrado' }
    }

    if (error.code === 'P2003') {
      return { success: false, error: 'Não é possível deletar este usuário pois ele possui vínculos' }
    }

    return { success: false, error: 'Erro ao deletar usuário. Tente novamente.' }
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        consultorClients: {
          include: {
            client: true,
          },
        },
        clientConsultors: {
          include: {
            consultor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        consultorClients: {
          include: {
            client: true,
          },
        },
        clientConsultors: {
          include: {
            consultor: true,
          },
        },
      },
    })

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
