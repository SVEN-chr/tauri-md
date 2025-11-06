import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 配置文件
 * 用于 Tauri Markdown 编辑器的 E2E 测试
 */
export default defineConfig({
  // 测试目录
  testDir: './e2e',
  
  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',
  
  // 完全并行运行测试
  fullyParallel: true,
  
  // CI 环境中失败时不重试，本地环境重试一次
  retries: process.env.CI ? 2 : 0,
  
  // 并行工作进程数
  workers: process.env.CI ? 1 : undefined,
  
  // 测试报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    process.env.CI ? ['github'] : ['list'],
  ],
  
  // 全局超时设置
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  // 共享配置
  use: {
    // 基础 URL - Vite 开发服务器
    baseURL: 'http://localhost:1420',

    // 截图配置
    screenshot: 'only-on-failure',

    // 视频录制
    video: 'retain-on-failure',

    // 追踪配置
    trace: 'on-first-retry',
  },

  // 项目配置 - 针对不同浏览器/环境
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // 如果需要测试其他浏览器，可以取消注释
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Web 服务器配置 - 启动 Vite 开发服务器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})

