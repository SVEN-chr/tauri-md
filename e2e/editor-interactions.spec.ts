import { test, expect } from '@playwright/test'

test.describe('编辑器交互测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问应用
    await page.goto('/')

    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })

    // 清空编辑器内容 - 全选并删除
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')

    // 等待内容清空
    await page.waitForTimeout(300)
  })

  test('应该能够输入文本并验证内容更新', async ({ page }) => {
    // 点击编辑器
    const editor = page.locator('.ProseMirror')
    await editor.click()
    
    // 输入文本
    await editor.type('这是测试文本')
    
    // 验证文本已输入
    await expect(editor).toContainText('这是测试文本')
  })

  test('应该能够应用加粗格式', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 输入文本
    await editor.type('粗体文本')

    // 全选文本
    await page.keyboard.press('Control+A')

    // 点击加粗按钮
    await page.click('button[title="加粗 (Ctrl+B)"]')

    // 验证加粗标记已应用 - 使用 first() 获取第一个匹配的元素
    await expect(editor.locator('strong').first()).toContainText('粗体文本')
  })

  test('应该能够应用斜体格式', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 输入文本
    await editor.type('斜体文本')

    // 全选文本
    await page.keyboard.press('Control+A')

    // 点击斜体按钮
    await page.click('button[title="斜体 (Ctrl+I)"]')

    // 验证斜体标记已应用
    await expect(editor.locator('em').first()).toContainText('斜体文本')
  })

  test('应该能够插入一级标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击 H1 按钮
    await page.click('button[title="一级标题"]')

    // 输入标题文本
    await editor.type('我的标题')

    // 验证 H1 标签已创建
    await expect(editor.locator('h1').first()).toContainText('我的标题')
  })

  test('应该能够插入二级标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击 H2 按钮
    await page.click('button[title="二级标题"]')

    // 输入标题文本
    await editor.type('二级标题')

    // 验证 H2 标签已创建
    await expect(editor.locator('h2').first()).toContainText('二级标题')
  })

  test('应该能够插入三级标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    
    // 点击 H3 按钮
    await page.click('button[title="三级标题"]')
    
    // 输入标题文本
    await editor.type('三级标题')
    
    // 验证 H3 标签已创建
    await expect(editor.locator('h3')).toContainText('三级标题')
  })

  test('应该能够插入无序列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击无序列表按钮
    await page.click('button[title="无序列表"]')

    // 输入列表项
    await editor.type('列表项 1')

    // 验证无序列表已创建 - 查找包含特定文本的列表项
    await expect(editor.locator('ul li').filter({ hasText: '列表项 1' })).toBeVisible()
  })

  test('应该能够插入有序列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击有序列表按钮
    await page.click('button[title="有序列表"]')

    // 输入列表项
    await editor.type('第一项')

    // 验证有序列表已创建
    await expect(editor.locator('ol li').filter({ hasText: '第一项' })).toBeVisible()
  })

  test('应该能够插入任务列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击任务列表按钮
    await page.click('button[title="任务列表"]')

    // 输入任务项
    await editor.type('任务项')

    // 验证任务列表已创建（包含复选框） - 查找包含特定文本的任务列表
    await expect(editor.locator('ul[data-type="taskList"]').filter({ hasText: '任务项' })).toBeVisible()
  })

  test('应该能够插入代码块', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击代码块按钮
    await page.click('button[title="代码块"]')

    // 输入代码
    await editor.type('const x = 1;')

    // 验证代码块已创建 - 查找包含特定文本的代码块
    await expect(editor.locator('pre code').filter({ hasText: 'const x = 1;' })).toBeVisible()
  })

  test('应该能够插入引用块', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击引用按钮
    await page.click('button[title="引用"]')

    // 等待引用块创建
    await page.waitForTimeout(300)

    // 输入引用文本
    await editor.type('这是引用内容')

    // 验证引用块已创建
    await expect(editor.locator('blockquote')).toContainText('这是引用内容')
  })

  test('应该能够插入分隔线', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击分隔线按钮
    await page.click('button[title="分隔线"]')

    // 验证分隔线已插入
    await expect(editor.locator('hr')).toBeVisible()
  })

  test('应该能够插入表格', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 点击插入表格按钮
    await page.click('button[title="插入表格"]')

    // 等待表格插入
    await page.waitForTimeout(300)

    // 验证表格已插入 - 使用 first() 获取第一个表格
    await expect(editor.locator('table').first()).toBeVisible()

    // 验证表格有正确的行和列
    const rows = editor.locator('table').first().locator('tr')
    await expect(rows).toHaveCount(3) // 默认 3 行
  })
})
