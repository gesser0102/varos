'use client'

import { useTransition, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUser } from '@/lib/actions/users'
import { toast } from 'sonner'
import { UserType } from '@prisma/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

type EditUserActionsProps = {
  userId: string
  userType: UserType
}

export function EditUserActions({ userId, userType }: EditUserActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  useEffect(() => {
    const form = document.getElementById('user-form') as HTMLFormElement

    const handleSubmitStart = () => setIsSubmitting(true)
    const handleSubmitEnd = () => setIsSubmitting(false)

    if (form) {
      form.addEventListener('submit', handleSubmitStart)
      window.addEventListener('beforeunload', handleSubmitEnd)
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', handleSubmitStart)
      }
      window.removeEventListener('beforeunload', handleSubmitEnd)
    }
  }, [])

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    startTransition(async () => {
      const result = await deleteUser(userId)

      if (result.success) {
        setShowDeleteModal(false)
        toast.success(result.message || 'Usuário deletado com sucesso!')
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 100))
        // Redirecionar para a dashboard correta baseado no tipo de usuário
        const dashboardUrl = userType === 'CONSULTOR' ? '/consultores' : '/dashboard'
        router.push(dashboardUrl)
      } else {
        setShowDeleteModal(false)
        toast.error(result.error || 'Erro ao deletar usuário')
      }
    })
  }

  const handleUpdateClick = () => {
    setShowUpdateModal(true)
  }

  const handleUpdateConfirm = () => {
    setShowUpdateModal(false)
    const form = document.getElementById('user-form') as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  }

  const isDisabled = isPending || isSubmitting

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleUpdateClick}
          disabled={isDisabled}
          className="bg-[#1B3F1B] hover:bg-[#224d22] px-6 sm:px-10 py-3 rounded-full font-semibold text-base sm:text-lg tracking-wider text-[#00F700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {isSubmitting ? 'Atualizando...' : 'Atualizar usuário'}
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDisabled}
          className="bg-[rgba(242,244,248,0.04)] hover:bg-[rgba(242,244,248,0.08)] px-6 sm:px-10 py-3 rounded-full font-semibold text-base sm:text-lg tracking-wider text-[#878D96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <LoadingSpinner size="sm" />}
          {isPending ? 'Deletando...' : 'Deletar usuário'}
        </button>
      </div>

      {/* Modal de confirmação para atualizar */}
      <ConfirmModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleUpdateConfirm}
        title="Confirmar atualização"
        message="Deseja salvar as alterações feitas neste usuário?"
        confirmText="Atualizar"
        cancelText="Cancelar"
        confirmButtonClass="bg-[#1B3F1B] hover:bg-[#224d22] text-[#00F700]"
        isLoading={isSubmitting}
      />

      {/* Modal de confirmação para deletar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar exclusão"
        message="Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isPending}
      />
    </>
  )
}
