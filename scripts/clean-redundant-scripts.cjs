const fs = require('fs')
const path = require('path')

// 待删除的无用/一次性临时脚本列表
const REDUNDANT_FILES = [
  'scripts/analyze-errors.cjs',
  'scripts/count-errors.cjs',
  'scripts/find-bad-utf8.mjs',
  'scripts/fix-bad-utf8.mjs',
  'scripts/fix-broken-quotes.cjs',
  'scripts/fix-broken-quotes.mjs',
  'scripts/fix-broken-strings.mjs',
  'scripts/fix-encoding.mjs',
  'scripts/fix-args-body.cjs',
  'scripts/fix-bin-shims.cjs',
  'scripts/fix-export-names.cjs',
  'scripts/fix-routes-to-standard.cjs',
  'scripts/fix-service-export-aliases.cjs',
  'scripts/fix-service-methods-pass2.cjs',
  'scripts/fix-service-methods.cjs',
  'scripts/fix-types-final.cjs',
  'scripts/fix-types-pass3.cjs',
  'scripts/find-ts2304-files.cjs',
  'scripts/find-dead-exports.cjs',
  'scripts/relax-service-types.cjs',
  'scripts/try-build.cjs',
  'scripts/deepen-skills.cjs',
  'scripts/enhance-skills-opensource.cjs',
  'scripts/sync-skills.cjs',
  'scripts/format-menus.cjs',
  'scripts/direct-update-pg.cjs',
  'scripts/update-db-menus.ts',
  'scripts/sync-menu-to-db.ts',
]

console.log('[CLEAN-PROJECT] Starting project directory cleanup...')

let deletedCount = 0
for (const relPath of REDUNDANT_FILES) {
  const fullPath = path.resolve(__dirname, '..', relPath)
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
      console.log(`  -> Removed redundant: ${relPath}`)
      deletedCount++
    } catch (err) {
      console.warn(`  ! Failed to remove ${relPath}:`, err.message)
    }
  }

  // 同时清理母库中的对应文件
  const baseFullPath = path.resolve('D:/workspace/zhuangyuan/ruoyi/ruoyi-all-next', relPath)
  if (fs.existsSync(baseFullPath)) {
    try {
      fs.unlinkSync(baseFullPath)
      console.log(`  -> Removed in base repo: ${relPath}`)
    } catch {}
  }
}

console.log(`[CLEAN-PROJECT] Successfully cleaned ${deletedCount} redundant files!`)
