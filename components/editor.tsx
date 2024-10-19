'use client'

import { useTheme } from 'next-themes'

import { useEdgeStore } from '@/lib/edgestore'

import type { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

export default function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps) {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  })

  async function handleUpload(file: File) {
    const response = await edgestore.publicFiles.upload({
      file,
    })

    return response.url
  }

  function onEditorContentChange() {
    onChange(JSON.stringify(editor.document, null, 2))
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        onChange={() => onEditorContentChange()}
      />
    </div>
  )
}
