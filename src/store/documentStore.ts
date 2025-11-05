import { create } from 'zustand'

interface DocumentState {
  content: string
  filePath: string | null
  isDirty: boolean
  setContent: (content: string) => void
  setFilePath: (path: string | null) => void
  setDirty: (dirty: boolean) => void
  reset: () => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  content: '# 欢迎使用 Markdown 编辑器\n\n开始编写你的文档...\n\n## 功能特性\n\n- **加粗文本**\n- *斜体文本*\n- ~~删除线~~\n- `行内代码`\n\n## 代码块示例\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```\n\n## 任务列表\n\n- [x] 完成的任务\n- [ ] 待办任务\n\n## 表格\n\n| 功能 | 状态 |\n|------|------|\n| Markdown | ✅ |\n| 代码高亮 | ✅ |\n| 数学公式 | ✅ |\n\n## 数学公式\n\n行内公式：$E = mc^2$\n\n块级公式：\n\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n',
  filePath: null,
  isDirty: false,
  setContent: (content) => set({ content, isDirty: true }),
  setFilePath: (path) => set({ filePath: path }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  reset: () => set({ 
    content: '', 
    filePath: null, 
    isDirty: false 
  }),
}))

