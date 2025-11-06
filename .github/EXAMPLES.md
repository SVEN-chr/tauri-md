# GitHub Actions 使用示例

本文档提供实际的使用示例和命令。

## 📝 场景 1: 发布第一个正式版本

假设您已经完成开发,准备发布 v1.0.0:

```bash
# 1. 确保所有测试通过
npm run test:all

# 2. 更新版本号
npm run bump-version 1.0.0

# 3. 更新 CHANGELOG.md
# 编辑 CHANGELOG.md,将 [未发布] 部分移到 [1.0.0] 下

# 4. 提交所有更改
git add .
git commit -m "chore: release v1.0.0"

# 5. 推送到 GitHub
git push origin main

# 6. 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 7. 等待 GitHub Actions 完成
# 访问 https://github.com/YOUR_USERNAME/tauri-md/actions

# 8. 发布 Release
# 访问 https://github.com/YOUR_USERNAME/tauri-md/releases
# 编辑 Draft Release,然后点击 "Publish release"
```

## 📝 场景 2: 发布 Bug 修复版本

修复了一些 bug,准备发布 v1.0.1:

```bash
# 1. 确保 bug 已修复并测试通过
npm run test:all

# 2. 更新版本号 (PATCH 版本)
npm run bump-version 1.0.1

# 3. 更新 CHANGELOG.md
# 在 [1.0.1] 下的 "修复" 部分列出修复的 bug

# 4. 提交并推送
git add .
git commit -m "chore: release v1.0.1 - bug fixes"
git push origin main

# 5. 创建并推送标签
git tag v1.0.1
git push origin v1.0.1
```

## 📝 场景 3: 发布新功能版本

添加了新功能,准备发布 v1.1.0:

```bash
# 1. 确保新功能已完成并测试通过
npm run test:all

# 2. 更新版本号 (MINOR 版本)
npm run bump-version 1.1.0

# 3. 更新 CHANGELOG.md
# 在 [1.1.0] 下的 "新增" 部分列出新功能

# 4. 提交并推送
git add .
git commit -m "chore: release v1.1.0 - new features"
git push origin main

# 5. 创建并推送标签
git tag v1.1.0
git push origin v1.1.0
```

## 📝 场景 4: 发布 Beta 测试版本

准备发布 v2.0.0-beta.1 供用户测试:

```bash
# 1. 更新版本号
npm run bump-version 2.0.0-beta.1

# 2. 提交并推送
git add .
git commit -m "chore: release v2.0.0-beta.1"
git push origin main

# 3. 创建并推送标签
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1

# 4. 在 GitHub Release 中标记为 "Pre-release"
```

## 📝 场景 5: 取消错误的发布

不小心推送了错误的标签:

```bash
# 1. 删除远程标签
git push --delete origin v1.0.2

# 2. 删除本地标签
git tag -d v1.0.2

# 3. 在 GitHub 上删除 Release
# 访问 Releases 页面,点击对应 Release 的 "Delete" 按钮

# 4. 如果需要,重新创建正确的标签
git tag v1.0.2
git push origin v1.0.2
```

## 📝 场景 6: 查看发布状态

检查发布工作流的运行状态:

```bash
# 使用 GitHub CLI (需要先安装 gh)
gh run list --workflow=release.yml

# 查看最新运行的详细信息
gh run view

# 查看特定运行的日志
gh run view <run-id> --log

# 在浏览器中打开 Actions 页面
gh run view --web
```

## 📝 场景 7: 本地测试构建

在推送标签前,先在本地测试构建:

```bash
# 1. 安装依赖
npm ci

# 2. 运行测试
npm run test:all

# 3. 构建前端
npm run build

# 4. 构建 Tauri 应用 (调试模式,更快)
npm run tauri build -- --debug

# 5. 构建 Tauri 应用 (发布模式)
npm run tauri build

# 构建产物位于:
# - Windows: src-tauri/target/release/bundle/
# - macOS: src-tauri/target/release/bundle/
# - Linux: src-tauri/target/release/bundle/
```

## 📝 场景 8: 配置代码签名

### macOS 代码签名配置

```bash
# 1. 导出证书为 base64
base64 -i ~/Downloads/certificate.p12 | pbcopy

# 2. 在 GitHub 仓库中添加 Secrets
# Settings → Secrets and variables → Actions → New repository secret

# 添加以下 secrets:
# - APPLE_CERTIFICATE: (粘贴刚才复制的 base64)
# - APPLE_CERTIFICATE_PASSWORD: your_password
# - APPLE_SIGNING_IDENTITY: "Developer ID Application: Your Name (TEAM_ID)"
# - APPLE_ID: your@email.com
# - APPLE_PASSWORD: (App-specific password from appleid.apple.com)
# - APPLE_TEAM_ID: YOUR_TEAM_ID

# 3. 编辑 .github/workflows/release.yml
# 取消注释 APPLE_* 环境变量

# 4. 提交更改
git add .github/workflows/release.yml
git commit -m "chore: enable macOS code signing"
git push origin main
```

### Windows 代码签名配置

```bash
# 1. 转换证书为 base64
certutil -encode certificate.pfx certificate.txt
# 或在 Linux/macOS:
base64 -i certificate.pfx > certificate.txt

# 2. 在 GitHub 仓库中添加 Secrets
# - TAURI_SIGNING_PRIVATE_KEY: (证书的 base64 内容)
# - TAURI_SIGNING_PRIVATE_KEY_PASSWORD: your_password

# 3. 编辑 .github/workflows/release.yml
# 取消注释 TAURI_SIGNING_* 环境变量

# 4. 提交更改
git add .github/workflows/release.yml
git commit -m "chore: enable Windows code signing"
git push origin main
```

## 📝 场景 9: 调试失败的工作流

工作流失败时的调试步骤:

```bash
# 1. 查看 Actions 日志
# 访问 https://github.com/YOUR_USERNAME/tauri-md/actions
# 点击失败的工作流运行
# 展开失败的步骤查看详细日志

# 2. 在本地复现问题
npm ci
npm run test:all
npm run build
npm run tauri build

# 3. 如果是测试失败
npm run test:run  # 单元测试
npm run test:e2e  # E2E 测试

# 4. 如果是构建失败
# 检查 TypeScript 错误
npx tsc --noEmit

# 检查 Rust 错误
cd src-tauri
cargo check
cargo clippy

# 5. 修复问题后重新推送
git add .
git commit -m "fix: resolve build issues"
git push origin main

# 6. 重新推送标签 (如果需要)
git tag -d v1.0.0
git push --delete origin v1.0.0
git tag v1.0.0
git push origin v1.0.0
```

## 📝 场景 10: 批量发布多个版本

如果需要同时维护多个版本分支:

```bash
# 主版本 (v2.x)
git checkout main
npm run bump-version 2.0.0
git add .
git commit -m "chore: release v2.0.0"
git push origin main
git tag v2.0.0
git push origin v2.0.0

# 维护版本 (v1.x)
git checkout v1-maintenance
npm run bump-version 1.5.1
git add .
git commit -m "chore: release v1.5.1"
git push origin v1-maintenance
git tag v1.5.1
git push origin v1.5.1

# 两个版本会并行构建
```

## 💡 提示

1. **始终先测试**: 推送标签前确保 `npm run test:all` 通过
2. **使用语义化版本**: 遵循 MAJOR.MINOR.PATCH 规则
3. **更新 CHANGELOG**: 每次发布前更新更新日志
4. **本地测试构建**: 大版本发布前先本地测试构建
5. **使用预发布版本**: 重大更新先发布 beta 版本测试
6. **保持文档同步**: 发布后更新 README 和文档

## 🔗 相关命令速查

```bash
# 版本管理
npm run bump-version <version>

# 测试
npm run test:all
npm run test:run
npm run test:e2e

# 构建
npm run build
npm run tauri build
npm run tauri build -- --debug

# Git 操作
git tag v1.0.0
git push origin v1.0.0
git tag -d v1.0.0
git push --delete origin v1.0.0

# GitHub CLI
gh run list
gh run view
gh release list
gh release view v1.0.0
```

