'use client'

import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { type MouseEvent, useState } from 'react'
import { toast } from 'sonner'

export function TrashBox() {
  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  const [search, setSearch] = useState('')

  const filteredDocuments = documents?.filter(document => {
    return document.title.toLowerCase().includes(search.toLowerCase())
  })

  function onClick(documentId: string) {
    router.push(`/documents/${documentId}`)
  }

  function onRestore(
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    documentId: Id<'documents'>
  ) {
    event.stopPropagation()

    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restaurando página...',
      success: 'Página restaurada!',
      error: 'Falha ao restaurar página.',
    })
  }

  function onRemove(documentId: Id<'documents'>) {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deletando página...',
      success: 'Página deletada!',
      error: 'Falha ao deletar página.',
    })

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filtrar pelo título da página..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          Sem documentos.
        </p>
        {filteredDocuments?.map(document => (
          <div
            className="text-sm rounded-sm w-full hover:br-primary/5 flex items-center text-primary justify-between"
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
          >
            <span className="trucate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={e => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  className="rounded-sm p-2 hover:bg-neutral-200"
                  role="button"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
