/**
 * Schema Reader - 数据库表结构读取器
 *
 * 三种数据源模式：
 * 1. Prisma Schema 文件解析（离线模式，不需要数据库连接）
 * 2. Kysely Introspection（在线模式，从真实数据库读取）
 * 3. Mock 数据（开发/演示模式）
 *
 * 用途：代码生成器的数据源
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { hasRealDatabase, getDataSourceConfig } from "@/modules/shared/backend/lib/database"
import type {
  DbDialect,
  TableInfo,
  ColumnInfo,
  UiComponentType,
  IndexInfo,
} from "./schema-reader.types"
import { MOCK_TABLES } from "./schema-reader.types"
import { parsePrismaSchema } from "./schema-prisma-parser"
import { introspectFromDatabase } from "./schema-db-introspector"

export type {
  DbDialect,
  TableInfo,
  ColumnInfo,
  UiComponentType,
  IndexInfo,
} from "./schema-reader.types"

export class SchemaReaderService {
  /**
   * 获取所有表信息
   * 优先级：真实数据库 > Prisma Schema 文件 > Mock
   */
  static async listTables(schema = "public"): Promise<TableInfo[]> {
    domainLog.event("infra.schema.listTables", { schema })

    // 1. 有真实数据库连接时，从 DB introspect
    if (hasRealDatabase()) {
      try {
        return await introspectFromDatabase()
      } catch (e) {
        domainLog.event("infra.schema.introspectFailed", { error: String(e) })
      }
    }

    // 2. 解析 Prisma Schema 文件
    const prismaResult = parsePrismaSchema()
    if (prismaResult.length > 0) {
      return prismaResult
    }

    // 3. Fallback: Mock 数据
    return MOCK_TABLES
  }

  /**
   * 获取单表详细信息
   */
  static async getTable(tableName: string, schema = "public"): Promise<TableInfo | null> {
    domainLog.event("infra.schema.getTable", { tableName, schema })
    const tables = await SchemaReaderService.listTables(schema)
    return tables.find((t) => t.name === tableName) ?? null
  }

  /**
   * 根据表结构推断前端组件配置
   */
  static inferFormConfig(table: TableInfo): { field: string; label: string; component: UiComponentType; required: boolean }[] {
    return table.columns
      .filter((c) => c.uiComponent !== "HIDDEN")
      .map((c) => ({
        field: c.name,
        label: c.comment || c.name,
        component: c.uiComponent,
        required: !c.nullable,
      }))
  }

  /**
   * 获取当前数据源模式说明
   */
  static getSourceMode(): { mode: string; description: string } {
    if (hasRealDatabase()) {
      const config = getDataSourceConfig()
      return { mode: "database", description: `从 ${config.driver} 数据库实时读取` }
    }
    const prismaPath = path.resolve(process.cwd(), "prisma/schema.prisma")
    if (fs.existsSync(prismaPath)) {
      return { mode: "prisma-schema", description: "从 prisma/schema.prisma 文件解析" }
    }
    return { mode: "mock", description: "演示数据（内存模式）" }
  }
}

export const schemaReaderService = SchemaReaderService
