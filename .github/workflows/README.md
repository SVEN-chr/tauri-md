# GitHub Actions 工作流说明

本目录包含 Tauri Markdown 编辑器的 CI/CD 工作流配置。

## 📁 工作流文件

### `release.yml` - 自动发布工作流

**触发条件**: 推送版本标签 (如 `v1.0.0`)

**功能**:
1. ✅ 运行所有单元测试和 E2E 测试
2. 🏗️ 为多个平台构建 Tauri 应用
3. 📦 创建 GitHub Release
4. ⬆️ 上传安装包到 Release

**支持的平台**:
- Windows (x64)
- macOS (Intel + Apple Silicon)
- Linux (x64)

**构建产物**:
- Windows: `.msi`, `.exe`
- macOS: `.dmg` (aarch64 和 x64)
- Linux: `.AppImage`, `.deb`

## 🚀 快速开始

### 发布新版本

```bash
# 1. 更新版本号
npm run bump-version 1.0.0

# 2. 提交更改
git add .
git commit -m "chore: bump version to 1.0.0"
git push origin main

# 3. 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 4. 等待 GitHub Actions 完成构建
# 5. 在 GitHub Releases 页面发布
```

## 🔧 工作流详解

### 任务 1: Test (测试)

**运行环境**: Ubuntu Latest

**步骤**:
1. 检出代码
2. 设置 Node.js 20
3. 安装 npm 依赖
4. 安装 Playwright 浏览器
5. 运行 `npm run test:all`

**目的**: 确保代码质量,防止发布有问题的版本

### 任务 2: Release (发布)

**运行环境**: 
- macOS Latest (构建 macOS 版本)
- Ubuntu 22.04 (构建 Linux 版本)
- Windows Latest (构建 Windows 版本)

**矩阵策略**:
```yaml
matrix:
  settings:
    - platform: 'macos-latest'
      args: '--target aarch64-apple-darwin'  # Apple Silicon
    - platform: 'macos-latest'
      args: '--target x86_64-apple-darwin'   # Intel
    - platform: 'ubuntu-22.04'
      args: ''                                # Linux x64
    - platform: 'windows-latest'
      args: ''                                # Windows x64
```

**步骤**:
1. 检出代码
2. 设置 Node.js 20
3. 安装 Rust 工具链
4. 安装系统依赖 (仅 Linux)
5. 安装前端依赖
6. 使用 `tauri-action` 构建并发布

**依赖**: 需要 Test 任务成功完成

### 任务 3: Update Release (更新发布说明)

**运行环境**: Ubuntu Latest

**步骤**:
1. 检出完整 git 历史
2. 生成更新日志 (对比上一个标签)
3. 更新 Release 说明
4. 将 Draft Release 改为正式发布

**依赖**: 需要 Release 任务成功完成

## 🔐 代码签名 (可选)

### macOS 签名

需要在 GitHub Secrets 中配置:

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `APPLE_CERTIFICATE` | 开发者证书 (base64) | `base64 -i cert.p12` |
| `APPLE_CERTIFICATE_PASSWORD` | 证书密码 | 创建证书时设置 |
| `APPLE_SIGNING_IDENTITY` | 签名身份 | "Developer ID Application: ..." |
| `APPLE_ID` | Apple ID | appleid.apple.com |
| `APPLE_PASSWORD` | App-specific password | appleid.apple.com 生成 |
| `APPLE_TEAM_ID` | 团队 ID | developer.apple.com |

配置后取消注释 `release.yml` 中的相关环境变量。

### Windows 签名

需要在 GitHub Secrets 中配置:

| Secret 名称 | 说明 |
|------------|------|
| `TAURI_SIGNING_PRIVATE_KEY` | 私钥 (base64) |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | 私钥密码 |

## 📊 工作流状态

查看工作流运行状态:
- 访问仓库的 Actions 页面
- 选择 "Release" 工作流
- 查看最近的运行记录

## 🐛 故障排查

### 测试失败

**症状**: Test 任务失败,Release 任务不会运行

**解决方案**:
1. 在本地运行 `npm run test:all` 检查测试
2. 修复失败的测试
3. 重新推送代码和标签

### 构建失败

**症状**: Release 任务在某个平台失败

**常见原因**:
- 依赖版本不兼容
- Rust 编译错误
- 前端构建错误
- 系统依赖缺失 (Linux)

**解决方案**:
1. 查看 Actions 日志中的详细错误
2. 在对应平台本地测试构建
3. 修复问题后重新推送标签

### 权限错误

**症状**: 无法创建 Release 或上传文件

**解决方案**:
1. 检查仓库 Settings → Actions → General
2. 确保 "Workflow permissions" 设置为 "Read and write permissions"
3. 重新运行工作流

## 📝 最佳实践

1. **版本号管理**
   - 使用 `npm run bump-version` 统一更新版本号
   - 遵循语义化版本规范 (SemVer)

2. **测试覆盖**
   - 发布前确保所有测试通过
   - 定期更新和维护测试用例

3. **发布频率**
   - 建立固定的发布周期
   - 及时修复关键 bug

4. **更新日志**
   - 维护清晰的 CHANGELOG.md
   - 在 Release 说明中详细描述变更

5. **预发布测试**
   - 使用 beta/rc 标签进行预发布
   - 在正式发布前充分测试

## 🔗 相关资源

- [Tauri Action 文档](https://github.com/tauri-apps/tauri-action)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [发布指南](./../RELEASE.md)

