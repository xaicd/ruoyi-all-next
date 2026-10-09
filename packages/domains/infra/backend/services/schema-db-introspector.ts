/**
 * Database Introspection (Kysely Online Mode)
 */

import { getKyselyDb, getDataSourceConfig } from "@/modules/shared/backend/lib/database"
import type { TableInfo, ColumnInfo, DbDialect } from "./schema-reader.types"
import { mapColumnType, inferUiComponent } from "./schema-reader.types"

export async function introspectFromDatabase(): Promise<TableInfo[]> {
  const db = await getKyselyDb()
  const config = getDataSourceConfig()
  const dialect: DbDialect = config.protocolFamily === "mysql" ? "mysql" : "postgresql"

  if (dialect === "postgresql") {
    return introspectPostgres(db)
  }
  return introspectMysql(db)
}

export async function introspectPostgres(db: any): Promise<TableInfo[]> {
  const tablesResult = await db.selectFrom("information_schema.tables" as any)
    .select(["table_name", "table_type"])
    .where("table_schema", "=", "public")
    .where("table_type", "in", ["BASE TABLE", "VIEW"])
    .execute()

  const tables: TableInfo[] = []

  for (const tableRow of tablesResult) {
    const columnsResult = await db.selectFrom("information_schema.columns" as any)
      .select(["column_name", "data_type", "is_nullable", "column_default", "character_maximum_length"])
      .where("table_schema", "=", "public")
      .where("table_name", "=", tableRow.table_name)
      .orderBy("ordinal_position", "asc")
      .execute()

    const columns: ColumnInfo[] = columnsResult.map((col: any) => {
      const c: ColumnInfo = {
        name: col.column_name,
        type: col.data_type,
        tsType: mapColumnType(col.data_type, "postgresql"),
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default ?? undefined,
        isPrimary: false,
        isAutoIncrement: (col.column_default ?? "").includes("nextval"),
        maxLength: col.character_maximum_length ?? undefined,
        uiComponent: "INPUT",
      }
      c.uiComponent = inferUiComponent(c)
      return c
    })

    tables.push({
      name: tableRow.table_name,
      schema: "public",
      type: tableRow.table_type === "VIEW" ? "VIEW" : "TABLE",
      columns,
      primaryKey: [],
      indexes: [],
    })
  }

  return tables
}

export async function introspectMysql(db: any): Promise<TableInfo[]> {
  const tablesResult = await db.selectFrom("information_schema.tables" as any)
    .select(["table_name", "table_type", "table_comment"])
    .where("table_schema", "=", db.raw("DATABASE()"))
    .execute()

  const tables: TableInfo[] = []

  for (const tableRow of tablesResult) {
    const columnsResult = await db.selectFrom("information_schema.columns" as any)
      .select(["column_name", "data_type", "is_nullable", "column_default", "character_maximum_length", "column_comment", "extra"])
      .where("table_schema", "=", db.raw("DATABASE()"))
      .where("table_name", "=", tableRow.table_name)
      .orderBy("ordinal_position", "asc")
      .execute()

    const columns: ColumnInfo[] = columnsResult.map((col: any) => {
      const c: ColumnInfo = {
        name: col.column_name,
        type: col.data_type,
        tsType: mapColumnType(col.data_type, "mysql"),
        comment: col.column_comment || undefined,
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default ?? undefined,
        isPrimary: false,
        isAutoIncrement: (col.extra ?? "").includes("auto_increment"),
        maxLength: col.character_maximum_length ?? undefined,
        uiComponent: "INPUT",
      }
      c.uiComponent = inferUiComponent(c)
      return c
    })

    tables.push({
      name: tableRow.table_name,
      comment: tableRow.table_comment || undefined,
      schema: "public",
      type: tableRow.table_type === "VIEW" ? "VIEW" : "TABLE",
      columns,
      primaryKey: [],
      indexes: [],
    })
  }

  return tables
}
