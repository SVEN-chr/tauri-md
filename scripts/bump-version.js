#!/usr/bin/env node

/**
 * 版本号同步脚本
 * 
 * 用法:
 *   node scripts/bump-version.js <version>
 *   npm run bump-version <version>
 * 
 * 示例:
 *   node scripts/bump-version.js 1.0.0
 *   npm run bump-version 1.2.3
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 获取命令行参数
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ 错误: 请提供版本号');
  console.log('用法: node scripts/bump-version.js <version>');
  console.log('示例: node scripts/bump-version.js 1.0.0');
  process.exit(1);
}

// 验证版本号格式 (支持 SemVer)
const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!versionRegex.test(newVersion)) {
  console.error('❌ 错误: 版本号格式无效');
  console.log('版本号应符合语义化版本规范,如: 1.0.0, 1.2.3-beta.1');
  process.exit(1);
}

console.log(`🔄 正在更新版本号到 ${newVersion}...\n`);

// 1. 更新 package.json
try {
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const oldVersion = packageJson.version;
  
  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log(`✅ package.json: ${oldVersion} → ${newVersion}`);
} catch (error) {
  console.error('❌ 更新 package.json 失败:', error.message);
  process.exit(1);
}

// 2. 更新 src-tauri/tauri.conf.json
try {
  const tauriConfPath = join(rootDir, 'src-tauri', 'tauri.conf.json');
  const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf-8'));
  const oldVersion = tauriConf.version;
  
  tauriConf.version = newVersion;
  writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
  
  console.log(`✅ src-tauri/tauri.conf.json: ${oldVersion} → ${newVersion}`);
} catch (error) {
  console.error('❌ 更新 src-tauri/tauri.conf.json 失败:', error.message);
  process.exit(1);
}

// 3. 更新 src-tauri/Cargo.toml
try {
  const cargoTomlPath = join(rootDir, 'src-tauri', 'Cargo.toml');
  let cargoToml = readFileSync(cargoTomlPath, 'utf-8');
  
  // 提取旧版本号
  const versionMatch = cargoToml.match(/^version = "(.+)"$/m);
  const oldVersion = versionMatch ? versionMatch[1] : 'unknown';
  
  // 替换版本号
  cargoToml = cargoToml.replace(
    /^version = ".+"$/m,
    `version = "${newVersion}"`
  );
  
  writeFileSync(cargoTomlPath, cargoToml);
  
  console.log(`✅ src-tauri/Cargo.toml: ${oldVersion} → ${newVersion}`);
} catch (error) {
  console.error('❌ 更新 src-tauri/Cargo.toml 失败:', error.message);
  process.exit(1);
}

console.log('\n✨ 版本号更新完成!\n');
console.log('📝 下一步操作:');
console.log('  1. 检查更改: git diff');
console.log('  2. 提交更改: git add . && git commit -m "chore: bump version to ' + newVersion + '"');
console.log('  3. 创建标签: git tag v' + newVersion);
console.log('  4. 推送代码: git push origin main');
console.log('  5. 推送标签: git push origin v' + newVersion);
console.log('\n💡 提示: 推送标签后会自动触发 GitHub Actions 构建和发布流程');

