# Markdown Editor - Tauri

A beautiful, minimal Markdown editor built with Tauri, React, and TypeScript. Inspired by Typora's clean design and WYSIWYG editing experience.

![Markdown Editor](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## Features

### Core Editing
- **Live Preview Mode**: WYSIWYG-style editing where Markdown is rendered as you type
- **Source Code Mode**: Full-featured code editor with syntax highlighting powered by CodeMirror
- **Real-time Rendering**: Instant markdown rendering using markdown-it
- **Syntax Highlighting**: Code blocks with syntax highlighting via highlight.js

### Markdown Support
- Headings (H1-H6)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- **Task Lists** with checkboxes (GitHub Flavored Markdown)
- Links and images
- Code blocks with language-specific syntax highlighting
- Tables
- Blockquotes
- Horizontal rules
- And more!

### File Operations
- **New**: Create a new markdown file (Ctrl+N)
- **Open**: Open existing .md, .markdown, or .txt files (Ctrl+O)
- **Save**: Save current file (Ctrl+S)
- **Save As**: Save file with a new name
- Auto-detection of unsaved changes

### User Interface
- Clean, minimal design similar to Typora
- Toggle between Live Preview and Source Code modes (Ctrl+E)
- Dark mode support (follows system preferences)
- Responsive toolbar with file status indicator
- Smooth scrolling and comfortable reading experience

## Tech Stack

- **Desktop Framework**: [Tauri 2.0](https://tauri.app/) - Lightweight, secure desktop applications
- **Frontend**: [React 19.1](https://react.dev/) with TypeScript
- **Build Tool**: [Vite 7.0](https://vitejs.dev/)
- **Markdown Rendering**: [markdown-it](https://github.com/markdown-it/markdown-it)
- **Code Editor**: [CodeMirror](https://codemirror.net/) via @uiw/react-codemirror
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/) (latest stable)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tauri-md
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run tauri dev
```

4. Build for production:
```bash
npm run tauri build
```

## Keyboard Shortcuts

- `Ctrl+N` - New file
- `Ctrl+O` - Open file
- `Ctrl+S` - Save file
- `Ctrl+E` - Toggle between Preview and Source modes

## Project Structure

```
tauri-md/
├── src/                          # React frontend
│   ├── components/
│   │   ├── MarkdownEditor.tsx    # Main editor component
│   │   ├── MarkdownPreview.tsx   # Live preview renderer
│   │   ├── SourceEditor.tsx      # Source code editor
│   │   ├── Toolbar.tsx           # Toolbar with file operations
│   │   └── *.css                 # Component styles
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── src-tauri/                    # Tauri backend
│   ├── src/
│   │   ├── lib.rs                # Rust commands for file I/O
│   │   └── main.rs               # Application entry
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
└── package.json                  # Node dependencies
```

## Development

### Adding New Features
The application is structured with clear separation of concerns:
- **MarkdownEditor.tsx**: Manages state and file operations
- **MarkdownPreview.tsx**: Handles live preview rendering and WYSIWYG editing
- **SourceEditor.tsx**: Provides source code editing with CodeMirror
- **Toolbar.tsx**: UI controls and file operations
- **lib.rs**: Rust backend for file system operations

### Customization
- Modify `src/components/*.css` for styling changes
- Update `markdown-it` configuration in `MarkdownPreview.tsx` for rendering options
- Adjust CodeMirror settings in `SourceEditor.tsx` for editor behavior

### TypeScript Type Definitions
The project includes custom type declarations for packages without official TypeScript support:
- **src/markdown-it-task-lists.d.ts**: Type definitions for the markdown-it-task-lists plugin

## Bug Fixes & Documentation

- **BUGFIX-WHITE-SCREEN.md**: Fix for white screen crash when switching modes
- **BUGFIX-TYPESCRIPT-BUILD.md**: Fix for TypeScript compilation errors in production builds
- **FIXES.md**: Documentation of task list and scrolling fixes

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
