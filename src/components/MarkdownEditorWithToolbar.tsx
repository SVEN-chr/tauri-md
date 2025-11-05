import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Typography } from '@tiptap/extension-typography'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { Mathematics } from '@tiptap/extension-mathematics'
import { common, createLowlight } from 'lowlight'
import { useEffect } from 'react'

const lowlight = createLowlight(common)
import { EditorToolbar } from './Toolbar/EditorToolbar'
import './Editor/MarkdownEditor.css'
import './MarkdownEditorWithToolbar.css'
import 'katex/dist/katex.min.css'

interface MarkdownEditorWithToolbarProps {
  content?: string
  onChange?: (markdown: string) => void
  placeholder?: string
}

export const MarkdownEditorWithToolbar = ({ 
  content = '', 
  onChange,
  placeholder = '开始输入 Markdown...'
}: MarkdownEditorWithToolbarProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: 'tight',
        bulletListMarker: '-',
        linkify: true,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
          displayMode: false,
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.getMarkdown()
      onChange?.(markdown)
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getMarkdown()) {
      editor.commands.setContent(content, {
        contentType: 'markdown'
      })
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="markdown-editor-with-toolbar">
      <EditorToolbar editor={editor} />
      <div className="markdown-editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

