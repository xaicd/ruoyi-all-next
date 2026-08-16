import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { sql, type RawBuilder } from "kysely"
import { compileOnlineRuntimeQueryConditions, validateOnlineRuntimeData } from "../../application/online-runtime.compiler"
import { fingerprintOnlineModelIR } from "../../application/online-schema-plan.compiler"
import type { OnlineRuntimeQueryCondition, OnlineRuntimeRelease } from "../../application/online-runtime.contract"
import { KyselyOnlineRuntimeRepository } from "./online-runtime.repository"

const identifier = /^[a-z][a-z0-9_]{1,63}$/
const systemColumns = new Set(["id", "creator", "create_time", "updater", "update_time", "deleted", "tenant_id"])

type ManagedContext = { runtime: OnlineRuntimeRelease; tableName: string }
type Scope = { tenantId: string; actorId: string; definitionCode: string; releaseId: string; schemaRevision: number }

function requireDatabase(): void {
  if (!hasRealDatabase()) throw new ApiError("DEPENDENCY_UNAVAILABLE", "Online 托管表 Runtime 需要已迁移的 PostgreSQL 数据库")
}
function tableIdentifier(value: string) {
  if (!identifier.test(value)) throw new ApiError("CONFLICT", "受管物理表标识无效")
  return sql.table(value)
}
function columnIdentifier(value: string) {
  if (!identifier.test(value)) throw new ApiError("CONFLICT", "受管字段标识无效")
  return sql.ref(value)
}
function requireAction(runtime: OnlineRuntimeRelease, type: "CREATE" | "UPDATE" | "DELETE"): void {
  if (!runtime.interaction.actions.some((action) => action.type === type && action.enabled)) throw new ApiError("FORBIDDEN", `当前 Published Release 未启用 ${type} 动作`)
}
function mapRow(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]))
}

export class KyselyOnlineManagedTableRuntimeRepository {
  private static async context(input: Scope): Promise<ManagedContext> {
    requireDatabase()
    const runtime = await KyselyOnlineRuntimeRepository.resolveCurrentPublishedRelease({ tenantId: input.tenantId, definitionCode: input.definitionCode })
    if (runtime.releaseId !== input.releaseId || runtime.schemaRevision !== input.schemaRevision) throw new ApiError("CONFLICT", "生成代码对应的 Published Release 已过期，请重新生成并审查代码")
    if (runtime.modelType !== "SINGLE" || runtime.model.storage.kind !== "MANAGED_TABLE") throw new ApiError("CONFLICT", "当前生成代码仅支持 SINGLE + MANAGED_TABLE Published Release")
    const db = await getKyselyDb()
    const registry = await db.selectFrom("online_managed_table").select(["physical_table_name", "schema_revision", "model_fingerprint"])
      .where("tenant_id", "=", input.tenantId).where("definition_id", "=", runtime.definitionId).executeTakeFirst()
    if (!registry) throw new ApiError("CONFLICT", "当前 Online Definition 尚未登记受管物理表")
    if (registry.schema_revision !== runtime.schemaRevision || registry.model_fingerprint !== fingerprintOnlineModelIR(runtime.model)) throw new ApiError("CONFLICT", "受管物理表与 Published Release 不一致，请先完成受控同步并重新发布")
    tableIdentifier(registry.physical_table_name)
    return { runtime, tableName: registry.physical_table_name }
  }

  static async page(input: Scope & { page: number; pageSize: number; conditions: OnlineRuntimeQueryCondition[] }) {
    const { runtime, tableName } = await this.context(input)
    const conditions = compileOnlineRuntimeQueryConditions(runtime, input.conditions)
    const predicates: RawBuilder<unknown>[] = [sql`${columnIdentifier("tenant_id")} = ${input.tenantId}`, sql`${columnIdentifier("deleted")} = false`]
    for (const condition of conditions) {
      const column = columnIdentifier(condition.field)
      if (condition.operator === "EQ") predicates.push(sql`${column} = ${condition.value as string | number | boolean | null}`)
      else if (condition.operator === "NE") predicates.push(sql`${column} <> ${condition.value as string | number | boolean | null}`)
      else if (condition.operator === "LIKE") predicates.push(sql`lower(${column}::text) LIKE lower(${`%${String(condition.value)}%`})`)
      else if (condition.operator === "IN") predicates.push(sql`${column} in (${sql.join((condition.value as Array<string | number | boolean | null>).map((value) => sql`${value}`))})`)
      else if (condition.operator === "BETWEEN") { const [from, to] = condition.value as Array<string | number | boolean | null>; predicates.push(sql`${column} between ${from} and ${to}`) }
      else if (condition.operator === "GT") predicates.push(sql`${column} > ${condition.value as string | number | boolean | null}`)
      else if (condition.operator === "GTE") predicates.push(sql`${column} >= ${condition.value as string | number | boolean | null}`)
      else if (condition.operator === "LT") predicates.push(sql`${column} < ${condition.value as string | number | boolean | null}`)
      else predicates.push(sql`${column} <= ${condition.value as string | number | boolean | null}`)
    }
    const where = sql.join(predicates, sql` and `)
    const db = await getKyselyDb()
    const totalRow = await sql<{ total: string }>`select count(*)::text as total from ${tableIdentifier(tableName)} where ${where}`.execute(db)
    const rows = await sql<Record<string, unknown>>`select * from ${tableIdentifier(tableName)} where ${where} order by ${columnIdentifier("update_time")} desc offset ${(input.page - 1) * input.pageSize} limit ${input.pageSize}`.execute(db)
    return { items: rows.rows.map(mapRow), total: Number(totalRow.rows[0]?.total ?? 0), page: input.page, pageSize: input.pageSize }
  }

  static async get(input: Scope & { id: string }) {
    const { tableName } = await this.context(input)
    const db = await getKyselyDb()
    const result = await sql<Record<string, unknown>>`select * from ${tableIdentifier(tableName)} where ${columnIdentifier("id")} = ${input.id} and ${columnIdentifier("tenant_id")} = ${input.tenantId} and ${columnIdentifier("deleted")} = false`.execute(db)
    if (!result.rows[0]) throw new ApiError("NOT_FOUND", "业务记录不存在")
    return mapRow(result.rows[0])
  }

  static async create(input: Scope & { data: Record<string, unknown> }) {
    const { runtime, tableName } = await this.context(input)
    requireAction(runtime, "CREATE")
    const data = validateOnlineRuntimeData(runtime, input.data, "CREATE")
    const values = { ...data, id: crypto.randomUUID(), creator: input.actorId, create_time: new Date(), updater: input.actorId, update_time: new Date(), deleted: false, tenant_id: input.tenantId }
    const columns = Object.keys(values).filter((column) => runtime.model.fields.some((field) => field.code === column) || systemColumns.has(column))
    const db = await getKyselyDb()
    const result = await sql<Record<string, unknown>>`insert into ${tableIdentifier(tableName)} (${sql.join(columns.map(columnIdentifier))}) values (${sql.join(columns.map((column) => sql`${values[column as keyof typeof values]}`))}) returning *`.execute(db)
    return mapRow(result.rows[0]!)
  }

  static async update(input: Scope & { id: string; data: Record<string, unknown> }) {
    const { runtime, tableName } = await this.context(input)
    requireAction(runtime, "UPDATE")
    const patch = validateOnlineRuntimeData(runtime, input.data, "UPDATE")
    const values = { ...patch, updater: input.actorId, update_time: new Date() }
    const assignments = Object.entries(values).map(([column, value]) => sql`${columnIdentifier(column)} = ${value}`)
    const db = await getKyselyDb()
    const result = await sql<Record<string, unknown>>`update ${tableIdentifier(tableName)} set ${sql.join(assignments)} where ${columnIdentifier("id")} = ${input.id} and ${columnIdentifier("tenant_id")} = ${input.tenantId} and ${columnIdentifier("deleted")} = false returning *`.execute(db)
    if (!result.rows[0]) throw new ApiError("NOT_FOUND", "业务记录不存在")
    return mapRow(result.rows[0])
  }

  static async delete(input: Scope & { id: string }): Promise<void> {
    const { runtime, tableName } = await this.context(input)
    requireAction(runtime, "DELETE")
    const db = await getKyselyDb()
    const result = await sql<Record<string, unknown>>`update ${tableIdentifier(tableName)} set ${columnIdentifier("deleted")} = true, ${columnIdentifier("updater")} = ${input.actorId}, ${columnIdentifier("update_time")} = ${new Date()} where ${columnIdentifier("id")} = ${input.id} and ${columnIdentifier("tenant_id")} = ${input.tenantId} and ${columnIdentifier("deleted")} = false returning ${columnIdentifier("id")}`.execute(db)
    if (!result.rows[0]) throw new ApiError("NOT_FOUND", "业务记录不存在")
  }
}
