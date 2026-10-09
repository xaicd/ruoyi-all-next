/**
 * Prisma Schema File Parser (Offline Mode)
 */

import * as fs from "node:fs"
import * as path from "node:path"
import type { TableInfo, ColumnInfo } from "./schema-reader.types"
import { inferUiComponent } from "./schema-reader.types"

export function parsePrismaSchema(): TableInfo[] {
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma")
  if (!fs.existsSync(schemaPath)) return []

  const content = fs.readFileSync(schemaPath, "utf-8")
  const tables: TableInfo[] = []

  const modelRegex = /\/\/\/\s*(.+?)\n\s*model\s+(\w+)\s*\{([^}]+)\}/g
  let match: RegExpExecArray | null

  while ((match = modelRegex.exec(content)) !== null) {
    const comment = match[1].trim()
    const modelName = match[2]
    const body = match[3]

    const mapMatch = body.match(/@@map\("([^"]+)"\)/)
    const tableName = mapMatch ? mapMatch[1] : toSnakeCase(modelName)

    const columns: ColumnInfo[] = []
    const primaryKey: string[] = []

    const lines = body.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("//") && !l.startsWith("@@"))

    for (const line of lines) {
      if (line.includes("@relation") || line.startsWith("@@")) continue

      const fieldMatch = line.match(/^(\w+)\s+(\w+)(\?)?(.*)$/)
      if (!fieldMatch) continue

      const [, fieldName, fieldType, isOptional, attrs] = fieldMatch

      const baseTypes = ["String", "Int", "Float", "Boolean", "DateTime", "BigInt", "Decimal", "Json", "Bytes"]
      if (!baseTypes.includes(fieldType) && fieldType[0] === fieldType[0].toUpperCase()) continue

      const nullable = Boolean(isOptional)
      const isPrimary = attrs.includes("@id")
      const isAutoIncrement = attrs.includes("@default(autoincrement()") || attrs.includes("@default(cuid()") || attrs.includes("@default(uuid()")

      const colMapMatch = attrs.match(/@map\("([^"]+)"\)/)
      const colName = colMapMatch ? colMapMatch[1] : toSnakeCase(fieldName)

      const dbTypeMatch = attrs.match(/@db\.(\w+)\((\d+)\)/)
      const maxLength = dbTypeMatch ? Number(dbTypeMatch[2]) : undefined
      const dbType = dbTypeMatch ? dbTypeMatch[1].toLowerCase() : prismaTypeToDbType(fieldType)

      const defaultMatch = attrs.match(/@default\(([^)]+)\)/)
      const defaultValue = defaultMatch ? defaultMatch[1].replace(/"/g, "") : undefined

      if (isPrimary) primaryKey.push(colName)

      const tsType = prismaTypeToTsType(fieldType)
      const col: ColumnInfo = {
        name: colName,
        type: dbType,
        tsType,
        comment: undefined,
        nullable,
        defaultValue,
        isPrimary,
        isAutoIncrement,
        maxLength,
        uiComponent: "INPUT",
      }
      col.uiComponent = inferUiComponent(col)
      columns.push(col)
    }

    tables.push({
      name: tableName,
      comment,
      schema: "public",
      type: "TABLE",
      columns,
      primaryKey,
      indexes: [],
    })
  }

  return tables
}

export function prismaTypeToTsType(prismaType: string): string {
  const map: Record<string, string> = {
    String: "string",
    Int: "number",
    Float: "number",
    Boolean: "boolean",
    DateTime: "string",
    BigInt: "number",
    Decimal: "number",
    Json: "Record<string, unknown>",
    Bytes: "string",
  }
  return map[prismaType] ?? "string"
}

export function prismaTypeToDbType(prismaType: string): string {
  const map: Record<string, string> = {
    String: "varchar",
    Int: "integer",
    Float: "float8",
    Boolean: "boolean",
    DateTime: "timestamptz",
    BigInt: "int8",
    Decimal: "numeric",
    Json: "jsonb",
    Bytes: "bytea",
  }
  return map[prismaType] ?? "varchar"
}

export function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
}
