'use client'

import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { Card } from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toogle'

export function Navbar() {
  const scrolled = useScrollTop()

  return (
    <Card
      className={cn(
        'z-50 fixed top-0 flex items-center w-full px-6 py-2 border-none shadow-none rounded-none bg-background dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between flex w-full items-center gap-x-2">
        <ModeToggle />
      </div>
    </Card>
  )
}
