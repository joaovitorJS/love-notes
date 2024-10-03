'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash,
  type LucideIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { toast } from 'sonner'

interface ItemProps {
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick?: () => void
  icon: LucideIcon
}

function Item({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const create = useMutation(api.documents.create)
  const router = useRouter()
  const { user } = useUser()
  const archive = useMutation(api.documents.archive)

  function onArchive(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    event.stopPropagation()
    if (!id) return

    const promise = archive({ id })

    toast.promise(promise, {
      loading: 'Movendo para lixeira...',
      success: 'Página movida para lixeira!',
      error: 'Falha ao arquivar página',
    })
  }

  function handleExpand(
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) {
    event.stopPropagation()

    onExpand?.()
  }

  function onCreate(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    event.stopPropagation()

    if (!id) return

    const promise = create({
      title: 'Sem Título',
      parentDocument: id,
    }).then(documentId => {
      if (!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Criando uma nova página...',
      success: 'Sua página foi criada!',
      error: 'Erro ao criar nova página.',
    })
  }

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {Boolean(id) && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-nome flex h-5 select-none items-center justify-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">CTRL</span> + K
        </kbd>
      )}

      {Boolean(id) && (
        <div
          className="ml-auto flex items-center gap-x-2"
          role="button"
          onClick={onCreate}
        >
          <DropdownMenu>
            <DropdownMenuTrigger onClick={e => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Última edição por: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

interface ItemSkeletonProps {
  level?: number
}

Item.Skeleton = function ItemSkeleton({ level }: ItemSkeletonProps) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}

export { Item }
