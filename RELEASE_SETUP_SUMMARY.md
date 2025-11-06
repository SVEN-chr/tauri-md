# GitHub Actions 自动发布配置总结

## 📦 已创建的文件

### 1. 工作流文件

#### `.github/workflows/release.yml` ⭐ 核心文件
**功能**: 自动构建和发布 Tauri 应用

**触发条件**: 推送版本标签 (如 `v1.0.0`)

**主要特性**:
- ✅ 运行所有测试 (单元测试 + E2E 测试)
- ✅ 多平台并行构建 (Windows, macOS Intel, macOS Apple Silicon, Linux)
- ✅ 自动创建 GitHub Release
- ✅ 自动上传安装包
- ✅ 自动生成更新日志
- ✅ 支持代码签名 (可选配置)

**构建产物**:
- Windows: `.msi`, `.exe`
- macOS: `.dmg` (aarch64 和 x64)
- Linux: `.AppImage`, `.deb`

#### `.github/workflows/ci.yml`
**功能**: 持续集成测试和构建检查

**触发条件**: 推送到 main/develop 分支或创建 Pull Request

**主要特性**:
- ✅ 多平台测试
- ✅ TypeScript 类型检查
- ✅ Rust 代码检查 (fmt + clippy)
- ✅ 调试模式构建验证

**注意**: 仓库中已有 `.github/workflows/test.yml`,功能类似。建议:
- 保留 `test.yml` 用于日常测试
- 删除 `ci.yml` 避免重复,或
- 将 `ci.yml` 用于其他用途 (如代码质量检查)

### 2. 文档文件

#### `.github/SETUP.md`
**内容**: 完整的配置指南
- GitHub 仓库权限配置
- 代码签名配置 (macOS + Windows)
- 工作流测试步骤
- 常见问题解答

#### `.github/RELEASE.md`
**内容**: 详细的发布指南
- 版本号更新流程
- 发布步骤详解
- 代码签名配置
- 故障排查
- 版本管理最佳实践

#### `.github/QUICK_RELEASE.md`
**内容**: 快速参考指南
- 一键发布流程
- 发布前检查清单
- 常用命令速查
- 常见问题快速解答

#### `.github/workflows/README.md`
**内容**: 工作流详细说明
- 各个工作流的功能介绍
- 任务和步骤详解
- 代码签名配置
- 故障排查指南

### 3. 辅助脚本

#### `scripts/bump-version.js`
**功能**: 同步更新三个文件中的版本号
- `package.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`

**用法**:
```bash
npm run bump-version 1.0.0
```

### 4. 其他文件

#### `CHANGELOG.md`
**功能**: 更新日志模板
- 遵循 Keep a Changelog 格式
- 语义化版本规范
- 包含使用说明

#### `package.json` (已更新)
**新增脚本**:
```json
"bump-version": "node scripts/bump-version.js"
```

## 🚀 快速开始

### 第一步: 配置 GitHub 仓库权限 (必须)

1. 访问仓库 Settings → Actions → General
2. 在 "Workflow permissions" 中选择 **"Read and write permissions"**
3. 勾选 **"Allow GitHub Actions to create and approve pull requests"**
4. 点击 "Save"

### 第二步: 测试工作流 (可选)

```bash
# 推送代码触发 CI 测试
git add .
git commit -m "feat: add GitHub Actions workflows"
git push origin main

# 创建测试标签触发发布流程
git tag v0.1.0-test
git push origin v0.1.0-test

# 测试完成后删除
git push --delete origin v0.1.0-test
git tag -d v0.1.0-test
```

### 第三步: 正式发布

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

# 4. 等待 GitHub Actions 完成 (约 15-20 分钟)
# 5. 访问 GitHub Releases 页面编辑并发布
```

## 🔐 代码签名配置 (可选)

### macOS 签名

**需要的 GitHub Secrets**:
- `APPLE_CERTIFICATE`
- `APPLE_CERTIFICATE_PASSWORD`
- `APPLE_SIGNING_IDENTITY`
- `APPLE_ID`
- `APPLE_PASSWORD`
- `APPLE_TEAM_ID`

**配置后**: 取消注释 `.github/workflows/release.yml` 中的相关环境变量

### Windows 签名

**需要的 GitHub Secrets**:
- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

**配置后**: 取消注释 `.github/workflows/release.yml` 中的相关环境变量

详细配置步骤请参考 `.github/SETUP.md`

## 📋 工作流程图

```
推送标签 v1.0.0
    ↓
触发 Release 工作流
    ↓
┌─────────────────┐
│  Test 任务      │
│  - 单元测试     │
│  - E2E 测试     │
└────────┬────────┘
         ↓ (测试通过)
┌─────────────────────────────────┐
│  Release 任务 (并行)            │
│  - Windows 构建                 │
│  - macOS Intel 构建             │
│  - macOS Apple Silicon 构建     │
│  - Linux 构建                   │
└────────┬────────────────────────┘
         ↓ (所有构建完成)
┌─────────────────┐
│ Update Release  │
│ - 生成更新日志  │
│ - 更新 Release  │
│ - 发布 Release  │
└─────────────────┘
```

## 📚 文档导航

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [SETUP.md](.github/SETUP.md) | 初始配置 | 首次配置 |
| [QUICK_RELEASE.md](.github/QUICK_RELEASE.md) | 快速参考 | 日常发布 |
| [RELEASE.md](.github/RELEASE.md) | 详细指南 | 深入了解 |
| [workflows/README.md](.github/workflows/README.md) | 工作流说明 | 调试问题 |
| [CHANGELOG.md](CHANGELOG.md) | 更新日志 | 记录变更 |

## ✅ 检查清单

### 配置完成检查
- [ ] GitHub 仓库权限已配置
- [ ] 已测试 CI 工作流
- [ ] 已测试发布工作流 (可选)
- [ ] 已阅读相关文档

### 发布前检查
- [ ] 所有测试通过
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] 代码已合并到 main 分支

### 发布后检查
- [ ] 所有平台的安装包已上传
- [ ] Release 说明完整
- [ ] 已测试安装包
- [ ] 已通知用户

## 🎯 下一步

1. **立即配置**: 按照 `.github/SETUP.md` 配置 GitHub 仓库权限
2. **测试工作流**: 创建测试标签验证发布流程
3. **配置签名** (可选): 如需代码签名,参考 `.github/RELEASE.md`
4. **正式发布**: 使用 `npm run bump-version` 发布第一个版本

## 💡 提示

- 代码签名是**可选**的,但推荐配置以提升用户信任
- 首次发布建议使用测试标签 (如 `v0.1.0-beta.1`) 验证流程
- 保持 CHANGELOG.md 更新,工作流会自动使用它
- 遇到问题查看 Actions 日志,大部分问题都有详细的错误信息

## 🔗 相关资源

- [Tauri 官方文档](https://tauri.app/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [tauri-action](https://github.com/tauri-apps/tauri-action)
- [语义化版本](https://semver.org/lang/zh-CN/)

---

**配置完成!** 🎉

现在您可以使用 GitHub Actions 自动发布 Tauri Markdown 编辑器了!

