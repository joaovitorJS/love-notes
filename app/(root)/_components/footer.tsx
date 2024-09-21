import { Button } from '@/components/ui/button'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="flex items-center w-full p-6 bg-background z-50">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Politicas de Privacidade
        </Button>
        <Button variant="ghost" size="sm">
          Termos & Condições
        </Button>
      </div>
    </footer>
  )
}
