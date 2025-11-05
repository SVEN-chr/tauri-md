import { useDocumentStore } from '../../store/documentStore'
import './MenuBar.css'

export const MenuBar = () => {
  const { content, filePath, isDirty, setContent, setFilePath, setDirty, reset } = useDocumentStore()

  const handleNew = () => {
    if (isDirty) {
      const confirmed = window.confirm('当前文档未保存，是否继续？')
      if (!confirmed) return
    }
    reset()
    setContent('# 新文档\n\n开始编写...')
  }

  const handleOpen = async () => {
    try {
      // 创建文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.markdown,.txt'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const text = await file.text()
          setContent(text)
          setFilePath(file.name)
          setDirty(false)
        }
      }
      
      input.click()
    } catch (error) {
      console.error('打开文件失败:', error)
      alert('打开文件失败')
    }
  }

  const handleSave = () => {
    try {
      // 创建 Blob 对象
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      
      // 创建下载链接
      const a = document.createElement('a')
      a.href = url
      a.download = filePath || 'document.md'
      a.click()
      
      // 清理
      URL.revokeObjectURL(url)
      setDirty(false)
    } catch (error) {
      console.error('保存文件失败:', error)
      alert('保存文件失败')
    }
  }

  const handleExportHTML = () => {
    try {
      // 简单的 Markdown 到 HTML 转换（实际应用中应使用专门的库）
      const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filePath || '文档'}</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <pre>${content}</pre>
</body>
</html>`
      
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = (filePath || 'document').replace(/\.md$/, '') + '.html'
      a.click()
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出 HTML 失败:', error)
      alert('导出 HTML 失败')
    }
  }

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <h1 className="app-title">Markdown 编辑器</h1>
        {filePath && <span className="file-name">{filePath}</span>}
        {isDirty && <span className="dirty-indicator">●</span>}
      </div>
      
      <div className="menu-bar-right">
        <button onClick={handleNew} className="menu-button" title="新建文档">
          新建
        </button>
        <button onClick={handleOpen} className="menu-button" title="打开文档">
          打开
        </button>
        <button onClick={handleSave} className="menu-button" title="保存文档">
          保存
        </button>
        <button onClick={handleExportHTML} className="menu-button" title="导出为 HTML">
          导出 HTML
        </button>
      </div>
    </div>
  )
}

