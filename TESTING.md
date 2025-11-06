# 测试文档

本文档说明如何运行和维护 Tauri Markdown 编辑器项目的测试。

## 📋 目录

- [测试框架](#测试框架)
- [运行测试](#运行测试)
- [测试结构](#测试结构)
- [测试覆盖率](#测试覆盖率)
- [E2E 测试](#e2e-测试)
- [CI/CD 集成](#cicd-集成)
- [编写新测试](#编写新测试)
- [故障排除](#故障排除)

## 🛠️ 测试框架

本项目使用以下测试工具：

### 前端单元测试
- **Vitest** - 快速的单元测试框架
- **React Testing Library** - React 组件测试
- **@testing-library/user-event** - 用户交互模拟
- **@testing-library/jest-dom** - DOM 断言扩展
- **jsdom** - DOM 环境模拟

### E2E 测试
- **Playwright** - 端到端测试框架
- 支持多浏览器测试（Chromium, Firefox, WebKit）
- 自动截图和视频录制

### 后端测试
- **Rust 内置测试框架** - Cargo test

## 🚀 运行测试

### 前端单元测试

```bash
# 运行所有测试（监视模式）
npm test

# 运行所有测试（单次运行）
npm run test:run

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试并打开 UI 界面
npm run test:ui
```

### E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 运行 E2E 测试（UI 模式）
npm run test:e2e:ui

# 运行 E2E 测试（有头模式，可见浏览器）
npm run test:e2e:headed

# 调试 E2E 测试
npm run test:e2e:debug

# 运行特定测试文件
npx playwright test editor-interactions.spec.ts
```

### 后端测试

```bash
# 进入 Rust 项目目录
cd src-tauri

# 运行所有 Rust 测试
cargo test

# 运行测试并显示输出
cargo test -- --nocapture

# 运行特定测试
cargo test test_greet_with_name
```

### 运行所有测试

```bash
# 运行单元测试 + E2E 测试
npm run test:all
```

## 📁 测试结构

```
tauri-md/
├── src/
│   ├── store/
│   │   ├── documentStore.ts
│   │   └── documentStore.test.ts          # 状态管理测试
│   ├── utils/
│   │   ├── highlightLanguages.ts
│   │   └── highlightLanguages.test.ts     # 工具函数测试
│   ├── components/
│   │   ├── Toolbar/
│   │   │   ├── EditorToolbar.tsx
│   │   │   └── EditorToolbar.test.tsx     # 工具栏组件测试
│   │   ├── MenuBar/
│   │   │   ├── MenuBar.tsx
│   │   │   └── MenuBar.test.tsx           # 菜单栏组件测试
│   │   ├── MarkdownEditorWithToolbar.tsx
│   │   └── MarkdownEditorWithToolbar.test.tsx  # 编辑器组件测试
│   └── test/
│       ├── setup.ts                        # 测试环境配置
│       └── integration/
│           └── editor-workflow.test.tsx    # 集成测试
│
├── src-tauri/
│   └── src/
│       └── lib.rs                          # 包含 Rust 测试
│
├── vitest.config.ts                        # Vitest 配置
└── TESTING.md                              # 本文档
```

## 📊 测试覆盖率

### 当前覆盖率目标

| 模块类型 | 目标覆盖率 | 当前状态 |
|---------|-----------|---------|
| 状态管理 | 90%+ | ✅ 100% |
| 工具函数 | 80%+ | ✅ 100% |
| UI 组件 | 70%+ | 🟡 部分 |
| 集成测试 | 关键流程 | 🟡 部分 |

### 查看覆盖率报告

运行测试后，覆盖率报告会生成在 `coverage/` 目录：

```bash
# 生成覆盖率报告
npm run test:coverage

# 在浏览器中查看 HTML 报告
# 打开 coverage/index.html
```

## 🎭 E2E 测试

### 测试场景

E2E 测试覆盖以下关键用户流程：

**编辑器交互：**
- 文本输入和内容更新
- 文本格式化（加粗、斜体）
- 插入标题（H1/H2/H3）
- 插入列表（无序、有序、任务列表）
- 插入代码块和引用块
- 插入分隔线和表格

**文件操作：**
- 新建文档
- 保存文档
- 导出 HTML
- 脏状态标识

**撤销/重做：**
- 撤销文本输入
- 重做已撤销的操作
- 撤销格式化操作
- 多次撤销/重做

### 编写 E2E 测试

E2E 测试文件位于 `e2e/` 目录：

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror')
  })

  test('应该能够输入文本', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await editor.type('测试文本')
    await expect(editor).toContainText('测试文本')
  })
})
```

### 调试 E2E 测试

```bash
# 使用 UI 模式调试
npm run test:e2e:ui

# 使用调试模式（逐步执行）
npm run test:e2e:debug

# 查看测试报告
npx playwright show-report
```

## 🔄 CI/CD 集成

### GitHub Actions

项目使用 GitHub Actions 进行持续集成，配置文件位于 `.github/workflows/test.yml`。

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request

**测试流程：**
1. **单元测试** - 在 Ubuntu、Windows、macOS 上运行
2. **E2E 测试** - 在多平台上运行 Playwright 测试
3. **Rust 测试** - 运行后端测试
4. **构建检查** - 验证项目可以成功构建

**覆盖率报告：**
- 自动上传到 Codecov
- 在 PR 中显示覆盖率变化

### 本地运行 CI 测试

```bash
# 运行所有测试（模拟 CI 环境）
npm run test:all

# 检查构建
npm run build
```

## ✍️ 编写新测试

### 单元测试示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useDocumentStore } from './documentStore'

describe('documentStore', () => {
  beforeEach(() => {
    // 每个测试前重置状态
    const { reset } = useDocumentStore.getState()
    reset()
  })

  it('应该更新内容', () => {
    const { setContent } = useDocumentStore.getState()
    
    setContent('新内容')
    
    const { content } = useDocumentStore.getState()
    expect(content).toBe('新内容')
  })
})
```

### 组件测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('应该响应用户点击', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    const button = screen.getByRole('button', { name: '点击我' })
    await user.click(button)
    
    expect(screen.getByText('已点击')).toBeInTheDocument()
  })
})
```

## 🔧 故障排除

### 常见问题

#### 1. 测试超时

如果测试超时，可以增加等待时间：

```typescript
await waitFor(() => {
  expect(something).toBe(true)
}, { timeout: 5000 }) // 增加到 5 秒
```

#### 2. DOM 相关错误

某些 TipTap/ProseMirror 测试可能会因为 jsdom 的限制而失败。这些是已知问题，不影响实际功能。

#### 3. Mock 问题

确保在 `beforeEach` 中正确设置 mock：

```typescript
beforeEach(() => {
  vi.clearAllMocks()
  window.confirm = vi.fn(() => true)
})
```

### 调试测试

```bash
# 运行特定测试文件
npm test -- documentStore.test.ts

# 只运行匹配的测试
npm test -- -t "应该更新内容"

# 显示详细输出
npm test -- --reporter=verbose
```

## 📈 测试最佳实践

1. **测试命名** - 使用描述性的测试名称，说明测试的内容和预期结果
2. **独立性** - 每个测试应该独立运行，不依赖其他测试
3. **清理** - 在 `beforeEach` 或 `afterEach` 中清理状态
4. **覆盖边界情况** - 测试正常情况、边界情况和错误情况
5. **避免实现细节** - 测试行为而非实现

## 🎯 下一步

- [ ] 提高 UI 组件测试覆盖率到 70%+
- [ ] 完善集成测试，覆盖所有关键用户流程
- [ ] 添加 E2E 测试（使用 Playwright 或 Tauri WebDriver）
- [ ] 设置 CI/CD 自动运行测试
- [ ] 添加性能测试

## 📚 参考资源

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library 文档](https://testing-library.com/react)
- [Rust 测试文档](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Testing Library 最佳实践](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

