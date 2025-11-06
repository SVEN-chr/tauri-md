# GitHub Actions 配置指南

本文档说明如何为 Tauri Markdown 编辑器配置 GitHub Actions 自动发布功能。

## 📦 已创建的文件

### 工作流文件
- `.github/workflows/release.yml` - 自动发布工作流
- `.github/workflows/ci.yml` - 持续集成工作流

### 文档文件
- `.github/RELEASE.md` - 详细发布指南
- `.github/QUICK_RELEASE.md` - 快速发布参考
- `.github/workflows/README.md` - 工作流说明
- `.github/SETUP.md` - 本文件

### 辅助脚本
- `scripts/bump-version.js` - 版本号同步脚本

### 其他文件
- `CHANGELOG.md` - 更新日志模板

## 🔧 初始配置步骤

### 1. 配置 GitHub 仓库权限

这是**必须**的步骤,否则工作流无法创建 Release。

1. 访问仓库的 Settings 页面
2. 点击左侧菜单的 "Actions" → "General"
3. 滚动到 "Workflow permissions" 部分
4. 选择 **"Read and write permissions"**
5. 勾选 **"Allow GitHub Actions to create and approve pull requests"**
6. 点击 "Save" 保存

### 2. 测试 CI 工作流

推送代码到 main 分支会自动触发 CI 工作流:

```bash
git add .
git commit -m "feat: add GitHub Actions workflows"
git push origin main
```

访问仓库的 Actions 页面,查看 CI 工作流是否成功运行。

### 3. 测试发布工作流 (可选)

创建一个测试标签来验证发布流程:

```bash
# 创建测试标签
git tag v0.1.0-test
git push origin v0.1.0-test

# 等待工作流完成
# 检查 Actions 页面和 Releases 页面

# 测试完成后删除
git push --delete origin v0.1.0-test
git tag -d v0.1.0-test
```

## 🔐 代码签名配置 (可选)

代码签名可以让用户更信任您的应用,但需要额外的证书和配置。

### macOS 代码签名

**前置要求**:
- Apple Developer 账号 ($99/年)
- 开发者证书

**配置步骤**:

1. **导出证书**
   ```bash
   # 在 macOS 上,从钥匙串导出证书为 .p12 文件
   # 然后转换为 base64
   base64 -i certificate.p12 | pbcopy
   ```

2. **添加 GitHub Secrets**
   
   访问仓库 Settings → Secrets and variables → Actions → New repository secret
   
   添加以下 secrets:
   - `APPLE_CERTIFICATE`: 粘贴上一步复制的 base64 字符串
   - `APPLE_CERTIFICATE_PASSWORD`: 证书密码
   - `APPLE_SIGNING_IDENTITY`: 如 "Developer ID Application: Your Name (TEAM_ID)"
   - `APPLE_ID`: Apple ID 邮箱
   - `APPLE_PASSWORD`: App-specific password (在 appleid.apple.com 生成)
   - `APPLE_TEAM_ID`: 团队 ID (在 developer.apple.com 查看)

3. **启用签名**
   
   编辑 `.github/workflows/release.yml`,找到以下注释的行并取消注释:
   ```yaml
   env:
     GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     # 取消下面这些行的注释
     APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
     APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
     APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
     APPLE_ID: ${{ secrets.APPLE_ID }}
     APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
     APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
   ```

### Windows 代码签名

**前置要求**:
- 代码签名证书 (从 DigiCert, Sectigo 等购买)

**配置步骤**:

1. **准备证书**
   ```bash
   # 将证书转换为 base64
   base64 -i certificate.pfx > certificate.txt
   ```

2. **添加 GitHub Secrets**
   - `TAURI_SIGNING_PRIVATE_KEY`: 证书的 base64 编码
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: 证书密码

3. **启用签名**
   
   在 `.github/workflows/release.yml` 中取消注释:
   ```yaml
   TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
   TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
   ```

## 📝 使用说明

### 日常开发

每次推送到 main 或 develop 分支,或创建 Pull Request 时,CI 工作流会自动运行:

- ✅ TypeScript 类型检查
- ✅ 单元测试
- ✅ E2E 测试
- ✅ Rust 代码检查
- ✅ 构建检查

### 发布新版本

详细步骤请参考 [快速发布指南](./QUICK_RELEASE.md)。

简要流程:

```bash
# 1. 更新版本号
npm run bump-version 1.0.0

# 2. 提交并推送
git add .
git commit -m "chore: bump version to 1.0.0"
git push origin main

# 3. 创建并推送标签
git tag v1.0.0
git push origin v1.0.0

# 4. 等待 GitHub Actions 完成
# 5. 在 GitHub Releases 页面发布
```

## 🎯 工作流特性

### Release 工作流

- ✅ 自动运行所有测试
- ✅ 多平台并行构建
- ✅ 自动创建 GitHub Release
- ✅ 自动上传安装包
- ✅ 自动生成更新日志
- ✅ 支持代码签名 (可选)

### CI 工作流

- ✅ 多平台测试
- ✅ TypeScript 类型检查
- ✅ Rust 代码检查 (fmt + clippy)
- ✅ 构建验证
- ✅ 测试结果上传

## 🔍 监控和调试

### 查看工作流状态

1. 访问仓库的 Actions 页面
2. 选择对应的工作流
3. 查看运行历史和日志

### 调试失败的工作流

1. 点击失败的工作流运行
2. 展开失败的步骤查看详细日志
3. 根据错误信息修复问题
4. 重新推送代码或标签

### 重新运行工作流

在 Actions 页面,点击失败的工作流,然后点击 "Re-run jobs" 按钮。

## 📚 相关文档

- [完整发布指南](./RELEASE.md) - 详细的发布流程和最佳实践
- [快速发布指南](./QUICK_RELEASE.md) - 快速参考和常用命令
- [工作流说明](./workflows/README.md) - 工作流详细说明
- [Tauri 官方文档](https://tauri.app/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## ❓ 常见问题

### Q: 为什么需要配置仓库权限?

A: GitHub Actions 默认只有读取权限,需要写入权限才能创建 Release 和上传文件。

### Q: 可以不配置代码签名吗?

A: 可以。代码签名是可选的,但没有签名的应用在 macOS 和 Windows 上会显示安全警告。

### Q: 构建需要多长时间?

A: 通常需要 15-20 分钟,因为要为多个平台构建。

### Q: 如何只为某个平台构建?

A: 编辑 `.github/workflows/release.yml`,修改 matrix 配置,移除不需要的平台。

### Q: 可以自定义 Release 说明吗?

A: 可以。工作流创建的是 Draft Release,您可以在发布前编辑说明。

## 🎉 完成!

配置完成后,您就可以使用 GitHub Actions 自动发布 Tauri 应用了!

如有问题,请参考相关文档或查看 GitHub Actions 日志。

