import { Page } from '@playwright/test'

/**
 * 跨平台键盘辅助函数
 * 处理 macOS 和 Windows/Linux 之间的快捷键差异
 */

/**
 * 检测当前操作系统
 */
export function isMac(): boolean {
  return process.platform === 'darwin'
}

/**
 * 获取修饰键 (macOS 用 Meta/Command, 其他用 Control)
 */
export function getModifierKey(): string {
  return isMac() ? 'Meta' : 'Control'
}

/**
 * 全选文本
 */
export async function selectAll(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+A`)
}

/**
 * 撤销操作
 */
export async function undo(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+Z`)
}

/**
 * 重做操作
 */
export async function redo(page: Page): Promise<void> {
  const modifier = getModifierKey()
  if (isMac()) {
    // macOS 使用 Command+Shift+Z
    await page.keyboard.press(`${modifier}+Shift+Z`)
  } else {
    // Windows/Linux 使用 Control+Y
    await page.keyboard.press(`${modifier}+Y`)
  }
}

/**
 * 加粗
 */
export async function bold(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+B`)
}

/**
 * 斜体
 */
export async function italic(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+I`)
}

/**
 * 保存
 */
export async function save(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+S`)
}

/**
 * 复制
 */
export async function copy(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+C`)
}

/**
 * 粘贴
 */
export async function paste(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+V`)
}

/**
 * 剪切
 */
export async function cut(page: Page): Promise<void> {
  const modifier = getModifierKey()
  await page.keyboard.press(`${modifier}+X`)
}

