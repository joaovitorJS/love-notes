'use client'

import Image from 'next/image'
import { useUser } from '@clerk/clerk-react'
import { env } from '@/lib/env'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

const appName = env.NEXT_PUBLIC_APP_NAME

export default function DocumentsPage() {
  const { user } = useUser()
  const create = useMutation(api.documents.create)

  function onCreate() {
    const promise = create({ title: 'Sem Título' })

    toast.promise(promise, {
      loading: 'Criando uma nova anotação...',
      success: 'Sua anotação foi criada!',
      error: 'Erro ao criar sua anotação.',
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty-notes.png"
        alt="Sem documentos"
        height={300}
        width={300}
        className="w-auto h-auto"
        priority
      />
      <h2 className="font-medium text-lg">
        Bem vindo {user?.firstName}&apos;s {appName}
      </h2>

      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Criar anotação
      </Button>
    </div>
  )
}
