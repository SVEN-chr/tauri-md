import { test, expect } from '@playwright/test'

test.describe('撤销/重做功能测试', () => {
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

  test('应该能够撤销文本输入', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    
    // 输入文本
    await editor.click()
    await editor.type('测试文本')
    
    // 验证文本已输入
    await expect(editor).toContainText('测试文本')
    
    // 点击撤销按钮
    await page.click('button[title="撤销 (Ctrl+Z)"]')
    
    // 验证文本已撤销
    await expect(editor).not.toContainText('测试文本')
  })

  test('应该能够使用快捷键撤销', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    
    // 输入文本
    await editor.click()
    await editor.type('快捷键测试')
    
    // 使用 Ctrl+Z 撤销
    await page.keyboard.press('Control+Z')
    
    // 验证文本已撤销
    await expect(editor).not.toContainText('快捷键测试')
  })

  test('应该能够重做已撤销的操作', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    
    // 输入文本
    await editor.click()
    await editor.type('重做测试')
    
    // 撤销
    await page.click('button[title="撤销 (Ctrl+Z)"]')
    await expect(editor).not.toContainText('重做测试')
    
    // 重做
    await page.click('button[title="重做 (Ctrl+Y)"]')
    
    // 验证文本已恢复
    await expect(editor).toContainText('重做测试')
  })

  test('应该能够使用快捷键重做', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    
    // 输入文本
    await editor.click()
    await editor.type('快捷键重做')
    
    // 撤销
    await page.keyboard.press('Control+Z')
    
    // 使用 Ctrl+Y 重做
    await page.keyboard.press('Control+Y')
    
    // 验证文本已恢复
    await expect(editor).toContainText('快捷键重做')
  })

  test('应该能够撤销格式化操作', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 输入文本
    await editor.click()
    await editor.type('格式化文本')

    // 全选并加粗
    await page.keyboard.press('Control+A')
    await page.click('button[title="加粗 (Ctrl+B)"]')

    // 等待格式应用
    await page.waitForTimeout(300)

    // 验证加粗已应用
    await expect(editor.locator('strong').first()).toContainText('格式化文本')

    // 撤销加粗
    await page.click('button[title="撤销 (Ctrl+Z)"]')

    // 等待撤销完成
    await page.waitForTimeout(300)

    // 验证加粗已撤销 - 检查不包含加粗的文本
    const strongElements = await editor.locator('strong').count()
    expect(strongElements).toBe(0)
  })

  test('应该能够多次撤销', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 输入多段文本
    await editor.type('第一段')
    await page.keyboard.press('Enter')
    await editor.type('第二段')
    await page.keyboard.press('Enter')
    await editor.type('第三段')

    // 等待输入完成
    await page.waitForTimeout(300)

    // 验证所有文本都存在
    await expect(editor).toContainText('第一段')
    await expect(editor).toContainText('第二段')
    await expect(editor).toContainText('第三段')

    // 撤销三次 - 使用快捷键更可靠
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(200)
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(200)
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(200)

    // 验证所有文本都已撤销
    const content = await editor.textContent()
    expect(content).not.toContain('第三段')
    expect(content).not.toContain('第二段')
    expect(content).not.toContain('第一段')
  })

  test('应该能够多次重做', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 输入文本
    await editor.type('文本A')
    await page.keyboard.press('Enter')
    await editor.type('文本B')

    // 等待输入完成
    await page.waitForTimeout(300)

    // 撤销两次
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(200)
    await page.keyboard.press('Control+Z')
    await page.waitForTimeout(200)

    // 重做两次 - 使用快捷键
    await page.keyboard.press('Control+Y')
    await page.waitForTimeout(200)
    await page.keyboard.press('Control+Y')
    await page.waitForTimeout(200)

    // 验证文本已恢复
    await expect(editor).toContainText('文本A')
    await expect(editor).toContainText('文本B')
  })

  test('撤销按钮应该在没有可撤销操作时禁用', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    const undoButton = page.locator('button[title="撤销 (Ctrl+Z)"]')

    // 撤销所有操作（包括删除操作）
    while (await undoButton.isEnabled()) {
      await page.keyboard.press('Control+Z')
      await page.waitForTimeout(200)
    }

    // 验证撤销按钮禁用
    await expect(undoButton).toBeDisabled()
  })

  test('重做按钮应该在没有可重做操作时禁用', async ({ page }) => {
    // 清空后，重做按钮应该禁用
    const redoButton = page.locator('button[title="重做 (Ctrl+Y)"]')

    // 等待一下确保状态稳定
    await page.waitForTimeout(500)

    // 验证重做按钮禁用
    await expect(redoButton).toBeDisabled()
  })
})

