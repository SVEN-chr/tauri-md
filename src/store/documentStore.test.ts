import { describe, it, expect, beforeEach } from 'vitest'
import { useDocumentStore } from './documentStore'

describe('documentStore', () => {
  beforeEach(() => {
    // 重置 store 到初始状态，并设置默认内容
    const store = useDocumentStore.getState()
    store.reset()
    // 设置默认欢迎内容（模拟实际应用的初始状态）
    store.setContent('# 欢迎使用 Markdown 编辑器\n\n开始编写你的文档...\n\n## 功能特性\n\n- **加粗文本**\n- *斜体文本*\n- ~~删除线~~\n- `行内代码`\n\n## 代码块示例\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```\n\n## 任务列表\n\n- [x] 完成的任务\n- [ ] 待办任务\n\n## 表格\n\n| 功能 | 状态 |\n|------|------|\n| Markdown | ✅ |\n| 代码高亮 | ✅ |\n| 数学公式 | ✅ |\n\n## 数学公式\n\n行内公式：$E = mc^2$\n\n块级公式：\n\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n')
    store.setDirty(false)
  })

  describe('初始状态', () => {
    it('应该有默认的欢迎内容', () => {
      const { content } = useDocumentStore.getState()
      expect(content).toContain('# 欢迎使用 Markdown 编辑器')
      expect(content).toContain('## 功能特性')
    })

    it('应该没有文件路径', () => {
      const { filePath } = useDocumentStore.getState()
      expect(filePath).toBeNull()
    })

    it('应该不是脏状态', () => {
      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(false)
    })
  })

  describe('setContent', () => {
    it('应该更新内容', () => {
      const { setContent } = useDocumentStore.getState()
      const newContent = '# 新内容\n\n这是测试内容'
      
      setContent(newContent)
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe(newContent)
    })

    it('应该将 isDirty 设置为 true', () => {
      const { setContent } = useDocumentStore.getState()
      
      setContent('新内容')
      
      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(true)
    })

    it('应该能处理空字符串', () => {
      const { setContent } = useDocumentStore.getState()
      
      setContent('')
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe('')
    })

    it('应该能处理包含特殊字符的内容', () => {
      const { setContent } = useDocumentStore.getState()
      const specialContent = '# 标题\n\n```javascript\nconst x = "test";\n```\n\n$$E = mc^2$$'
      
      setContent(specialContent)
      
      const { content } = useDocumentStore.getState()
      expect(content).toBe(specialContent)
    })
  })

  describe('setFilePath', () => {
    it('应该更新文件路径', () => {
      const { setFilePath } = useDocumentStore.getState()
      const path = '/path/to/document.md'
      
      setFilePath(path)
      
      const { filePath } = useDocumentStore.getState()
      expect(filePath).toBe(path)
    })

    it('应该能设置为 null', () => {
      const { setFilePath } = useDocumentStore.getState()
      
      setFilePath('/some/path.md')
      setFilePath(null)
      
      const { filePath } = useDocumentStore.getState()
      expect(filePath).toBeNull()
    })

    it('应该不影响 isDirty 状态', () => {
      const { setFilePath, setDirty } = useDocumentStore.getState()
      setDirty(false)
      
      setFilePath('/path/to/file.md')
      
      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(false)
    })
  })

  describe('setDirty', () => {
    it('应该设置 isDirty 为 true', () => {
      const { setDirty } = useDocumentStore.getState()
      
      setDirty(true)
      
      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(true)
    })

    it('应该设置 isDirty 为 false', () => {
      const { setContent, setDirty } = useDocumentStore.getState()
      setContent('新内容') // 这会设置 isDirty 为 true
      
      setDirty(false)
      
      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(false)
    })

    it('应该不影响其他状态', () => {
      const { setContent, setFilePath, setDirty } = useDocumentStore.getState()
      setContent('测试内容')
      setFilePath('/test.md')
      
      setDirty(false)
      
      const state = useDocumentStore.getState()
      expect(state.content).toBe('测试内容')
      expect(state.filePath).toBe('/test.md')
    })
  })

  describe('reset', () => {
    it('应该清空内容', () => {
      const { setContent, reset } = useDocumentStore.getState()
      setContent('一些内容')

      reset()

      const { content } = useDocumentStore.getState()
      expect(content).toBe('')
    })

    it('应该清空文件路径', () => {
      const { setFilePath, reset } = useDocumentStore.getState()
      setFilePath('/some/path.md')

      reset()

      const { filePath } = useDocumentStore.getState()
      expect(filePath).toBeNull()
    })

    it('应该将 isDirty 设置为 false', () => {
      const { setContent, reset } = useDocumentStore.getState()
      setContent('内容') // 这会设置 isDirty 为 true

      reset()

      const { isDirty } = useDocumentStore.getState()
      expect(isDirty).toBe(false)
    })

    it('应该重置所有状态', () => {
      const { setContent, setFilePath, reset } = useDocumentStore.getState()
      setContent('测试内容')
      setFilePath('/test.md')

      reset()

      const state = useDocumentStore.getState()
      expect(state.content).toBe('')
      expect(state.filePath).toBeNull()
      expect(state.isDirty).toBe(false)
    })
  })

  describe('状态组合场景', () => {
    it('应该正确处理新建文档流程', () => {
      const { setContent, setFilePath, setDirty } = useDocumentStore.getState()

      // 模拟新建文档
      setContent('# 新文档\n\n开始编写...')
      setFilePath(null)
      setDirty(false)

      const state = useDocumentStore.getState()
      expect(state.content).toBe('# 新文档\n\n开始编写...')
      expect(state.filePath).toBeNull()
      expect(state.isDirty).toBe(false)
    })

    it('应该正确处理保存文档流程', () => {
      const { setContent, setFilePath, setDirty } = useDocumentStore.getState()

      // 模拟编辑
      setContent('# 文档内容')
      expect(useDocumentStore.getState().isDirty).toBe(true)

      // 模拟保存
      setFilePath('/saved/document.md')
      setDirty(false)

      const state = useDocumentStore.getState()
      expect(state.content).toBe('# 文档内容')
      expect(state.filePath).toBe('/saved/document.md')
      expect(state.isDirty).toBe(false)
    })

    it('应该正确处理打开文档流程', () => {
      const { setContent, setFilePath, setDirty } = useDocumentStore.getState()

      // 模拟打开文档
      const loadedContent = '# 已保存的文档\n\n这是之前保存的内容'
      setContent(loadedContent)
      setFilePath('/opened/document.md')
      setDirty(false)

      const state = useDocumentStore.getState()
      expect(state.content).toBe(loadedContent)
      expect(state.filePath).toBe('/opened/document.md')
      expect(state.isDirty).toBe(false)
    })

    it('应该正确处理编辑已保存文档的流程', () => {
      const { setContent, setFilePath, setDirty } = useDocumentStore.getState()

      // 打开文档
      setContent('原始内容')
      setFilePath('/document.md')
      setDirty(false)

      // 编辑文档
      setContent('修改后的内容')

      const state = useDocumentStore.getState()
      expect(state.content).toBe('修改后的内容')
      expect(state.filePath).toBe('/document.md')
      expect(state.isDirty).toBe(true)
    })
  })
})


