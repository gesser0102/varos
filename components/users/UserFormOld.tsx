'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, updateUser, type UserFormData } from '@/lib/actions/users'
import { UserType } from '@prisma/client'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { userSchema } from '@/lib/validations/user'
import { fetchAddressByCep } from '@/lib/services/viacep'
import { maskCPF, maskCEP, maskPhone } from '@/lib/utils/masks'
import { z } from 'zod'
import { toast } from 'sonner'

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
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loadingCep, setLoadingCep] = useState(false)

  const [formData, setFormData] = useState<UserFormData>({
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
  })

  const handleCepBlur = async () => {
    if (!formData.cep || formData.cep.length < 8) return

    setLoadingCep(true)
    setFieldErrors(prev => ({ ...prev, cep: '' }))

    const data = await fetchAddressByCep(formData.cep)

    if (data) {
      setFormData(prev => ({
        ...prev,
        address: data.logradouro || prev.address,
        state: data.uf || prev.state,
        complement: data.complemento || prev.complement,
      }))
      toast.success('Endereço preenchido automaticamente')
    } else {
      setFieldErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }))
      toast.error('CEP não encontrado')
    }

    setLoadingCep(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Validação com Zod
    const validationResult = userSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      console.log('Validation result:', validationResult)

      validationResult.error.issues.forEach((issue) => {
        if (issue.path && issue.path[0]) {
          const fieldName = issue.path[0] as string
          errors[fieldName] = issue.message
          console.log(`Error in field ${fieldName}:`, issue.message)
        }
      })

      setFieldErrors(errors)
      setError('Por favor, corrija os erros no formulário')

      // Toast com lista de erros detalhada
      const errorCount = Object.keys(errors).length
      if (errorCount > 0) {
        toast.error(`${errorCount} ${errorCount === 1 ? 'erro encontrado' : 'erros encontrados'}`, {
          description: Object.values(errors)[0] // Mostra o primeiro erro
        })
      } else {
        toast.error('Erro de validação no formulário')
      }
      return
    }

    startTransition(async () => {
      const result = user
        ? await updateUser(user.id, formData)
        : await createUser(formData)

      if (result.success) {
        toast.success(result.message || 'Operação realizada com sucesso!')
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/dashboard')
      } else {
        setError(result.error || 'Erro ao salvar usuário')

        // Se houver um campo específico com erro, destacá-lo
        if ('field' in result && result.field) {
          setFieldErrors({ [result.field]: result.error })
        }

        toast.error(result.error || 'Erro ao salvar usuário', {
          description: 'Verifique os dados e tente novamente'
        })
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Tipo de usuário */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Tipo do usuário *</label>
        <CustomSelect
          options={userTypeOptions}
          value={formData.userType}
          onChange={(value) => setFormData({ ...formData, userType: value as UserType })}
          placeholder="Selecione o tipo do usuário"
          disabled={isPending}
        />
        {fieldErrors.userType && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.userType}</p>
        )}
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nome *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome completo"
            className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
              fieldErrors.name ? 'border-red-500' : 'border-[#2a2a2a]'
            }`}
            disabled={isPending}
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
            placeholder="(XX) XXXXX-XXXX"
            className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
              fieldErrors.phone ? 'border-red-500' : 'border-[#2a2a2a]'
            }`}
            disabled={isPending}
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="exemplo@email.com"
          className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
            fieldErrors.email ? 'border-red-500' : 'border-[#2a2a2a]'
          }`}
          disabled={isPending}
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
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
        {formData.userType === 'CONSULTOR' && (
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
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="18"
                min="18"
                max="120"
                className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                  fieldErrors.age ? 'border-red-500' : 'border-[#2a2a2a]'
                }`}
                disabled={isPending}
              />
              {fieldErrors.age && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">CPF</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                  fieldErrors.cpf ? 'border-red-500' : 'border-[#2a2a2a]'
                }`}
                disabled={isPending}
              />
              {fieldErrors.cpf && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.cpf}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">CEP</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: maskCEP(e.target.value) })}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  maxLength={9}
                  className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                    fieldErrors.cep ? 'border-red-500' : 'border-[#2a2a2a]'
                  }`}
                  disabled={isPending || loadingCep}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {fieldErrors.cep && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.cep}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Estado</label>
              <CustomSelect
                options={stateOptions}
                value={formData.state || ''}
                onChange={(value) => setFormData({ ...formData, state: value })}
                placeholder="Selecione o estado"
                disabled={isPending || loadingCep}
              />
              {fieldErrors.state && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.state}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Endereço</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua, avenida, número"
              className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                fieldErrors.address ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              disabled={isPending || loadingCep}
            />
            {fieldErrors.address && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Complemento</label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              placeholder="Apartamento, bloco, etc."
              className={`w-full bg-[#1a1a1a] border rounded-md px-4 py-3 text-white placeholder:text-gray-600 ${
                fieldErrors.complement ? 'border-red-500' : 'border-[#2a2a2a]'
              }`}
              disabled={isPending}
            />
            {fieldErrors.complement && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.complement}</p>
            )}
          </div>
        </div>
      )}

      {/* Tab Content - Adicionar clientes */}
      {activeTab === 'clientes' && formData.userType === 'CONSULTOR' && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Clientes</label>
          {clientes.length === 0 ? (
            <p className="text-gray-500 text-center py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
              Nenhum cliente disponível
            </p>
          ) : (
            <MultiSelect
              options={clientes.map(c => ({ value: c.id, label: c.name }))}
              value={formData.clientIds || []}
              onChange={(values) => setFormData({ ...formData, clientIds: values })}
              placeholder="Selecione os clientes"
              disabled={isPending}
            />
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-700 hover:bg-green-600 px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Salvando...' : user ? 'Atualizar usuário' : 'Criar usuário'}
        </button>
      </div>
    </form>
  )
}
