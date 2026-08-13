import { createHash, randomUUID } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { Client } from "pg"
import { SEED_DEPTS } from "../prisma/data/depts.seed-data"
import { SEED_DICT_DATA } from "../prisma/data/dict-data.seed-data"
import { SEED_DICT_TYPES } from "../prisma/data/dict-types.seed-data"
import { SEED_MENUS } from "../prisma/data/menus.seed-data"
import { SEED_POSTS } from "../prisma/data/posts.seed-data"
import { SEED_ROLES } from "../prisma/data/roles.seed-data"
import { SEED_TENANT_PACKAGES } from "../prisma/data/tenant-packages.seed-data"
import { SEED_USERS } from "../prisma/data/users.seed-data"

function localEnvironment(): Record<string, string> {
  const values: Record<string, string> = {}
  for (const file of [".env", ".env.local"]) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?([^\r\n"']*)/)
      if (match) values[match[1]] = match[2].trim()
    }
  }
  return values
}

const environment = localEnvironment()
function requiredEnvironment(name: string): string {
  const value = process.env[name] ?? environment[name]
  if (!value) throw new Error(`${name} is required in .env.local for PostgreSQL bootstrap.`)
  return value
}
function passwordHash(password: string, salt: string): string {
  const md5 = (value: string) => createHash("md5").update(value).digest("hex")
  return md5(md5(password) + salt)
}
function assertStrongBootstrapPassword(password: string): void {
  if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password) || password === "admin123") {
    throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters and include uppercase, lowercase, number, and symbol; admin123 is forbidden.")
  }
}
function insertableMenus() {
  const ids = new Set(SEED_MENUS.map((menu) => menu.id))
  const pending = SEED_MENUS.map((menu) => ({ ...menu, parentId: menu.parentId && ids.has(menu.parentId) ? menu.parentId : null }))
  const ordered: typeof pending = []
  const inserted = new Set<string>()
  while (pending.length) {
    const index = pending.findIndex((menu) => !menu.parentId || inserted.has(menu.parentId))
    if (index < 0) throw new Error("Menu seed data contains a parent cycle")
    const [menu] = pending.splice(index, 1)
    ordered.push(menu)
    inserted.add(menu.id)
  }
  return ordered
}

async function main() {
  const client = new Client({ connectionString: requiredEnvironment("DATABASE_URL") })
  await client.connect()
  try {
    await client.query("BEGIN")

    for (const pkg of SEED_TENANT_PACKAGES) {
      await client.query(`INSERT INTO system_tenant_package (id, name, status, remark, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,false) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status, remark = EXCLUDED.remark, updated_at = EXCLUDED.updated_at, deleted = false`, [pkg.id, pkg.name, pkg.status, pkg.remark, pkg.createdAt, pkg.updatedAt])
    }

    await client.query(`INSERT INTO system_tenant (id, name, contact_name, contact_phone, domain, package_id, status, expire_time, account_count, created_at, updated_at, deleted) VALUES ('1','默认租户','管理员','13800000001',NULL,NULL,'ACTIVE','2030-12-31T23:59:59.000Z',999,'2026-01-01T00:00:00.000Z','2026-01-01T00:00:00.000Z',false) ON CONFLICT (id) DO NOTHING`)
    await client.query(`INSERT INTO system_tenant (id, name, contact_name, contact_phone, domain, package_id, status, expire_time, account_count, created_at, updated_at, deleted) VALUES ('2','演示租户','张三','13900000001','demo.ruoyi.local','111','ACTIVE','2027-06-30T23:59:59.000Z',50,'2026-03-01T00:00:00.000Z','2026-03-01T00:00:00.000Z',false) ON CONFLICT (id) DO UPDATE SET package_id = EXCLUDED.package_id, updated_at = EXCLUDED.updated_at, deleted = false`)

    for (const dept of SEED_DEPTS) {
      await client.query(`INSERT INTO system_dept (id, name, parent_id, sort, leader_id, phone, email, status, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,false) ON CONFLICT (id) DO NOTHING`, [dept.id, dept.name, dept.parentId, dept.sort, dept.leaderId, dept.phone, dept.email, dept.status, dept.tenantId, dept.createdAt, dept.updatedAt])
    }
    for (const role of SEED_ROLES) {
      await client.query(`INSERT INTO system_role (id, name, code, sort, status, remark, data_scope, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false) ON CONFLICT (code) DO NOTHING`, [role.id, role.name, role.code, role.sort, role.status, role.remark, role.dataScope, role.tenantId, role.createdAt, role.updatedAt])
    }
    for (const post of SEED_POSTS) {
      await client.query(`INSERT INTO system_post (id, name, code, sort, status, remark, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false) ON CONFLICT (code) DO NOTHING`, [post.id, post.name, post.code, post.sort, post.status, post.remark, post.tenantId, post.createdAt, post.updatedAt])
    }

    const typeIds = new Set(SEED_DICT_TYPES.map((item) => item.id))
    const missingTypeIds = [...new Set(SEED_DICT_DATA.filter((item) => !typeIds.has(item.dictTypeId)).map((item) => item.dictTypeId))]
    for (const type of SEED_DICT_TYPES) {
      await client.query(`INSERT INTO system_dict_type (id, name, type, status, remark, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,false) ON CONFLICT (type) DO NOTHING`, [type.id, type.name, type.type, type.status, type.remark, type.createdAt, type.updatedAt])
    }
    for (const id of missingTypeIds) {
      await client.query(`INSERT INTO system_dict_type (id, name, type, status, created_at, updated_at, deleted) VALUES ($1,$2,$3,'ACTIVE',$4,$4,false) ON CONFLICT (id) DO NOTHING`, [id, `补充字典类型：${id}`, `bootstrap_${id.replace(/[^A-Za-z0-9_]/g, "_")}`, new Date().toISOString()])
    }
    const seenDictDataIds = new Set<string>()
    for (const item of SEED_DICT_DATA) {
      const id = seenDictDataIds.has(item.id) ? `${item.id}-${item.dictTypeId}` : item.id
      seenDictDataIds.add(item.id)
      await client.query(`INSERT INTO system_dict_data (id, dict_type_id, label, value, sort, status, color_type, remark, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false) ON CONFLICT (id) DO NOTHING`, [id, item.dictTypeId, item.label, item.value, item.sort, item.status, item.colorType, item.remark, item.createdAt, item.updatedAt])
    }

    const bootstrapUsername = requiredEnvironment("ADMIN_BOOTSTRAP_USERNAME")
    const bootstrapPassword = requiredEnvironment("ADMIN_BOOTSTRAP_PASSWORD")
    const bootstrapSalt = requiredEnvironment("ADMIN_BOOTSTRAP_SALT")
    assertStrongBootstrapPassword(bootstrapPassword)
    const legacyDefaultHash = "9486c0e4d342d7b250ac3b27d3f211aa"
    await client.query(`UPDATE "system_user" SET status = 'DISABLED', updated_at = $1 WHERE username IN ('admin', 'ruoyi_local_operator') AND username <> $2`, [new Date().toISOString(), bootstrapUsername])
    await client.query(`DELETE FROM system_user_role AS ur USING "system_user" AS u WHERE ur.user_id = u.id AND u.username IN ('admin', 'ruoyi_local_operator') AND u.username <> $1`, [bootstrapUsername])
    const templateUser = SEED_USERS[0]
    const adminResult = await client.query<{ id: string }>(`INSERT INTO "system_user" (id, username, nickname, password, salt, phone, email, avatar, status, dept_id, remark, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACTIVE',$9,$10,$11,$12,$13,false) ON CONFLICT (username) DO UPDATE SET nickname = EXCLUDED.nickname, password = EXCLUDED.password, salt = EXCLUDED.salt, status = 'ACTIVE', deleted = false, updated_at = EXCLUDED.updated_at RETURNING id`, [randomUUID(), bootstrapUsername, "本地开发管理员", passwordHash(bootstrapPassword, bootstrapSalt), bootstrapSalt, templateUser.phone, templateUser.email, templateUser.avatar, templateUser.deptId, "本地环境专用管理员", templateUser.tenantId, templateUser.createdAt, new Date().toISOString()])
    const adminId = adminResult.rows[0].id
    for (const menu of insertableMenus()) {
      await client.query(`INSERT INTO system_menu (id, name, permission, type, parent_id, path, component, icon, sort, status, visible, keep_alive, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,false) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, permission = EXCLUDED.permission, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id, path = EXCLUDED.path, component = EXCLUDED.component, icon = EXCLUDED.icon, sort = EXCLUDED.sort, status = EXCLUDED.status, visible = EXCLUDED.visible, keep_alive = EXCLUDED.keep_alive, updated_at = EXCLUDED.updated_at, deleted = false`, [menu.id, menu.name, menu.permission, menu.type, menu.parentId, menu.path, menu.component, menu.icon, menu.sort, menu.status, menu.visible, menu.keepAlive, menu.createdAt, menu.updatedAt])
    }
    for (const pkg of SEED_TENANT_PACKAGES) {
      await client.query(`DELETE FROM system_tenant_package_menu WHERE package_id = $1`, [pkg.id])
      for (const menuId of pkg.menuIds) await client.query(`INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES ($1,$2,$3) ON CONFLICT (package_id, menu_id) DO NOTHING`, [randomUUID(), pkg.id, menuId])
    }
    // Historical all-next draft packages were not sourced from RuoYi. Keep rows for audit,
    // but remove them from the catalog after the demo tenant is reassigned to package 111.
    await client.query(`DELETE FROM system_tenant_package_menu WHERE package_id IN ('1', '2', '3')`)
    await client.query(`UPDATE system_tenant_package SET deleted = true, updated_at = $1 WHERE id IN ('1', '2', '3')`, [new Date().toISOString()])
    const roleResult = await client.query<{ id: string }>(`SELECT id FROM system_role WHERE code = 'super_admin' LIMIT 1`)
    const platformRoleResult = await client.query<{ id: string }>(`SELECT id FROM system_role WHERE code = 'platform-admin' LIMIT 1`)
    const roleId = roleResult.rows[0]?.id
    const platformRoleId = platformRoleResult.rows[0]?.id
    if (!roleId || !platformRoleId) throw new Error("super_admin and platform-admin roles must be seeded")
    for (const assignedRoleId of [roleId, platformRoleId]) {
      await client.query(`INSERT INTO system_user_role (id, user_id, role_id) VALUES ($1,$2,$3) ON CONFLICT (user_id, role_id) DO NOTHING`, [randomUUID(), adminId, assignedRoleId])
      for (const menu of insertableMenus()) await client.query(`INSERT INTO system_role_menu (id, role_id, menu_id) VALUES ($1,$2,$3) ON CONFLICT (role_id, menu_id) DO NOTHING`, [randomUUID(), assignedRoleId, menu.id])
    }
    await client.query("COMMIT")
    console.log(`[seed] PostgreSQL catalog seeded: ${SEED_ROLES.length} roles, ${SEED_DEPTS.length} departments, ${SEED_POSTS.length} posts, ${SEED_DICT_TYPES.length} dictionary types, ${SEED_DICT_DATA.length} dictionary entries, and ${SEED_MENUS.length} menus.`)
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error("[seed] Failed:", error); process.exitCode = 1 })