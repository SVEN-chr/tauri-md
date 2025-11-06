import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerLanguages } from './highlightLanguages'

describe('highlightLanguages', () => {
  beforeEach(() => {
    // 清除之前的 console.log mock 调用
    vi.clearAllMocks()
  })

  describe('registerLanguages', () => {
    it('应该成功执行而不抛出错误', () => {
      expect(() => registerLanguages()).not.toThrow()
    })

    it('应该输出日志信息', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      
      registerLanguages()
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('代码高亮语言已加载')
      )
    })

    it('应该能被多次调用', () => {
      expect(() => {
        registerLanguages()
        registerLanguages()
        registerLanguages()
      }).not.toThrow()
    })

    it('应该返回 undefined', () => {
      const result = registerLanguages()
      expect(result).toBeUndefined()
    })
  })

  describe('功能验证', () => {
    it('应该在调用后不影响全局状态', () => {
      const beforeState = { ...window }
      
      registerLanguages()
      
      // 验证没有添加意外的全局变量
      expect(Object.keys(window).length).toBe(Object.keys(beforeState).length)
    })
  })
})

