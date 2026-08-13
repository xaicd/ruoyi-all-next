import { randomUUID } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { Client } from "pg"
import { SEED_DEPTS } from "../prisma/data/depts.seed-data"
import { SEED_MENUS } from "../prisma/data/menus.seed-data"
import { SEED_ROLES } from "../prisma/data/roles.seed-data"
import { SEED_USERS } from "../prisma/data/users.seed-data"

function databaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue
    const match = readFileSync(path, "utf8").match(/^DATABASE_URL\s*=\s*["']?([^\r\n"']+)/m)
    if (match?.[1]) return match[1].trim()
  }
  throw new Error("DATABASE_URL is required; copy .env.example or start the development infrastructure first.")
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
  const client = new Client({ connectionString: databaseUrl() })
  await client.connect()
  try {
    await client.query("BEGIN")
    for (const dept of SEED_DEPTS) {
      await client.query(`INSERT INTO system_dept (id, name, parent_id, sort, leader_id, phone, email, status, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,false) ON CONFLICT (id) DO NOTHING`, [dept.id, dept.name, dept.parentId, dept.sort, dept.leaderId, dept.phone, dept.email, dept.status, dept.tenantId, dept.createdAt, dept.updatedAt])
    }
    const adminSeed = SEED_USERS.find((user) => user.username === "admin")!
    const adminResult = await client.query<{ id: string }>(`INSERT INTO "system_user" (id, username, nickname, password, salt, phone, email, avatar, status, dept_id, remark, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,false) ON CONFLICT (username) DO UPDATE SET nickname = EXCLUDED.nickname, password = EXCLUDED.password, salt = EXCLUDED.salt, status = 'ACTIVE', deleted = false, updated_at = EXCLUDED.updated_at RETURNING id`, [randomUUID(), adminSeed.username, adminSeed.nickname, adminSeed.password, adminSeed.salt, adminSeed.phone, adminSeed.email, adminSeed.avatar, adminSeed.status, adminSeed.deptId, adminSeed.remark, adminSeed.tenantId, adminSeed.createdAt, new Date().toISOString()])
    const adminId = adminResult.rows[0].id
    const superAdminSeed = SEED_ROLES.find((role) => role.code === "super_admin")!
    const roleResult = await client.query<{ id: string }>(`INSERT INTO system_role (id, name, code, sort, status, remark, data_scope, tenant_id, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, status = 'ACTIVE', deleted = false, updated_at = EXCLUDED.updated_at RETURNING id`, [randomUUID(), superAdminSeed.name, superAdminSeed.code, superAdminSeed.sort, superAdminSeed.status, superAdminSeed.remark, superAdminSeed.dataScope, superAdminSeed.tenantId, superAdminSeed.createdAt, new Date().toISOString()])
    const roleId = roleResult.rows[0].id
    for (const menu of insertableMenus()) {
      await client.query(`INSERT INTO system_menu (id, name, permission, type, parent_id, path, component, icon, sort, status, visible, keep_alive, created_at, updated_at, deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,false) ON CONFLICT (id) DO NOTHING`, [menu.id, menu.name, menu.permission, menu.type, menu.parentId, menu.path, menu.component, menu.icon, menu.sort, menu.status, menu.visible, menu.keepAlive, menu.createdAt, menu.updatedAt])
    }
    await client.query(`INSERT INTO system_user_role (id, user_id, role_id) VALUES ($1,$2,$3) ON CONFLICT (user_id, role_id) DO NOTHING`, [randomUUID(), adminId, roleId])
    for (const menu of insertableMenus()) await client.query(`INSERT INTO system_role_menu (id, role_id, menu_id) VALUES ($1,$2,$3) ON CONFLICT (role_id, menu_id) DO NOTHING`, [randomUUID(), roleId, menu.id])
    await client.query("COMMIT")
    console.log(`[seed] PostgreSQL development access is ready: admin/admin123 (${SEED_MENUS.length} menu permissions).`)
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error("[seed] Failed:", error); process.exitCode = 1 })