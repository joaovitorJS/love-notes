'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react'

interface TitleProps {
  initialData: Doc<'documents'>
}

function Title({ initialData }: TitleProps) {
  const update = useMutation(api.documents.update)
  const inputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(initialData.title || 'Sem Título')
  const [isEditing, setIsEditing] = useState(false)

  function enableInput() {
    setTitle(initialData.title)
    setIsEditing(true)

    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0)
  }

  function disableInput() {
    setIsEditing(false)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)

    update({
      id: initialData._id,
      title: event.target.value || 'Sem Título',
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      disableInput()
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-7 w-20 rounded-md" />
}

export { Title }
