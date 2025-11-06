import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorToolbar } from './EditorToolbar'
import type { Editor } from '@tiptap/react'

// Mock Editor
const createMockEditor = (overrides = {}): Editor => {
  const mockChain = {
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleCode: vi.fn().mockReturnThis(),
    toggleHeading: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleTaskList: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    toggleCodeBlock: vi.fn().mockReturnThis(),
    setHorizontalRule: vi.fn().mockReturnThis(),
    insertTable: vi.fn().mockReturnThis(),
    undo: vi.fn().mockReturnThis(),
    redo: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }

  return {
    chain: vi.fn(() => mockChain),
    isActive: vi.fn((type: string, attrs?: any) => false),
    can: vi.fn(() => ({
      undo: vi.fn(() => true),
      redo: vi.fn(() => true),
    })),
    ...overrides,
  } as unknown as Editor
}

describe('EditorToolbar', () => {
  let mockEditor: Editor

  beforeEach(() => {
    mockEditor = createMockEditor()
  })

  describe('渲染', () => {
    it('当 editor 为 null 时不应该渲染', () => {
      const { container } = render(<EditorToolbar editor={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('应该渲染所有工具栏按钮', () => {
      render(<EditorToolbar editor={mockEditor} />)
      
      // 文本格式化按钮
      expect(screen.getByTitle('加粗 (Ctrl+B)')).toBeInTheDocument()
      expect(screen.getByTitle('斜体 (Ctrl+I)')).toBeInTheDocument()
      expect(screen.getByTitle('删除线')).toBeInTheDocument()
      expect(screen.getByTitle('行内代码')).toBeInTheDocument()
      
      // 标题按钮
      expect(screen.getByTitle('一级标题')).toBeInTheDocument()
      expect(screen.getByTitle('二级标题')).toBeInTheDocument()
      expect(screen.getByTitle('三级标题')).toBeInTheDocument()
      
      // 列表按钮
      expect(screen.getByTitle('无序列表')).toBeInTheDocument()
      expect(screen.getByTitle('有序列表')).toBeInTheDocument()
      expect(screen.getByTitle('任务列表')).toBeInTheDocument()
      
      // 块级元素按钮
      expect(screen.getByTitle('引用')).toBeInTheDocument()
      expect(screen.getByTitle('代码块')).toBeInTheDocument()
      expect(screen.getByTitle('分隔线')).toBeInTheDocument()
      
      // 表格按钮
      expect(screen.getByTitle('插入表格')).toBeInTheDocument()
      
      // 撤销/重做按钮
      expect(screen.getByTitle('撤销 (Ctrl+Z)')).toBeInTheDocument()
      expect(screen.getByTitle('重做 (Ctrl+Y)')).toBeInTheDocument()
    })
  })

  describe('文本格式化按钮', () => {
    it('点击加粗按钮应该调用 toggleBold', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const boldButton = screen.getByTitle('加粗 (Ctrl+B)')
      await user.click(boldButton)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击斜体按钮应该调用 toggleItalic', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const italicButton = screen.getByTitle('斜体 (Ctrl+I)')
      await user.click(italicButton)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击删除线按钮应该调用 toggleStrike', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const strikeButton = screen.getByTitle('删除线')
      await user.click(strikeButton)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击行内代码按钮应该调用 toggleCode', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const codeButton = screen.getByTitle('行内代码')
      await user.click(codeButton)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('标题按钮', () => {
    it('点击 H1 按钮应该调用 toggleHeading', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const h1Button = screen.getByTitle('一级标题')
      await user.click(h1Button)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击 H2 按钮应该调用 toggleHeading', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)
      
      const h2Button = screen.getByTitle('二级标题')
      await user.click(h2Button)
      
      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击 H3 按钮应该调用 toggleHeading', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const h3Button = screen.getByTitle('三级标题')
      await user.click(h3Button)

      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('列表按钮', () => {
    it('点击无序列表按钮应该调用 toggleBulletList', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const bulletListButton = screen.getByTitle('无序列表')
      await user.click(bulletListButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击有序列表按钮应该调用 toggleOrderedList', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const orderedListButton = screen.getByTitle('有序列表')
      await user.click(orderedListButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击任务列表按钮应该调用 toggleTaskList', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const taskListButton = screen.getByTitle('任务列表')
      await user.click(taskListButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('块级元素按钮', () => {
    it('点击引用按钮应该调用 toggleBlockquote', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const blockquoteButton = screen.getByTitle('引用')
      await user.click(blockquoteButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击代码块按钮应该调用 toggleCodeBlock', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const codeBlockButton = screen.getByTitle('代码块')
      await user.click(codeBlockButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击分隔线按钮应该调用 setHorizontalRule', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const hrButton = screen.getByTitle('分隔线')
      await user.click(hrButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('表格按钮', () => {
    it('点击插入表格按钮应该调用 insertTable', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const tableButton = screen.getByTitle('插入表格')
      await user.click(tableButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })
  })

  describe('撤销/重做按钮', () => {
    it('点击撤销按钮应该调用 undo', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const undoButton = screen.getByTitle('撤销 (Ctrl+Z)')
      await user.click(undoButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('点击重做按钮应该调用 redo', async () => {
      const user = userEvent.setup()
      render(<EditorToolbar editor={mockEditor} />)

      const redoButton = screen.getByTitle('重做 (Ctrl+Y)')
      await user.click(redoButton)

      expect(mockEditor.chain).toHaveBeenCalled()
    })

    it('当不能撤销时应该禁用撤销按钮', () => {
      const editorWithNoUndo = createMockEditor({
        can: vi.fn(() => ({
          undo: vi.fn(() => false),
          redo: vi.fn(() => true),
        })),
      })

      render(<EditorToolbar editor={editorWithNoUndo} />)

      const undoButton = screen.getByTitle('撤销 (Ctrl+Z)')
      expect(undoButton).toBeDisabled()
    })

    it('当不能重做时应该禁用重做按钮', () => {
      const editorWithNoRedo = createMockEditor({
        can: vi.fn(() => ({
          undo: vi.fn(() => true),
          redo: vi.fn(() => false),
        })),
      })

      render(<EditorToolbar editor={editorWithNoRedo} />)

      const redoButton = screen.getByTitle('重做 (Ctrl+Y)')
      expect(redoButton).toBeDisabled()
    })
  })

  describe('激活状态', () => {
    it('当文本加粗时应该高亮加粗按钮', () => {
      const editorWithBold = createMockEditor({
        isActive: vi.fn((type: string) => type === 'bold'),
      })

      render(<EditorToolbar editor={editorWithBold} />)

      const boldButton = screen.getByTitle('加粗 (Ctrl+B)')
      expect(boldButton).toHaveClass('is-active')
    })

    it('当文本斜体时应该高亮斜体按钮', () => {
      const editorWithItalic = createMockEditor({
        isActive: vi.fn((type: string) => type === 'italic'),
      })

      render(<EditorToolbar editor={editorWithItalic} />)

      const italicButton = screen.getByTitle('斜体 (Ctrl+I)')
      expect(italicButton).toHaveClass('is-active')
    })
  })
})

