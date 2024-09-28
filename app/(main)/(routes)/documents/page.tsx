'use client'

import Image from 'next/image'
import { useClerk } from '@clerk/clerk-react'
import { env } from '@/lib/env'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const appName = env.NEXT_PUBLIC_APP_NAME

export default function DocumentsPage() {
  const { user } = useClerk()

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

      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Criar anotação
      </Button>
    </div>
  )
}
