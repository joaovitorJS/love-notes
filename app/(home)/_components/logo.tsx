import Image from 'next/image'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export function Logo() {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo-black.svg"
        alt="Love Notes logo"
        width={80}
        height={80}
        className="dark:hidden"
      />
      <Image
        src="/logo-white.svg"
        alt="Love Notes logo"
        width={80}
        height={80}
        className="hidden dark:block"
      />
      <p className={cn('font-semibold', font.className)}>LoveNotes</p>
    </div>
  )
}
