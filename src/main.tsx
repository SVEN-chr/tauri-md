import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { registerLanguages } from "./utils/highlightLanguages"

// 注册代码高亮语言
registerLanguages()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
