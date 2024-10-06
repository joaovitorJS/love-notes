'use client'

import {
  type ElementRef,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

import { UserItem } from './user-item'
import { Item } from './item'
import { DocumentList } from './document-list'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TrashBox } from './trash-box'
import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/use-settings'

export function Navigation() {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const create = useMutation(api.documents.create)
  const search = useSearch()
  const settings = useSettings()

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  function handleMouseMove(event: globalThis.MouseEvent): void {
    if (!isResizingRef.current) return

    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  function handleMouseUp(): void {
    isResizingRef.current = false

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  function handleMouseDown(
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ): void {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function resetWidth(): void {
    if (!sidebarRef.current || !navbarRef.current) return

    setIsCollapsed(false)
    setIsResetting(true)

    sidebarRef.current.style.width = isMobile ? '100%' : '240px'
    navbarRef.current.style.setProperty(
      'width',
      isMobile ? '0' : 'calc(100%-240px)'
    )
    navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')
    animateResettingDelay()
  }

  function collapse() {
    if (!sidebarRef.current || !navbarRef.current) return

    setIsCollapsed(true)
    setIsResetting(true)

    sidebarRef.current.style.width = '0'
    navbarRef.current.style.setProperty('width', 'calc(100%-240px)')
    navbarRef.current.style.setProperty('left', '0')
    animateResettingDelay()
  }

  function animateResettingDelay() {
    setTimeout(() => setIsResetting(false), 300)
  }

  function handleCreate() {
    const promise = create({
      title: 'Sem Título',
    })

    toast.promise(promise, {
      loading: 'Criando uma nova anotação...',
      success: 'Sua anotação foi criada!',
      error: 'Erro ao criar sua anotação.',
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <button
          type="button"
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}
          onClick={collapse}
        >
          <ChevronsLeft className="h-6 w-6" />
        </button>

        <div>
          <UserItem />
          <Item label="Buscar" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Configurações" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="Nova Página" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Adiconar página" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Remover" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="p-0 w-72"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              className="h-6 w-6 text-muted-foreground"
              role="button"
              onClick={resetWidth}
            />
          )}
        </nav>
      </div>
    </>
  )
}
