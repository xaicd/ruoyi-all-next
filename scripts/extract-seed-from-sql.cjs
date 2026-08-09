/**
 * 从 ruoyi-vue-pro SQL 文件提取种子数据，输出为 TypeScript 内存格式
 *
 * 提取表：
 * - system_menu（菜单树）
 * - system_dict_type + system_dict_data（字典）
 * - system_dept（部门树）
 * - system_post（岗位）
 *
 * 用法: node scripts/extract-seed-from-sql.cjs
 * 输出: scripts/seed-output/ 目录下的 .ts 文件
 */

const fs = require("fs")
const path = require("path")

const SQL_FILE = path.resolve(__dirname, "../../ruoyi-vue-pro/sql/mysql/ruoyi-vue-pro.sql")
const OUTPUT_DIR = path.resolve(__dirname, "seed-output")

if (!fs.existsSync(SQL_FILE)) {
  console.error("SQL 文件不存在:", SQL_FILE)
  process.exit(1)
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const sql = fs.readFileSync(SQL_FILE, "utf-8")

// === 通用 INSERT 解析器 ===
function extractInserts(tableName) {
  const regex = new RegExp(`INSERT INTO \`${tableName}\`\\s*\\(([^)]+)\\)\\s*VALUES\\s*\\((.+?)\\);`, "g")
  const rows = []
  let match

  while ((match = regex.exec(sql)) !== null) {
    const cols = match[1].split(",").map((c) => c.trim().replace(/`/g, ""))
    const valuesStr = match[2]

    // 简单解析值（处理引号、NULL、b'0'）
    const values = parseValues(valuesStr)
    if (values.length !== cols.length) continue

    const row = {}
    cols.forEach((col, i) => { row[col] = values[i] })
    rows.push(row)
  }

  return rows
}

function parseValues(str) {
  const values = []
  let current = ""
  let inString = false
  let stringChar = ""

  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (inString) {
      if (ch === stringChar && str[i - 1] !== "\\") {
        inString = false
        values.push(current)
        current = ""
        // skip comma after quote
        while (i + 1 < str.length && (str[i + 1] === "," || str[i + 1] === " ")) i++
      } else {
        current += ch
      }
    } else if (ch === "'" || ch === '"') {
      inString = true
      stringChar = ch
      current = ""
    } else if (ch === ",") {
      const trimmed = current.trim()
      if (trimmed === "NULL") values.push(null)
      else if (trimmed === "b'0'") values.push(false)
      else if (trimmed === "b'1'") values.push(true)
      else values.push(trimmed)
      current = ""
    } else {
      current += ch
    }
  }

  // last value
  const trimmed = current.trim()
  if (trimmed === "NULL") values.push(null)
  else if (trimmed === "b'0'") values.push(false)
  else if (trimmed === "b'1'") values.push(true)
  else if (trimmed) values.push(trimmed)

  return values
}

// === 提取菜单 ===
function extractMenus() {
  const rows = extractInserts("system_menu")
  console.log(`[MENU] 提取 ${rows.length} 条菜单`)

  // 只取未删除的
  const activeMenus = rows.filter((r) => r.deleted === false || r.deleted === "0")
  console.log(`[MENU] 有效菜单 ${activeMenus.length} 条`)

  const output = activeMenus.slice(0, 200).map((r) => ({
    id: String(r.id),
    name: r.name || "",
    permission: r.permission || null,
    type: r.type === "1" ? "DIR" : r.type === "2" ? "MENU" : "BUTTON",
    parentId: r.parent_id && r.parent_id !== "0" ? String(r.parent_id) : null,
    path: r.path || null,
    component: r.component || null,
    icon: r.icon || null,
    sort: Number(r.sort) || 0,
    status: r.status === "0" ? "ACTIVE" : "DISABLED",
    visible: r.visible !== "1",
    keepAlive: r.keep_alive !== "1",
  }))

  const content = `// Auto-generated from ruoyi-vue-pro SQL\n// ${output.length} menus extracted\n\nexport const SEED_MENUS = ${JSON.stringify(output, null, 2)}\n`
  fs.writeFileSync(path.join(OUTPUT_DIR, "menus.seed.ts"), content)
  console.log(`[MENU] 写入 seed-output/menus.seed.ts`)
}

// === 提取字典类型 ===
function extractDictTypes() {
  const rows = extractInserts("system_dict_type")
  const active = rows.filter((r) => r.deleted === false || r.deleted === "0")
  console.log(`[DICT_TYPE] 提取 ${active.length} 条字典类型`)

  const output = active.map((r) => ({
    id: String(r.id),
    name: r.name || "",
    type: r.type || "",
    status: r.status === "0" ? "ACTIVE" : "DISABLED",
    remark: r.remark || null,
  }))

  const content = `// Auto-generated\nexport const SEED_DICT_TYPES = ${JSON.stringify(output, null, 2)}\n`
  fs.writeFileSync(path.join(OUTPUT_DIR, "dict-types.seed.ts"), content)
  console.log(`[DICT_TYPE] 写入 seed-output/dict-types.seed.ts`)
}

// === 提取字典数据 ===
function extractDictData() {
  const rows = extractInserts("system_dict_data")
  const active = rows.filter((r) => r.deleted === false || r.deleted === "0")
  console.log(`[DICT_DATA] 提取 ${active.length} 条字典数据`)

  const output = active.map((r) => ({
    id: String(r.id),
    dictType: r.dict_type || "",
    label: r.label || "",
    value: r.value || "",
    sort: Number(r.sort) || 0,
    status: r.status === "0" ? "ACTIVE" : "DISABLED",
    colorType: r.color_type || null,
    remark: r.remark || null,
  }))

  const content = `// Auto-generated\nexport const SEED_DICT_DATA = ${JSON.stringify(output, null, 2)}\n`
  fs.writeFileSync(path.join(OUTPUT_DIR, "dict-data.seed.ts"), content)
  console.log(`[DICT_DATA] 写入 seed-output/dict-data.seed.ts`)
}

// === 提取部门 ===
function extractDepts() {
  const rows = extractInserts("system_dept")
  const active = rows.filter((r) => r.deleted === false || r.deleted === "0")
  console.log(`[DEPT] 提取 ${active.length} 条部门`)

  const output = active.map((r) => ({
    id: String(r.id),
    name: r.name || "",
    parentId: r.parent_id && r.parent_id !== "0" ? String(r.parent_id) : null,
    sort: Number(r.sort) || 0,
    leaderId: r.leader_user_id ? String(r.leader_user_id) : null,
    phone: r.phone || null,
    email: r.email || null,
    status: r.status === "0" ? "ACTIVE" : "DISABLED",
  }))

  const content = `// Auto-generated\nexport const SEED_DEPTS = ${JSON.stringify(output, null, 2)}\n`
  fs.writeFileSync(path.join(OUTPUT_DIR, "depts.seed.ts"), content)
  console.log(`[DEPT] 写入 seed-output/depts.seed.ts`)
}

// === 提取岗位 ===
function extractPosts() {
  const rows = extractInserts("system_post")
  const active = rows.filter((r) => r.deleted === false || r.deleted === "0")
  console.log(`[POST] 提取 ${active.length} 条岗位`)

  const output = active.map((r) => ({
    id: String(r.id),
    name: r.name || "",
    code: r.code || "",
    sort: Number(r.sort) || 0,
    status: r.status === "0" ? "ACTIVE" : "DISABLED",
    remark: r.remark || null,
  }))

  const content = `// Auto-generated\nexport const SEED_POSTS = ${JSON.stringify(output, null, 2)}\n`
  fs.writeFileSync(path.join(OUTPUT_DIR, "posts.seed.ts"), content)
  console.log(`[POST] 写入 seed-output/posts.seed.ts`)
}

// === Main ===
console.log("=== 从 ruoyi-vue-pro SQL 提取种子数据 ===\n")
extractMenus()
extractDictTypes()
extractDictData()
extractDepts()
extractPosts()
console.log("\n✅ 提取完成，输出目录:", OUTPUT_DIR)
console.log("下一步：将 seed-output/*.seed.ts 中的数据导入到各 Repository 的 MEMORY_STORE")
