import { MarkdownEditorWithToolbar } from './components/MarkdownEditorWithToolbar'
import { MenuBar } from './components/MenuBar/MenuBar'
import { useDocumentStore } from './store/documentStore'
import "./App.css"

function App() {
  const { content, setContent } = useDocumentStore()

  const handleContentChange = (markdown: string) => {
    setContent(markdown)
  }

  return (
    <div className="app">
      <MenuBar />
      <MarkdownEditorWithToolbar
        content={content}
        onChange={handleContentChange}
        placeholder="开始输入 Markdown..."
      />
    </div>
  )
}

export default App
