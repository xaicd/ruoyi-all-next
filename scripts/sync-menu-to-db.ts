import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { sql } from "kysely"

async function main() {
  console.log("hasRealDatabase:", hasRealDatabase())
  try {
    const db = await getKyselyDb()
    
    // 1. 更新企业管理二级目录名称
    const res1 = await sql`
      UPDATE "system_menu" 
      SET "name" = '企业管理', "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = 'aigw-identity-dir' OR ("name" = '政企门户' AND "type" = 'DIR')
    `.execute(db)
    console.log("Updated directory to 企业管理")

    // 2. 更新成员席位
    const res2 = await sql`
      UPDATE "system_menu"
      SET "name" = '成员席位', "path" = 'tenant-members', "component" = 'aigw/tenant-members/index', "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = 'aigw-tenant-members' OR "name" = '成员份额'
    `.execute(db)
    console.log("Updated 成员份额 to 成员席位")

    // 3. 软删除/停用旧的席位分配/授权
    const res3 = await sql`
      UPDATE "system_menu"
      SET "deleted" = true, "status" = 'DISABLED', "visible" = false, "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = 'aigw-seats' OR "name" IN ('席位授权', '席位分配')
    `.execute(db)
    console.log("Disabled old 席位授权 / 席位分配")

    // 4. 更新算力开户与配额管控
    await sql`
      UPDATE "system_menu"
      SET "name" = '算力开户', "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = 'aigw-enterprises'
    `.execute(db)
    await sql`
      UPDATE "system_menu"
      SET "name" = '配额管控', "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = 'aigw-quotas'
    `.execute(db)

    // 查询当前菜单结果
    const rows = await sql<any>`
      SELECT "id", "name", "path", "type", "parent_id", "status", "deleted"
      FROM "system_menu"
      WHERE "parent_id" = 'aigw-identity-dir' OR "name" IN ('企业管理', '政企门户', '算力开户', '成员席位', '配额管控')
    `.execute(db)
    console.log("Current DB menus in 企业管理:", rows.rows)
  } catch (err: any) {
    console.error("Sync menu to DB failed:", err.message)
  }
}

main().catch(console.error)
