/**
 * Appearance Service - 站点/主题外观配置（WordPress 式后台配→C 端呈现）
 *
 * 存储：直接读写 SQLite bootstrap 实际存在的 system_config 表（key/value:TEXT），
 * value = JSON.stringify(SiteAppearance)。不复用 InfraConfigRepository（其查 infra_config，
 * SQLite 下不存在 → 落内存不持久）。hasRealDatabase() 时走 Kysely system_config，否则内存兜底。
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import {
  siteAppearanceSchema,
  siteAppearanceUpdateSchema,
  DEFAULT_APPEARANCE,
  toPublicAppearance,
  type SiteAppearance,
} from "@/modules/infra/backend/validators/appearance.validators"

const APPEARANCE_KEY = "site.appearance"

// 内存兜底（仅无真实库时）
let MEMORY_VALUE: string | null = null

function parseOrDefault(raw: string | null): SiteAppearance {
  if (!raw) return { ...DEFAULT_APPEARANCE }
  try {
    // 用 schema.parse 回填缺失字段的默认值（保证前向兼容）
    return siteAppearanceSchema.parse(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_APPEARANCE }
  }
}

async function readRaw(): Promise<string | null> {
  if (hasRealDatabase()) {
    const db = await getKyselyDb()
    const row = await db
      .selectFrom("system_config")
      .select(["value"])
      .where("key", "=", APPEARANCE_KEY)
      .where("deleted", "=", 0 as any)
      .executeTakeFirst()
    return row?.value ?? null
  }
  return MEMORY_VALUE
}

async function writeRaw(value: string): Promise<void> {
  if (hasRealDatabase()) {
    const db = await getKyselyDb()
    const existing = await db
      .selectFrom("system_config")
      .select(["id"])
      .where("key", "=", APPEARANCE_KEY)
      .executeTakeFirst()
    if (existing) {
      await db
        .updateTable("system_config")
        .set({ value, updated_at: new Date().toISOString() } as any)
        .where("key", "=", APPEARANCE_KEY)
        .execute()
    } else {
      await db
        .insertInto("system_config")
        .values({
          id: `cfg-appearance-${Date.now()}`,
          category: "APPEARANCE",
          name: "站点外观配置",
          key: APPEARANCE_KEY,
          value,
          type: "SYSTEM",
          updated_at: new Date().toISOString(),
        } as any)
        .execute()
    }
    return
  }
  MEMORY_VALUE = value
}

export class AppearanceService {
  /** 读取完整外观配置（无配置返回默认，缺字段回填默认） */
  static async get(): Promise<SiteAppearance> {
    return parseOrDefault(await readRaw())
  }

  /** 后台更新（局部 merge） */
  static async update(patch: unknown): Promise<SiteAppearance> {
    const parsedPatch = siteAppearanceUpdateSchema.parse(patch ?? {})
    const current = await AppearanceService.get()
    const merged = siteAppearanceSchema.parse({ ...current, ...parsedPatch })
    await writeRaw(JSON.stringify(merged))
    domainLog.event("infra.appearance.update", { keys: Object.keys(parsedPatch) })
    domainLog.audit("infra.appearance.update", { targetType: "INFRA_APPEARANCE", targetId: APPEARANCE_KEY })
    return merged
  }

  /** C 端公开只读（脱敏） */
  static async getPublic() {
    return toPublicAppearance(await AppearanceService.get())
  }
}
