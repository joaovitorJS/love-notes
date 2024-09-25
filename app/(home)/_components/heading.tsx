'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Heading() {
  return (
    <div className="max-w-3xl space-y-4 ">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Suas Ideias, Documentos e Planos. <br />
        Bem vindo ao <span className="underline">LoveNotes</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        LoveNotes é um espaço criativo onde o trabalho se torna mais ágil e
        produtivo.
      </h3>
      <Button>
        Enter LoveNotes
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
