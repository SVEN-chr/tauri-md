import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 扩展 Vitest 的 expect 断言
expect.extend(matchers)

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock DOM APIs that are not supported in jsdom but required by ProseMirror
// Mock getClientRects
if (typeof Element.prototype.getClientRects === 'undefined') {
  Element.prototype.getClientRects = vi.fn(() => ({
    length: 1,
    item: () => ({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }),
    [0]: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    },
  } as any))
}

// Mock getBoundingClientRect
if (typeof Element.prototype.getBoundingClientRect === 'undefined') {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }))
}

// Mock elementFromPoint
if (typeof Document.prototype.elementFromPoint === 'undefined') {
  Document.prototype.elementFromPoint = vi.fn(() => null)
}

// Mock caretPositionFromPoint and caretRangeFromPoint
if (typeof Document.prototype.caretPositionFromPoint === 'undefined') {
  (Document.prototype as any).caretPositionFromPoint = vi.fn(() => null)
}

if (typeof Document.prototype.caretRangeFromPoint === 'undefined') {
  (Document.prototype as any).caretRangeFromPoint = vi.fn(() => null)
}

// Mock scrollIntoView
if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = vi.fn()
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

