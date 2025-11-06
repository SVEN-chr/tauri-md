# 更新日志

本文档记录了 Tauri Markdown 编辑器的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- GitHub Actions 自动发布工作流
- 版本号同步脚本 (`npm run bump-version`)
- CI 工作流用于日常开发测试

### 变更
- 无

### 修复
- 无

### 移除
- 无

## [0.1.0] - 2024-01-XX

### 新增
- ✨ 基于 TipTap 的 Markdown 编辑器
- 📝 支持标准 Markdown 语法
- 🎨 工具栏快捷操作
- 💾 文件保存和打开功能
- 📤 导出 HTML 功能
- ↩️ 撤销/重做功能
- ⌨️ 键盘快捷键支持
- 📋 任务列表支持
- 📊 表格支持
- 💻 代码块语法高亮
- 🧮 数学公式支持 (KaTeX)
- 🧪 完整的单元测试和 E2E 测试

### 技术栈
- Tauri 2.x
- React 19
- TypeScript
- TipTap 3.x
- Vite
- Vitest + Playwright

---

## 版本说明

### 版本号格式

版本号格式为 `MAJOR.MINOR.PATCH`:

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

### 变更类型

- **新增**: 新功能
- **变更**: 现有功能的变更
- **弃用**: 即将移除的功能
- **移除**: 已移除的功能
- **修复**: Bug 修复
- **安全**: 安全性修复

---

## 如何更新此文档

在每次发布前:

1. 将 `[未发布]` 部分的内容移到新版本下
2. 添加版本号和发布日期
3. 创建新的 `[未发布]` 部分
4. 更新底部的版本链接

示例:

```markdown
## [未发布]

### 新增
- 新功能描述

## [1.0.0] - 2024-01-15

### 新增
- 之前在未发布中的功能

[未发布]: https://github.com/username/tauri-md/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/username/tauri-md/releases/tag/v1.0.0
```

