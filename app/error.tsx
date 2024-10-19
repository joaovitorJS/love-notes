'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image src="/404.png" height={300} width={300} alt="Erro" />
      <h2 className="text-xl font-medium">Algo deu errado</h2>
      <Button asChild>
        <Link href="/documents">Voltar</Link>
      </Button>
    </div>
  )
}
