# 发布指南

本文档说明如何使用 GitHub Actions 自动发布 Tauri Markdown 编辑器。

## 📋 前置要求

1. **GitHub 仓库**: 确保代码已推送到 GitHub
2. **权限配置**: 确保仓库的 Actions 有写入权限
   - 进入仓库 Settings → Actions → General
   - 在 "Workflow permissions" 中选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

## 🚀 发布流程

### 1. 更新版本号

在发布前,需要同步更新三个文件中的版本号:

```bash
# 1. package.json
{
  "version": "1.0.0"
}

# 2. src-tauri/tauri.conf.json
{
  "version": "1.0.0"
}

# 3. src-tauri/Cargo.toml
[package]
version = "1.0.0"
```

**快速更新脚本** (可选):

```bash
# 使用 npm version 命令自动更新 package.json
npm version 1.0.0 --no-git-tag-version

# 手动更新 Tauri 配置文件
# 或创建一个脚本来同步版本号
```

### 2. 提交更改

```bash
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: bump version to 1.0.0"
git push origin main
```

### 3. 创建并推送标签

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签到 GitHub (这会触发发布工作流)
git push origin v1.0.0
```

### 4. 监控构建过程

1. 访问 GitHub 仓库的 Actions 页面
2. 查看 "Release" 工作流的运行状态
3. 等待所有平台的构建完成(通常需要 10-20 分钟)

### 5. 发布 Release

构建完成后:

1. 访问仓库的 Releases 页面
2. 找到新创建的 Draft Release
3. 检查上传的安装包是否完整
4. 编辑 Release 说明(如需要)
5. 点击 "Publish release" 发布

## 📦 构建产物

工作流会为以下平台生成安装包:

### Windows
- `tauri-md_x.x.x_x64-setup.exe` - 安装程序
- `tauri-md_x.x.x_x64_en-US.msi` - MSI 安装包

### macOS
- `tauri-md_x.x.x_aarch64.dmg` - Apple Silicon (M1/M2/M3)
- `tauri-md_x.x.x_x64.dmg` - Intel 处理器

### Linux
- `tauri-md_x.x.x_amd64.AppImage` - 通用格式
- `tauri-md_x.x.x_amd64.deb` - Debian/Ubuntu 包

## 🔐 代码签名配置(可选但推荐)

### macOS 代码签名

为了让 macOS 用户能够直接运行应用而不显示安全警告,需要配置代码签名:

1. **获取 Apple Developer 证书**
   - 需要 Apple Developer 账号($99/年)
   - 在 Xcode 中创建开发者证书

2. **配置 GitHub Secrets**
   
   在仓库 Settings → Secrets and variables → Actions 中添加:
   
   - `APPLE_CERTIFICATE`: 证书的 base64 编码
     ```bash
     base64 -i certificate.p12 | pbcopy
     ```
   
   - `APPLE_CERTIFICATE_PASSWORD`: 证书密码
   
   - `APPLE_SIGNING_IDENTITY`: 签名身份(通常是 "Developer ID Application: Your Name")
   
   - `APPLE_ID`: Apple ID 邮箱
   
   - `APPLE_PASSWORD`: App-specific password
     - 在 appleid.apple.com 生成
   
   - `APPLE_TEAM_ID`: 团队 ID
     - 在 Apple Developer 账号中查看

3. **取消注释工作流中的签名配置**
   
   编辑 `.github/workflows/release.yml`,取消注释以下行:
   ```yaml
   APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
   APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
   # ... 其他配置
   ```

### Windows 代码签名

1. **获取代码签名证书**
   - 从证书颁发机构购买(如 DigiCert, Sectigo)
   - 或使用自签名证书(仅用于测试)

2. **配置 GitHub Secrets**
   
   - `TAURI_SIGNING_PRIVATE_KEY`: 私钥的 base64 编码
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: 私钥密码

3. **取消注释工作流中的签名配置**

## 🧪 测试工作流

在正式发布前,建议先测试工作流:

1. **创建测试标签**
   ```bash
   git tag v0.1.0-beta.1
   git push origin v0.1.0-beta.1
   ```

2. **检查构建结果**
   - 确保所有平台都能成功构建
   - 下载并测试生成的安装包

3. **删除测试 Release**
   ```bash
   # 删除远程标签
   git push --delete origin v0.1.0-beta.1
   
   # 删除本地标签
   git tag -d v0.1.0-beta.1
   ```

## 🔧 故障排查

### 测试失败

如果测试阶段失败:
- 检查 Actions 日志中的错误信息
- 在本地运行 `npm run test:all` 确保测试通过
- 确保 Playwright 浏览器正确安装

### 构建失败

常见问题:

1. **依赖安装失败**
   - 检查 `package.json` 和 `Cargo.toml` 中的依赖
   - 确保版本号兼容

2. **Rust 编译错误**
   - 检查 Rust 代码语法
   - 确保 Tauri 版本兼容

3. **前端构建失败**
   - 检查 TypeScript 类型错误
   - 确保 Vite 配置正确

### 权限问题

如果无法创建 Release:
- 检查仓库的 Actions 权限设置
- 确保 `GITHUB_TOKEN` 有足够的权限

## 📝 版本管理建议

1. **语义化版本**: 遵循 [SemVer](https://semver.org/)
   - `MAJOR.MINOR.PATCH` (如 1.2.3)
   - 主版本号: 不兼容的 API 修改
   - 次版本号: 向下兼容的功能性新增
   - 修订号: 向下兼容的问题修正

2. **预发布版本**: 用于测试
   - `v1.0.0-alpha.1` - 内部测试
   - `v1.0.0-beta.1` - 公开测试
   - `v1.0.0-rc.1` - 发布候选

3. **更新日志**: 维护 `CHANGELOG.md`
   - 记录每个版本的变更
   - 工作流会自动生成基础更新日志

## 🎯 最佳实践

1. **发布前检查清单**
   - [ ] 所有测试通过
   - [ ] 版本号已更新
   - [ ] 更新日志已编写
   - [ ] 在本地测试构建
   - [ ] 代码已合并到主分支

2. **定期发布**
   - 建立固定的发布周期
   - 及时修复关键 bug

3. **用户沟通**
   - 在 Release 说明中清晰描述变更
   - 提供升级指南(如有破坏性变更)
   - 标注已知问题

## 🔗 相关资源

- [Tauri 官方文档](https://tauri.app/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [tauri-action 文档](https://github.com/tauri-apps/tauri-action)

