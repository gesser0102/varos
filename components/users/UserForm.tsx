'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUser, updateUser, deleteUser, type UserFormData } from '@/lib/actions/users'
import { UserType } from '@prisma/client'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { userSchema, type UserSchemaType } from '@/lib/validations/user'
import { fetchAddressByCep } from '@/lib/services/viacep'
import { maskCPF, maskCEP, maskPhone } from '@/lib/utils/masks'
import { toast } from 'sonner'
import { useState } from 'react'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  phone: string | null
  userType: UserType
  cpf: string | null
  age: number | null
  cep: string | null
  state: string | null
  address: string | null
  complement: string | null
  consultorClients: Array<{
    client: {
      id: string
      name: string
    }
  }>
}

type Cliente = {
  id: string
  name: string
}

export function UserForm({ user, clientes }: { user?: User; clientes: Cliente[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'basicas' | 'clientes'>('basicas')
  const [loadingCep, setLoadingCep] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError: setFormError,
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      userType: user?.userType || 'CLIENTE',
      cpf: user?.cpf || '',
      age: user?.age || undefined,
      cep: user?.cep || '',
      state: user?.state || '',
      address: user?.address || '',
      complement: user?.complement || '',
      clientIds: user?.consultorClients.map(c => c.client.id) || [],
    },
  })

  const watchedUserType = watch('userType')
  const watchedCep = watch('cep')
  const watchedClientIds = watch('clientIds')

  const handleCepBlur = async () => {
    if (!watchedCep || watchedCep.length < 8) return

    setLoadingCep(true)

    try {
      const data = await fetchAddressByCep(watchedCep)

      if (data) {
        setValue('address', data.logradouro || '')
        setValue('state', data.uf || '')
        setValue('complement', data.complemento || '')
        toast.success('Endereço preenchido automaticamente')
      } else {
        setFormError('cep', { message: 'CEP não encontrado' })
        toast.error('CEP não encontrado')
      }
    } catch (error: any) {
      setFormError('cep', { message: error.message || 'Erro ao buscar CEP' })
      toast.error(error.message || 'Erro ao buscar CEP')
    } finally {
      setLoadingCep(false)
    }
  }

  const onSubmit = async (data: UserSchemaType) => {
    startTransition(async () => {
      const result = user
        ? await updateUser(user.id, data as UserFormData)
        : await createUser(data as UserFormData)

      if (result.success) {
        toast.success(result.message || 'Operação realizada com sucesso!')
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 100))
        // Redirecionar para a dashboard correta baseado no tipo de usuário
        const userType = data.userType
        const dashboardUrl = userType === 'CONSULTOR' ? '/consultores' : '/dashboard'
        router.push(dashboardUrl)
      } else {
        // Se houver um campo específico com erro, destacá-lo
        if ('field' in result && result.field) {
          setFormError(result.field as any, { message: result.error })
        }

        toast.error(result.error || 'Erro ao salvar usuário', {
          description: 'Verifique os dados e tente novamente'
        })
      }
    })
  }

  const handleDelete = async () => {
    if (!user) return

    const confirmed = confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')
    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteUser(user.id)

      if (result.success) {
        toast.success(result.message || 'Usuário deletado com sucesso!')
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Erro ao deletar usuário')
      }
    })
  }

  const userTypeOptions = [
    { value: 'CLIENTE', label: 'Cliente' },
    { value: 'CONSULTOR', label: 'Consultor' },
  ]

  const stateOptions = [
    { value: '', label: 'Selecione o estado' },
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ]

  return (
    <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tipo de usuário */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Tipo do usuário *</label>
        <CustomSelect
          options={userTypeOptions}
          value={watchedUserType}
          onChange={(value) => setValue('userType', value as UserType)}
          placeholder="Selecione o tipo do usuário"
          disabled={isPending}
        />
        {errors.userType && (
          <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
        )}
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nome *</label>
          <input
            type="text"
            {...register('name')}
            placeholder="Digite o nome completo"
            className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
              errors.name ? 'border-red-500' : 'border-[#2a2a2a]'
            }`}
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Telefone</label>
          <input
            type="tel"
            {...register('phone')}
            onChange={(e) => setValue('phone', maskPhone(e.target.value))}
            placeholder="(XX) XXXXX-XXXX"
            className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
              errors.phone ? 'border-red-500' : 'border-[#2a2a2a]'
            }`}
            disabled={isPending}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Email *</label>
        <input
          type="email"
          {...register('email')}
          placeholder="exemplo@email.com"
          className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
            errors.email ? 'border-red-500' : 'border-[#2a2a2a]'
          }`}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#2a2a2a]">
        <button
          type="button"
          onClick={() => setActiveTab('basicas')}
          className={`pb-3 px-1 ${
            activeTab === 'basicas'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400'
          }`}
        >
          Informações básicas
        </button>
        {watchedUserType === 'CONSULTOR' && (
          <button
            type="button"
            onClick={() => setActiveTab('clientes')}
            className={`pb-3 px-1 ${
              activeTab === 'clientes'
                ? 'border-b-2 border-white text-white'
                : 'text-gray-400'
            }`}
          >
            Adicionar clientes
          </button>
        )}
      </div>

      {/* Tab Content - Informações básicas */}
      {activeTab === 'basicas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Idade</label>
              <input
                type="number"
                {...register('age', { valueAsNumber: true })}
                placeholder="18"
                min="18"
                max="120"
                className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                  errors.age ? 'border-red-500' : 'border-[#2a2a2a]'
                }`}
                disabled={isPending}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">CPF</label>
              <input
                type="text"
                {...register('cpf')}
                onChange={(e) => setValue('cpf', maskCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                  errors.cpf ? 'border-red-500' : 'border-[#2a2a2a]'
                }`}
                disabled={isPending}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">CEP</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('cep')}
                  onChange={(e) => setValue('cep', maskCEP(e.target.value))}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  maxLength={9}
                  className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                    errors.cep ? 'border-red-500' : 'border-[#2a2a2a]'
                  }`}
                  disabled={isPending || loadingCep}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {errors.cep && (
                <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Estado</label>
              <CustomSelect
                options={stateOptions}
                value={watch('state') || ''}
                onChange={(value) => setValue('state', value)}
                placeholder="Selecione o estado"
                disabled={isPending || loadingCep}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Endereço</label>
            <input
              type="text"
              {...register('address')}
              placeholder="Rua, avenida, número"
              className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                errors.address ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              disabled={isPending || loadingCep}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Complemento</label>
            <input
              type="text"
              {...register('complement')}
              placeholder="Apartamento, bloco, etc."
              className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                errors.complement ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              disabled={isPending}
            />
            {errors.complement && (
              <p className="text-red-500 text-sm mt-1">{errors.complement.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Tab Content - Adicionar clientes */}
      {activeTab === 'clientes' && watchedUserType === 'CONSULTOR' && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Clientes</label>
          {clientes.length === 0 ? (
            <p className="text-gray-500 text-center py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
              Nenhum cliente disponível
            </p>
          ) : (
            <MultiSelect
              options={clientes.map(c => ({ value: c.id, label: c.name }))}
              value={watchedClientIds || []}
              onChange={(values) => setValue('clientIds', values)}
              placeholder="Selecione os clientes"
              disabled={isPending}
            />
          )}
        </div>
      )}
    </form>
  )
}
