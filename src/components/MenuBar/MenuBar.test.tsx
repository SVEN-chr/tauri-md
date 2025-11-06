import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuBar } from './MenuBar'
import { useDocumentStore } from '../../store/documentStore'

// Mock window.confirm and window.alert
const mockConfirm = vi.fn()
const mockAlert = vi.fn()

// 创建 mock 元素
const createMockElement = (tagName: string) => {
  const element = document.createElement(tagName)
  // 为 a 和 input 元素添加 click mock
  if (tagName === 'a' || tagName === 'input') {
    const originalClick = element.click
    element.click = vi.fn(() => {
      // 如果需要，可以调用原始的 click
      // originalClick.call(element)
    })
  }
  return element
}

describe('MenuBar', () => {
  let createElementSpy: any

  beforeEach(() => {
    // 重置 store
    const { reset } = useDocumentStore.getState()
    reset()

    // Mock window methods
    window.confirm = mockConfirm
    window.alert = mockAlert

    // Mock URL methods
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()

    // 使用更安全的 createElement mock
    // 只在需要时拦截特定标签
    createElementSpy = vi.spyOn(document, 'createElement')
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (createElementSpy) {
      createElementSpy.mockRestore()
    }
  })

  describe('渲染', () => {
    it('应该渲染应用标题', () => {
      render(<MenuBar />)
      expect(screen.getByText('Markdown 编辑器')).toBeInTheDocument()
    })

    it('应该渲染所有菜单按钮', () => {
      render(<MenuBar />)
      
      expect(screen.getByTitle('新建文档')).toBeInTheDocument()
      expect(screen.getByTitle('打开文档')).toBeInTheDocument()
      expect(screen.getByTitle('保存文档')).toBeInTheDocument()
      expect(screen.getByTitle('导出为 HTML')).toBeInTheDocument()
    })

    it('当有文件路径时应该显示文件名', () => {
      const { setFilePath } = useDocumentStore.getState()
      setFilePath('test.md')
      
      render(<MenuBar />)
      
      expect(screen.getByText('test.md')).toBeInTheDocument()
    })

    it('当文档是脏状态时应该显示脏标识', () => {
      const { setContent } = useDocumentStore.getState()
      setContent('新内容')
      
      render(<MenuBar />)
      
      expect(screen.getByText('●')).toBeInTheDocument()
    })

    it('当文档不是脏状态时不应该显示脏标识', () => {
      render(<MenuBar />)
      
      expect(screen.queryByText('●')).not.toBeInTheDocument()
    })
  })

  describe('新建文档', () => {
    it('当文档未修改时应该直接创建新文档', async () => {
      const user = userEvent.setup()
      render(<MenuBar />)
      
      const newButton = screen.getByTitle('新建文档')
      await user.click(newButton)
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe('# 新文档\n\n开始编写...')
      expect(mockConfirm).not.toHaveBeenCalled()
    })

    it('当文档已修改时应该显示确认对话框', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('已修改的内容')
      
      mockConfirm.mockReturnValue(true)
      
      render(<MenuBar />)
      
      const newButton = screen.getByTitle('新建文档')
      await user.click(newButton)
      
      expect(mockConfirm).toHaveBeenCalledWith('当前文档未保存，是否继续？')
    })

    it('当用户确认时应该创建新文档', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('已修改的内容')
      
      mockConfirm.mockReturnValue(true)
      
      render(<MenuBar />)
      
      const newButton = screen.getByTitle('新建文档')
      await user.click(newButton)
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe('# 新文档\n\n开始编写...')
    })

    it('当用户取消时不应该创建新文档', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      const originalContent = '已修改的内容'
      setContent(originalContent)
      
      mockConfirm.mockReturnValue(false)
      
      render(<MenuBar />)
      
      const newButton = screen.getByTitle('新建文档')
      await user.click(newButton)
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe(originalContent)
    })

    it('应该设置新文档内容', async () => {
      const user = userEvent.setup()
      render(<MenuBar />)

      const newButton = screen.getByTitle('新建文档')
      await user.click(newButton)

      // 验证内容被设置为新文档模板
      await waitFor(() => {
        const state = useDocumentStore.getState()
        expect(state.content).toBe('# 新文档\n\n开始编写...')
      })
    })
  })

  describe('打开文档', () => {
    it('应该触发打开文档操作', async () => {
      const user = userEvent.setup()
      render(<MenuBar />)

      const openButton = screen.getByTitle('打开文档')

      // 验证按钮存在且可点击
      expect(openButton).toBeInTheDocument()
      expect(openButton).not.toBeDisabled()

      // 点击按钮（实际的文件选择需要用户交互，无法在单元测试中完全模拟）
      await user.click(openButton)

      // 验证 createElement 被调用
      expect(createElementSpy).toHaveBeenCalled()
    })
  })

  describe('保存文档', () => {
    it('应该创建下载链接', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('# 测试内容')

      render(<MenuBar />)

      const saveButton = screen.getByTitle('保存文档')
      await user.click(saveButton)

      // 验证 URL.createObjectURL 被调用
      expect(global.URL.createObjectURL).toHaveBeenCalled()
      // 验证 createElement 被调用（创建 anchor 元素）
      expect(createElementSpy).toHaveBeenCalled()
    })

    it('保存后应该清除脏状态', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('# 测试内容')

      render(<MenuBar />)

      const saveButton = screen.getByTitle('保存文档')
      await user.click(saveButton)

      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(false)
    })

    it('应该清理 URL 对象', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('# 测试内容')

      render(<MenuBar />)

      const saveButton = screen.getByTitle('保存文档')
      await user.click(saveButton)

      expect(global.URL.revokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('导出 HTML', () => {
    it('应该创建 HTML 文件', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('# 测试内容')

      render(<MenuBar />)

      const exportButton = screen.getByTitle('导出为 HTML')
      await user.click(exportButton)

      // 验证 URL.createObjectURL 被调用
      expect(global.URL.createObjectURL).toHaveBeenCalled()
      // 验证 createElement 被调用（创建 anchor 元素）
      expect(createElementSpy).toHaveBeenCalled()
    })

    it('应该清理 URL 对象', async () => {
      const user = userEvent.setup()
      const { setContent } = useDocumentStore.getState()
      setContent('# 测试内容')

      render(<MenuBar />)

      const exportButton = screen.getByTitle('导出为 HTML')
      await user.click(exportButton)

      expect(global.URL.revokeObjectURL).toHaveBeenCalled()
    })
  })
})

