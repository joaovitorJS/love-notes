'use client'

import type { Doc } from '@/convex/_generated/dataModel'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useOrigin } from '@/hooks/use-origin'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Check, Copy, Globe } from 'lucide-react'

interface PublishProps {
  initialData: Doc<'documents'>
}

export function Publish({ initialData }: PublishProps) {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  function onPublish() {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'Publicando...',
      success: 'Página publicada',
      error: 'Erro ao publicar página',
    })
  }

  function onUnpublish() {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'Despublicando...',
      success: 'Página não publicada',
      error: 'Erro ao despublicar página',
    })
  }

  function onCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publicar
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                Essa página está disponível na web
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Despublicar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publicar essa página</p>
            <span className="text-xs text-muted-foreground mb-4">
              Compartilhe com outras pessoas
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publicar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
