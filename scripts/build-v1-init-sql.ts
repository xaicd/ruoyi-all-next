import { execSync } from "node:child_process"
import { writeFileSync, mkdirSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { createHash } from "node:crypto"

import { SEED_DEPTS } from "../prisma/data/depts.seed-data"
import { SEED_DICT_DATA } from "../prisma/data/dict-data.seed-data"
import { SEED_DICT_TYPES } from "../prisma/data/dict-types.seed-data"
import { SEED_MENUS } from "../prisma/data/menus.seed-data"
import { withOnlineMenuCatalog } from "../src/modules/online/contract/menu-catalog"
import { withAigwMenuCatalog } from "../src/modules/aigw/contract/menu-catalog"
import { withAiMenuCatalog } from "../src/modules/ai/contract/menu-catalog"
import { SEED_POSTS } from "../prisma/data/posts.seed-data"
import { SEED_ROLES } from "../prisma/data/roles.seed-data"
import { SEED_TENANT_PACKAGES } from "../prisma/data/tenant-packages.seed-data"

function escapeSql(str: any): string {
  if (str === null || str === undefined) return "NULL"
  if (typeof str === "boolean") return str ? "TRUE" : "FALSE"
  if (typeof str === "number") return String(str)
  return "'" + String(str).replace(/'/g, "''") + "'"
}

async function main() {
  console.log("[BUILD-V1-INIT] Generating V1 PostgreSQL full initialization SQL...")

  // 1. 获取纯净 DDL
  const ddl = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script", { encoding: "utf-8" })

  // 2. 组装全量纯净 SEED 数据
  const fullMenus = withAiMenuCatalog(withAigwMenuCatalog(withOnlineMenuCatalog(SEED_MENUS)))

  // 拓扑排序 Menus
  const ids = new Set(fullMenus.map((m) => m.id))
  const pending = fullMenus.map((m) => ({ ...m, parentId: m.parentId && ids.has(m.parentId) ? m.parentId : null }))
  const orderedMenus: typeof pending = []
  const inserted = new Set<string>()
  while (pending.length) {
    const index = pending.findIndex((m) => !m.parentId || inserted.has(m.parentId))
    if (index < 0) break
    const [m] = pending.splice(index, 1)
    orderedMenus.push(m)
    inserted.add(m.id)
  }
  if (pending.length > 0) orderedMenus.push(...pending)

  let seedSql = `\n\n-- ==============================================================================\n-- SEED DATA (第一版全量初始数据 - 全部 4 字符工整菜单与系统初始配置)\n-- ==============================================================================\n\n`

  // 租户 (ID=1 默认系统租户)
  seedSql += `-- 1. 默认系统租户\n`
  seedSql += `INSERT INTO "system_tenant" ("id", "name", "package_id", "contact_user_name", "contact_mobile", "status", "expire_time", "account_count", "created_at", "updated_at") VALUES\n`
  seedSql += `('1', '系统默认租户', '1', '管理员', '13800000000', 'ACTIVE', '2099-12-31 23:59:59', 100, NOW(), NOW())\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 租户套餐
  seedSql += `-- 2. 租户套餐\n`
  const pkgValues = SEED_TENANT_PACKAGES.map((pkg: any) =>
    `(${escapeSql(pkg.id)}, ${escapeSql(pkg.name)}, ${escapeSql(pkg.status)}, ${escapeSql(JSON.stringify(pkg.menuIds))}, ${escapeSql(pkg.remark)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_tenant_package" ("id", "name", "status", "menu_ids", "remark", "created_at", "updated_at") VALUES\n${pkgValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 部门
  seedSql += `-- 3. 组织部门\n`
  const deptValues = SEED_DEPTS.map((d: any) =>
    `(${escapeSql(d.id)}, ${escapeSql(d.name)}, ${escapeSql(d.parentId)}, ${escapeSql(d.sort)}, ${escapeSql(d.leaderUserId)}, ${escapeSql(d.phone)}, ${escapeSql(d.email)}, ${escapeSql(d.status)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_dept" ("id", "name", "parent_id", "sort", "leader_user_id", "phone", "email", "status", "created_at", "updated_at") VALUES\n${deptValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 岗位
  seedSql += `-- 4. 岗位信息\n`
  const postValues = SEED_POSTS.map((p: any) =>
    `(${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.code)}, ${escapeSql(p.sort)}, ${escapeSql(p.status)}, ${escapeSql(p.remark)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_post" ("id", "name", "code", "sort", "status", "remark", "created_at", "updated_at") VALUES\n${postValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 角色
  seedSql += `-- 5. 角色信息 (含超级管理员、平台运营、渠道代理商)\n`
  const roleValues = SEED_ROLES.map((r: any) =>
    `(${escapeSql(r.id)}, ${escapeSql(r.name)}, ${escapeSql(r.code)}, ${escapeSql(r.sort)}, ${escapeSql(r.dataScope)}, ${escapeSql(r.status)}, ${escapeSql(r.type)}, ${escapeSql(r.remark)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_role" ("id", "name", "code", "sort", "data_scope", "status", "type", "remark", "created_at", "updated_at") VALUES\n${roleValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 菜单 (工整 4 字符)
  seedSql += `-- 6. 系统菜单与权限点 (已全面工整为 4 字符)\n`
  const menuValues = orderedMenus.map((m: any) =>
    `(${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.permission)}, ${escapeSql(m.type)}, ${escapeSql(m.parentId)}, ${escapeSql(m.path)}, ${escapeSql(m.component)}, ${escapeSql(m.icon)}, ${escapeSql(m.sort)}, ${escapeSql(m.status)}, ${m.visible ? 'TRUE' : 'FALSE'}, ${m.keepAlive ? 'TRUE' : 'FALSE'}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_menu" ("id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at") VALUES\n${menuValues}\nON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name", "path" = EXCLUDED."path", "component" = EXCLUDED."component", "permission" = EXCLUDED."permission";\n\n`

  // 字典类型
  seedSql += `-- 7. 数据字典类型\n`
  const dictTypeValues = SEED_DICT_TYPES.map((dt: any) =>
    `(${escapeSql(dt.id)}, ${escapeSql(dt.name)}, ${escapeSql(dt.type)}, ${escapeSql(dt.status)}, ${escapeSql(dt.remark)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_dict_type" ("id", "name", "type", "status", "remark", "created_at", "updated_at") VALUES\n${dictTypeValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 字典数据
  seedSql += `-- 8. 数据字典项\n`
  const dictDataValues = SEED_DICT_DATA.map((dd: any) =>
    `(${escapeSql(dd.id)}, ${escapeSql(dd.dictType)}, ${escapeSql(dd.label)}, ${escapeSql(dd.value)}, ${escapeSql(dd.sort)}, ${escapeSql(dd.status)}, ${escapeSql(dd.colorType)}, ${escapeSql(dd.cssClass)}, ${escapeSql(dd.remark)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_dict_data" ("id", "dict_type", "label", "value", "sort", "status", "color_type", "css_class", "remark", "created_at", "updated_at") VALUES\n${dictDataValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 初始超级管理员用户 (vps_adm 与 admin)
  seedSql += `-- 9. 平台超级管理员用户 (vps_adm & admin)\n`
  const salt = "ce51297c3af216ee"
  const md5 = (value: string) => createHash("md5").update(value).digest("hex")
  const encPwd = md5(md5("Vps_Admin159&w") + salt)

  seedSql += `INSERT INTO "system_user" ("id", "username", "password", "nickname", "remark", "dept_id", "post_ids", "email", "mobile", "sex", "avatar", "status", "login_ip", "login_date", "created_at", "updated_at") VALUES\n`
  seedSql += `('1', 'vps_adm', '${encPwd}', '平台超级管理员', '系统首创平台管理员', '100', '["1"]', 'admin@ruoyi.vip', '13800138000', 1, '', 'ACTIVE', '127.0.0.1', NOW(), NOW(), NOW()),\n`
  seedSql += `('2', 'admin', '${encPwd}', '系统管理员', '系统内置管理员', '100', '["1"]', 'admin2@ruoyi.vip', '13800138001', 1, '', 'ACTIVE', '127.0.0.1', NOW(), NOW(), NOW())\n`
  seedSql += `ON CONFLICT ("id") DO NOTHING;\n\n`

  // 用户与角色关联 (给 vps_adm 和 admin 绑定 super_admin 角色)
  seedSql += `-- 10. 用户角色关联\n`
  seedSql += `INSERT INTO "system_user_role" ("id", "user_id", "role_id", "created_at", "updated_at") VALUES\n`
  seedSql += `('ur-1', '1', '1', NOW(), NOW()),\n`
  seedSql += `('ur-2', '2', '1', NOW(), NOW())\n`
  seedSql += `ON CONFLICT ("id") DO NOTHING;\n\n`

  // 角色与所有菜单绑定
  seedSql += `-- 11. 超级管理员角色绑定全部菜单权限\n`
  const roleMenuValues = orderedMenus.map((m: any, idx: number) =>
    `('rm-${idx + 1}', '1', ${escapeSql(m.id)}, NOW(), NOW())`
  ).join(",\n")
  seedSql += `INSERT INTO "system_role_menu" ("id", "role_id", "menu_id", "created_at", "updated_at") VALUES\n${roleMenuValues}\nON CONFLICT ("id") DO NOTHING;\n\n`

  // 写入第一版完整初始化 SQL 文件
  const initDir = resolve(__dirname, "../sql/init")
  if (!existsSync(initDir)) mkdirSync(initDir, { recursive: true })

  const finalSql = `-- ==============================================================================\n-- ruoyi-all-next 第一版权威全量初始化 SQL (V1.0.0 PostgreSQL)\n-- 生成时间: ${new Date().toISOString()}\n-- 包含: 全 15 域完整 DDL + 工整 4 字符系统菜单 + 平台超管 + 完整业务种子数据\n-- ==============================================================================\n\n` + ddl + seedSql

  const targetPath = resolve(initDir, "ruoyi_all_next_v1.0.0_postgresql.sql")
  writeFileSync(targetPath, finalSql, "utf-8")
  console.log(`[BUILD-V1-INIT] Successfully generated: ${targetPath}`)
}

main().catch((err) => {
  console.error("[BUILD-V1-INIT] Failed:", err)
  process.exit(1)
})
