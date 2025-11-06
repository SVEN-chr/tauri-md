# E2E 测试指南

## 📋 概述

本项目使用 Playwright 进行端到端（E2E）测试，覆盖关键用户流程和交互场景。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装项目依赖
npm install

# 安装 Playwright 浏览器
npx playwright install chromium
```

### 2. 运行 E2E 测试

E2E 测试需要开发服务器运行。Playwright 配置会自动启动服务器。

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 运行 E2E 测试（UI 模式，推荐用于调试）
npm run test:e2e:ui

# 运行 E2E 测试（有头模式，可见浏览器）
npm run test:e2e:headed

# 调试特定测试
npm run test:e2e:debug
```

### 3. 手动启动服务器（可选）

如果你想手动控制服务器：

```bash
# 终端 1：启动开发服务器
npm run dev

# 终端 2：运行 E2E 测试（需要修改 playwright.config.ts 中的 webServer 配置）
npm run test:e2e
```

## 📁 测试文件结构

```
e2e/
├── editor-interactions.spec.ts  # 编辑器交互测试
├── file-operations.spec.ts      # 文件操作测试
└── undo-redo.spec.ts            # 撤销/重做测试
```

## 🧪 测试覆盖场景

### 编辑器交互测试 (editor-interactions.spec.ts)

- ✅ 文本输入和内容更新
- ✅ 应用加粗格式
- ✅ 应用斜体格式
- ✅ 插入一级标题 (H1)
- ✅ 插入二级标题 (H2)
- ✅ 插入三级标题 (H3)
- ✅ 插入无序列表
- ✅ 插入有序列表
- ✅ 插入任务列表
- ✅ 插入代码块
- ✅ 插入引用块
- ✅ 插入分隔线
- ✅ 插入表格

### 文件操作测试 (file-operations.spec.ts)

- ✅ 创建新文档
- ✅ 编辑后显示脏标识
- ✅ 保存文档
- ✅ 导出 HTML
- ✅ 未保存更改时显示确认对话框
- ✅ 取消新建操作
- ✅ 完整的编辑和保存流程

### 撤销/重做测试 (undo-redo.spec.ts)

- ✅ 撤销文本输入
- ✅ 使用快捷键撤销 (Ctrl+Z)
- ✅ 重做已撤销的操作
- ✅ 使用快捷键重做 (Ctrl+Y)
- ✅ 撤销格式化操作
- ✅ 多次撤销
- ✅ 多次重做
- ✅ 撤销按钮禁用状态
- ✅ 重做按钮禁用状态

## 🔧 配置说明

### playwright.config.ts

主要配置项：

```typescript
{
  testDir: './e2e',              // 测试目录
  timeout: 30000,                // 测试超时时间
  retries: process.env.CI ? 2 : 0,  // CI 环境重试次数
  use: {
    baseURL: 'http://localhost:1420',  // 应用 URL
    screenshot: 'only-on-failure',     // 失败时截图
    video: 'retain-on-failure',        // 失败时录制视频
  },
  webServer: {
    command: 'npm run dev',      // 启动开发服务器
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
  }
}
```

## 📊 查看测试报告

```bash
# 运行测试后查看 HTML 报告
npx playwright show-report

# 报告位置
playwright-report/index.html
```

## 🐛 调试技巧

### 1. 使用 UI 模式

```bash
npm run test:e2e:ui
```

UI 模式提供：
- 可视化测试执行
- 时间旅行调试
- DOM 快照
- 网络请求查看

### 2. 使用调试模式

```bash
npm run test:e2e:debug
```

调试模式会：
- 打开浏览器开发者工具
- 逐步执行测试
- 允许设置断点

### 3. 查看截图和视频

测试失败时，Playwright 会自动保存：
- 截图：`test-results/*/test-failed-*.png`
- 视频：`test-results/*/video.webm`

### 4. 运行特定测试

```bash
# 运行特定文件
npx playwright test editor-interactions.spec.ts

# 运行特定测试用例
npx playwright test -g "应该能够输入文本"

# 运行特定浏览器
npx playwright test --project=chromium
```

## 🚨 常见问题

### 问题 1：端口已被占用

**错误：** `Error: Port 1420 is already in use`

**解决方案：**
```bash
# 停止占用端口的进程
# Windows
netstat -ano | findstr :1420
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:1420 | xargs kill -9
```

### 问题 2：浏览器未安装

**错误：** `Executable doesn't exist at ...`

**解决方案：**
```bash
npx playwright install chromium
```

### 问题 3：测试超时

**错误：** `Test timeout of 30000ms exceeded`

**解决方案：**
- 增加超时时间：在测试中使用 `test.setTimeout(60000)`
- 检查选择器是否正确
- 确保开发服务器正常运行

## 📝 编写新测试

### 基本模板

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能名称', () => {
  test.beforeEach(async ({ page }) => {
    // 访问应用
    await page.goto('/')
    
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror')
  })

  test('测试用例描述', async ({ page }) => {
    // 1. 定位元素
    const editor = page.locator('.ProseMirror')
    
    // 2. 执行操作
    await editor.click()
    await editor.type('测试内容')
    
    // 3. 验证结果
    await expect(editor).toContainText('测试内容')
  })
})
```

### 最佳实践

1. **使用描述性的测试名称**
   ```typescript
   test('应该能够在点击加粗按钮后应用加粗格式', async ({ page }) => {
     // ...
   })
   ```

2. **使用 Page Object 模式**（对于复杂测试）
   ```typescript
   class EditorPage {
     constructor(private page: Page) {}
     
     async typeText(text: string) {
       await this.page.locator('.ProseMirror').type(text)
     }
   }
   ```

3. **等待元素可见**
   ```typescript
   await page.waitForSelector('.element', { state: 'visible' })
   ```

4. **使用有意义的断言**
   ```typescript
   await expect(element).toBeVisible()
   await expect(element).toContainText('预期文本')
   await expect(element).toHaveClass('active')
   ```

## 🔗 相关资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright 最佳实践](https://playwright.dev/docs/best-practices)
- [Playwright API 参考](https://playwright.dev/docs/api/class-playwright)

