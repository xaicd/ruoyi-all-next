/**
 * 迁移脚本：将 src/app/api/admin/* 批量搬到 src/app/api/v1/admin/
 * 
 * 逻辑：
 * 1. 遍历 src/app/api/admin/ 下所有子目录
 * 2. 如果 src/app/api/v1/admin/ 下已存在同名目录则跳过（不覆盖）
 * 3. 否则移动整个目录到 v1/admin/ 下
 * 4. 完成后删除旧 src/app/api/admin/ 目录
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OLD_DIR = path.join(ROOT, 'src', 'app', 'api', 'admin');
const NEW_DIR = path.join(ROOT, 'src', 'app', 'api', 'v1', 'admin');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  if (!fs.existsSync(OLD_DIR)) {
    console.log('旧目录不存在，无需迁移:', OLD_DIR);
    return;
  }

  ensureDir(NEW_DIR);

  const entries = fs.readdirSync(OLD_DIR, { withFileTypes: true });
  let moved = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const srcPath = path.join(OLD_DIR, entry.name);
    const destPath = path.join(NEW_DIR, entry.name);

    if (fs.existsSync(destPath)) {
      console.log(`[SKIP] ${entry.name}/ 已存在于 v1/admin/，跳过`);
      skipped++;
    } else {
      copyDirRecursive(srcPath, destPath);
      console.log(`[MOVED] ${entry.name}/ → v1/admin/${entry.name}/`);
      moved++;
    }
  }

  // 删除旧目录
  removeDirRecursive(OLD_DIR);
  console.log(`\n迁移完成: ${moved} 个域已搬到 v1/admin/, ${skipped} 个已存在跳过`);
  console.log('旧目录 src/app/api/admin/ 已删除');
}

main();
