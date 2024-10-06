'use client'

import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface BannerProps {
  documentId: Id<'documents'>
}

export function Banner({ documentId }: BannerProps) {
  const router = useRouter()

  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  function onRemove() {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deletando página...',
      success: 'Página deletada!',
      error: 'Falha ao deletar página.',
    })

    router.push('/documents')
  }

  function onRestore() {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restaurando página...',
      success: 'Página restaurada!',
      error: 'Falha ao restaurar página.',
    })
  }

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>Essa página está na lixeira</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restaurar página
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Deletar permanente
        </Button>
      </ConfirmModal>
    </div>
  )
}
