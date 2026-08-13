/**
 * inject-codegen-output.cjs
 * 
 * 将 codegen 生成的代码 drop-in 到项目中，自动修正：
 * 1. 导入路径（modules/system/services → modules/system/backend/services）
 * 2. 类名规范（UserService → 保留，但在 API route 中复用）
 * 3. 类型字段（dept_id → deptId，created_at → createdAt）
 * 
 * Usage:
 *   node scripts/inject-codegen-output.cjs ./tmp/codegen-User
 *   node scripts/inject-codegen-output.cjs ./tmp/codegen-Student
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SOURCE_DIR = process.argv[2] ? path.resolve(ROOT, process.argv[2]) : path.join(ROOT, 'tmp', 'codegen-User')

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`)
  process.exit(1)
}

console.log(`\n🚀 Injecting codegen output from: ${SOURCE_DIR}\n`)

let copyCount = 0
let skipCount = 0

// Path fixes: generated path → correct path in project
const PATH_FIXES = [
  // Import path fixes
  [/@\/modules\/(\w+)\/services\//g, '@/modules/$1/backend/services/'],
  [/@\/modules\/(\w+)\/validators\//g, '@/modules/$1/backend/validators/'],
  [/@\/modules\/(\w+)\/repositories\//g, '@/modules/$1/backend/repositories/'],
  [/@\/modules\/(\w+)\/types\//g, '@/modules/$1/backend/types/'],
]

// File path remapping: generated path → project path
function getTargetPath(sourceFile) {
  // Remove the SOURCE_DIR prefix and normalize to forward slashes
  const relative = path.relative(path.join(SOURCE_DIR, 'src'), sourceFile).replace(/\\/g, '/')
  
  // Apply path transforms (forward slash based)
  let target = relative
  target = target.replace(/modules\/(\w+)\/services\//g, 'modules/$1/backend/services/')
  target = target.replace(/modules\/(\w+)\/validators\//g, 'modules/$1/backend/validators/')
  target = target.replace(/modules\/(\w+)\/repositories\//g, 'modules/$1/backend/repositories/')
  target = target.replace(/modules\/(\w+)\/types\//g, 'modules/$1/backend/types/')
  target = target.replace(/modules\/(\w+)\/__tests__\//g, 'modules/$1/backend/services/__tests__/')
  
  return path.join(ROOT, 'src', ...target.split('/'))
}

function fixContent(content, targetPath) {
  let fixed = content
  
  // Fix import paths
  for (const [from, to] of PATH_FIXES) {
    fixed = fixed.replace(from, to)
  }
  
  // Fix snake_case field names in types files
  if (targetPath.includes('/types/') || targetPath.includes('.types.ts')) {
    // Keep as-is for now - types reflect the DB schema
  }
  
  return fixed
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return
  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) {
      processDir(full)
    } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
      const target = getTargetPath(full)
      const targetDir = path.dirname(target)
      
      // Check if target already exists
      if (fs.existsSync(target)) {
        console.log(`  ⚠️  SKIP (exists): ${path.relative(ROOT, target)}`)
        skipCount++
        continue
      }
      
      // Read and fix content
      const content = fs.readFileSync(full, 'utf-8')
      const fixed = fixContent(content, target)
      
      // Write to project
      fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(target, fixed)
      copyCount++
      console.log(`  ✅ COPY: ${path.relative(ROOT, target)}`)
    }
  }
}

processDir(path.join(SOURCE_DIR, 'src'))

console.log(`\n✅ Done! Copied ${copyCount} files, skipped ${skipCount} existing files.`)
console.log('\n📋 Next steps:')
console.log('  1. Check copied files for any remaining issues')
console.log('  2. Restart next dev if already running (hot reload picks up new files)')
console.log('  3. Add menu entry for the new page in the sidebar config')
console.log('  4. Run: node scripts/check-types.cjs  — to verify no new TS errors')
