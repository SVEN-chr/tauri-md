# 快速发布指南

## 🚀 一键发布流程

### 方法 1: 使用脚本 (推荐)

```bash
# 1. 更新版本号并提交
npm run bump-version 1.0.0
git add .
git commit -m "chore: bump version to 1.0.0"

# 2. 推送并创建标签
git push origin main
git tag v1.0.0
git push origin v1.0.0

# 3. 等待 GitHub Actions 完成 (约 15-20 分钟)
# 4. 访问 https://github.com/YOUR_USERNAME/tauri-md/releases
# 5. 编辑并发布 Release
```

### 方法 2: 手动操作

```bash
# 1. 手动更新三个文件中的版本号
# - package.json
# - src-tauri/tauri.conf.json
# - src-tauri/Cargo.toml

# 2. 提交更改
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: bump version to 1.0.0"
git push origin main

# 3. 创建并推送标签
git tag v1.0.0
git push origin v1.0.0
```

## ✅ 发布前检查清单

- [ ] 所有测试通过 (`npm run test:all`)
- [ ] 代码已合并到 main 分支
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] 在本地测试过构建 (`npm run tauri build`)
- [ ] 已推送所有更改到 GitHub

## 📋 版本号规则

| 变更类型 | 版本号变化 | 示例 |
|---------|-----------|------|
| 重大变更 (破坏性) | MAJOR | 1.0.0 → 2.0.0 |
| 新功能 | MINOR | 1.0.0 → 1.1.0 |
| Bug 修复 | PATCH | 1.0.0 → 1.0.1 |
| 预发布 | 添加后缀 | 1.0.0-beta.1 |

## 🔄 常用命令

```bash
# 更新版本号
npm run bump-version <version>

# 运行所有测试
npm run test:all

# 本地构建 Tauri 应用
npm run tauri build

# 查看 git 标签
git tag -l

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push --delete origin v1.0.0

# 查看最近的提交
git log --oneline -10
```

## 🐛 常见问题

### Q: 如何取消已推送的发布?

```bash
# 1. 删除远程标签
git push --delete origin v1.0.0

# 2. 删除本地标签
git tag -d v1.0.0

# 3. 在 GitHub 上删除 Release
# 访问 Releases 页面,点击对应 Release 的 "Delete" 按钮
```

### Q: 如何修复发布失败?

1. 查看 Actions 页面的错误日志
2. 修复问题
3. 删除失败的标签 (见上方)
4. 重新推送标签

### Q: 如何发布预览版?

```bash
# 使用 beta/alpha/rc 后缀
npm run bump-version 1.0.0-beta.1
git add .
git commit -m "chore: bump version to 1.0.0-beta.1"
git push origin main
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# 在 GitHub Release 中勾选 "This is a pre-release"
```

### Q: 构建时间太长怎么办?

- 正常情况下需要 15-20 分钟
- 可以在 Actions 页面查看实时进度
- 如果超过 30 分钟,可能是构建失败,检查日志

## 📊 发布后检查

- [ ] 所有平台的安装包都已上传
- [ ] Release 说明完整清晰
- [ ] 下载并测试各平台的安装包
- [ ] 更新项目文档 (如有需要)
- [ ] 通知用户新版本发布

## 🔗 相关链接

- [完整发布指南](./RELEASE.md)
- [工作流说明](./workflows/README.md)
- [更新日志](../CHANGELOG.md)

