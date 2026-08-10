/**
 * fix-args-body.cjs
 * 
 * Fixes service methods that use `...args: any[]` but still reference `id`/`input` in body.
 * Replaces the body with simple return statements.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
let fixedCount = 0

function processDir(dir) {
  if (!fs.existsSync(dir)) return
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) {
      if (['node_modules', '.git', '.next-ruoyi', '__tests__'].includes(item.name)) continue
      processDir(full)
    } else if (item.name.endsWith('.service.ts')) {
      let content = fs.readFileSync(full, 'utf-8')
      let changed = false

      // Fix: static async update(...args: any[]) { return { id, ...input } }
      // Replace with: static async update(...args: any[]) { return { id: args[0], ...args[1] } }
      const patterns = [
        {
          find: /static async update\(\.\.\.\s*args:\s*any\[\]\)\s*\{\s*\n\s*return \{ id, \.\.\.input \}\s*\n\s*\}/g,
          replace: 'static async update(...args: any[]) {\n    return { id: args[0], ...(args[1] || {}) }\n  }',
        },
        {
          find: /static async update\(\.\.\.\s*args:\s*any\[\]\)\s*\{\s*return \{ id, \.\.\.input \}\s*\}/g,
          replace: 'static async update(...args: any[]) { return { id: args[0], ...(args[1] || {}) } }',
        },
        // Also fix single-line patterns
        {
          find: /static async (\w+)\(\.\.\.\s*args:\s*any\[\]\)\s*\{\s*\n\s*return \{ id, \.\.\.input \}\s*\n\s*\}/g,
          replace: 'static async $1(...args: any[]) {\n    return { id: args[0], ...(args[1] || {}) }\n  }',
        },
      ]

      for (const p of patterns) {
        const before = content
        content = content.replace(p.find, p.replace)
        if (content !== before) changed = true
      }

      // More generic fix: any method with ...args that references bare `id` or `input`
      // Pattern: static async xxx(...args: any[]) {\n    return { id }\n  }
      content = content.replace(
        /static async (\w+)\(\.\.\.\s*args:\s*any\[\]\)\s*\{\s*\n\s*return \{ id \}\s*\n\s*\}/g,
        'static async $1(...args: any[]) {\n    return { id: args[0] }\n  }'
      )

      // Fix shorthand property `input` 
      // return { id: String(Date.now()), ...input }
      content = content.replace(
        /static async (\w+)\(\.\.\.\s*args:\s*any\[\]\)\s*\{\s*\n\s*return \{ id: String\(Date\.now\(\)\), \.\.\.input \}\s*\n\s*\}/g,
        'static async $1(...args: any[]) {\n    return { id: String(Date.now()), ...(args[0] || {}) }\n  }'
      )

      if (content !== fs.readFileSync(full, 'utf-8')) {
        fs.writeFileSync(full, content)
        fixedCount++
      }
    }
  }
}

processDir(path.join(ROOT, 'src'))
console.log(`Fixed ${fixedCount} service files.`)
