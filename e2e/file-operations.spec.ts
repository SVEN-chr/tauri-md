import { test, expect } from '@playwright/test'
import { selectAll } from './helpers/keyboard'

test.describe('文件操作测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问应用
    await page.goto('/')
    
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
  })

  test('应该能够创建新文档', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 先清空编辑器
    await editor.click()
    await selectAll(page)
    await page.keyboard.press('Delete')

    // 输入一些内容
    await editor.pressSequentially('旧内容')

    // 等待一下
    await page.waitForTimeout(300)

    // 点击新建按钮 - 会触发确认对话框
    page.once('dialog', dialog => dialog.accept())
    await page.click('button[title="新建文档"]')

    // 等待内容更新
    await page.waitForTimeout(500)

    // 验证内容已重置为新文档模板
    await expect(editor).toContainText('新文档')
  })

  test('应该在编辑后显示脏标识', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    const dirtyIndicator = page.locator('.dirty-indicator')

    // 先清空编辑器
    await editor.click()
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Delete')

    // 等待一下
    await page.waitForTimeout(300)

    // 保存当前状态（清除脏标识）
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)
    await page.click('button[title="保存文档"]')
    await downloadPromise

    // 等待脏标识消失
    await page.waitForTimeout(500)

    // 输入文本
    await editor.click()
    await editor.pressSequentially('新内容')

    // 等待状态更新
    await page.waitForTimeout(500)

    // 验证脏标识显示
    await expect(dirtyIndicator).toBeVisible()
    await expect(dirtyIndicator).toContainText('●')
  })

  test('应该能够保存文档', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 输入内容
    await editor.click()
    await editor.pressSequentially('要保存的内容')
    
    // 等待脏标识出现
    await page.waitForTimeout(500)
    const dirtyIndicator = page.locator('.dirty-indicator')
    await expect(dirtyIndicator).toBeVisible()
    
    // 监听下载事件
    const downloadPromise = page.waitForEvent('download')
    
    // 点击保存按钮
    await page.click('button[title="保存文档"]')
    
    // 等待下载
    const download = await downloadPromise
    
    // 验证文件名
    expect(download.suggestedFilename()).toMatch(/\.md$/)
    
    // 验证脏标识已清除
    await expect(dirtyIndicator).not.toBeVisible()
  })

  test('应该能够导出 HTML', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 输入内容
    await editor.click()
    await editor.pressSequentially('# 标题')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('这是内容')

    // 监听下载事件
    const downloadPromise = page.waitForEvent('download')

    // 点击导出 HTML 按钮
    await page.click('button[title="导出为 HTML"]')

    // 等待下载
    const download = await downloadPromise

    // 验证文件名是 .html
    expect(download.suggestedFilename()).toMatch(/\.html$/)
  })

  test('应该在有未保存更改时显示确认对话框', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 输入内容使文档变脏
    await editor.click()
    await editor.pressSequentially('未保存的内容')
    
    // 等待脏标识出现
    await page.waitForTimeout(500)
    
    // 监听确认对话框
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm')
      expect(dialog.message()).toContain('未保存')
      await dialog.accept()
    })
    
    // 点击新建按钮（应该触发确认对话框）
    await page.click('button[title="新建文档"]')
    
    // 验证新文档已创建
    await expect(editor).toContainText('新文档')
  })

  test('应该能够取消新建操作', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 输入内容
    await editor.click()
    await editor.pressSequentially('重要内容')

    // 等待脏标识出现
    await page.waitForTimeout(500)

    // 监听确认对话框并取消
    page.on('dialog', async dialog => {
      await dialog.dismiss()
    })

    // 点击新建按钮
    await page.click('button[title="新建文档"]')

    // 验证内容未改变
    await expect(editor).toContainText('重要内容')
  })

  test('完整的编辑和保存流程', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 1. 清空编辑器
    await editor.click()
    await selectAll(page)
    await page.keyboard.press('Delete')
    await page.waitForTimeout(300)

    // 2. 编辑内容
    await editor.pressSequentially('# 我的文档')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('这是第一段内容')

    // 3. 验证脏标识
    await page.waitForTimeout(500)
    await expect(page.locator('.dirty-indicator')).toBeVisible()

    // 4. 保存文档
    const downloadPromise = page.waitForEvent('download')
    await page.click('button[title="保存文档"]')
    await downloadPromise

    // 5. 验证脏标识已清除
    await page.waitForTimeout(500)
    await expect(page.locator('.dirty-indicator')).not.toBeVisible()
  })
})

