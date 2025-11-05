# Markdown 编辑器 - 使用指南

## 🎉 项目概述

这是一个类似 Typora 的现代化 Markdown 编辑器，基于以下技术栈构建：

- **前端框架**: React 19 + TypeScript
- **编辑器引擎**: TipTap 3.x (基于 ProseMirror)
- **Markdown 支持**: @tiptap/markdown
- **代码高亮**: Lowlight (基于 highlight.js)
- **数学公式**: KaTeX
- **桌面框架**: Tauri 2.x
- **构建工具**: Vite 7.x
- **状态管理**: Zustand

## 🚀 快速开始

### 1. 启动开发服务器

```bash
cd tauri-md
npm run dev
```

访问 http://localhost:1420/ 查看 Web 版本

### 2. 启动 Tauri 桌面应用

```bash
cd tauri-md
npm run tauri dev
```

### 3. 构建生产版本

```bash
# 构建 Web 版本
npm run build

# 构建 Tauri 桌面应用
npm run tauri build
```

## ✨ 功能特性

### 已实现功能

✅ **基础 Markdown 语法**
- 标题 (H1-H6)
- 加粗、斜体、删除线
- 行内代码和代码块
- 引用块
- 有序列表和无序列表
- 任务列表
- 水平分隔线
- 链接

✅ **扩展功能**
- 表格支持（可调整大小）
- 代码语法高亮（支持 30+ 编程语言）
- 数学公式渲染（LaTeX 语法）
- 智能排版（Typography）

✅ **编辑器功能**
- 所见即所得编辑
- 实时 Markdown 渲染
- 撤销/重做
- 工具栏快捷操作
- Placeholder 提示

✅ **文件操作**
- 新建文档
- 打开 Markdown 文件
- 保存为 .md 文件
- 导出为 HTML

## 🎨 界面组件

### 1. 菜单栏 (MenuBar)
- 位置：顶部
- 功能：文件操作（新建、打开、保存、导出）
- 显示：当前文件名、未保存状态指示器

### 2. 工具栏 (EditorToolbar)
- 位置：编辑器上方
- 功能：快速格式化按钮
- 分组：
  - 文本格式：加粗、斜体、删除线、行内代码
  - 标题：H1、H2、H3
  - 列表：无序列表、有序列表、任务列表
  - 块级元素：引用、代码块、分隔线
  - 表格：插入表格
  - 历史：撤销、重做

### 3. 编辑器 (MarkdownEditor)
- 位置：主内容区
- 功能：Markdown 编辑和实时渲染
- 特性：
  - 自动保存到状态管理
  - 滚动条美化
  - 代码高亮
  - 数学公式渲染

## 📝 支持的代码语言

编辑器支持以下编程语言的语法高亮：

- **Web**: JavaScript, TypeScript, HTML, CSS, SCSS, Less
- **后端**: Python, Java, C, C++, C#, Go, Rust, PHP, Ruby
- **移动**: Swift, Kotlin, Scala
- **脚本**: Bash, Shell
- **数据**: JSON, XML, YAML, SQL
- **其他**: Markdown, Dockerfile, Nginx, Plaintext

使用方法：在代码块中指定语言
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 🧮 数学公式

### 行内公式
使用单个 `$` 包裹：`$E = mc^2$`

### 块级公式
使用双 `$$` 包裹：
```
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 🎯 快捷键

- **Ctrl + B**: 加粗
- **Ctrl + I**: 斜体
- **Ctrl + Z**: 撤销
- **Ctrl + Y**: 重做

## 📁 项目结构

```
tauri-md/
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── MarkdownEditor.tsx      # 核心编辑器组件
│   │   │   └── MarkdownEditor.css      # 编辑器样式
│   │   ├── Toolbar/
│   │   │   ├── EditorToolbar.tsx       # 工具栏组件
│   │   │   └── EditorToolbar.css       # 工具栏样式
│   │   ├── MenuBar/
│   │   │   ├── MenuBar.tsx             # 菜单栏组件
│   │   │   └── MenuBar.css             # 菜单栏样式
│   │   ├── MarkdownEditorWithToolbar.tsx  # 集成组件
│   │   └── MarkdownEditorWithToolbar.css
│   ├── store/
│   │   └── documentStore.ts            # Zustand 状态管理
│   ├── utils/
│   │   └── highlightLanguages.ts       # 代码高亮语言注册
│   ├── App.tsx                         # 主应用组件
│   ├── App.css                         # 全局样式
│   └── main.tsx                        # 入口文件
├── src-tauri/                          # Tauri 后端代码
├── package.json
└── vite.config.ts
```

## 🔧 自定义配置

### 修改默认内容
编辑 `src/store/documentStore.ts` 中的 `content` 初始值

### 添加更多代码语言
在 `src/utils/highlightLanguages.ts` 中导入并注册新语言

### 自定义样式
修改各组件对应的 CSS 文件

## 🐛 已知问题

- 导出 HTML 功能目前使用简单的预格式化文本，未来将集成完整的 Markdown 到 HTML 转换
- 浏览器版本的文件操作使用 File API，功能有限

## 🚧 未来计划

- [ ] 集成 Tauri 的文件系统 API 实现真正的文件读写
- [ ] 添加主题切换（亮色/暗色模式）
- [ ] 实现分屏预览模式
- [ ] 添加图片上传和管理
- [ ] 支持自定义快捷键
- [ ] 添加导出为 PDF 功能
- [ ] 实现文档大纲导航
- [ ] 添加搜索和替换功能

## 📄 许可证

MIT License

