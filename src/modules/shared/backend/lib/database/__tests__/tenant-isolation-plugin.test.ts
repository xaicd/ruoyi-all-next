import { describe, expect, it } from "vitest"
import { DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler, type ColumnNode, type InsertQueryNode, type PrimitiveValueListNode, type SelectQueryNode, type ValueNode } from "kysely"
import { TenantIsolationPlugin } from "../tenant-isolation-plugin"
import { runWithTenantContext } from "../../biz-tenant"

function dummyDialect() {
  return {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db: any) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  }
}

const db = new Kysely({ dialect: dummyDialect() as any })
const plugin = new TenantIsolationPlugin()
const queryId = { queryId: "unit-test" }

function countTenantRefs(node: any): number {
  let count = 0
  const walk = (n: any) => {
    if (!n || typeof n !== "object") return
    if (n.kind === "ColumnNode" && n.column?.name === "tenant_id") count += 1
    for (const value of Object.values(n)) {
      if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value === "object") walk(value)
    }
  }
  walk(node)
  return count
}

function findTenantValue(node: any): unknown {
  let found: unknown
  const walk = (n: any) => {
    if (!n || typeof n !== "object") return
    if (
      n.kind === "BinaryOperationNode" &&
      n.leftOperand?.kind === "ColumnNode" &&
      n.leftOperand?.column?.name === "tenant_id" &&
      n.rightOperand?.kind === "ValueNode"
    ) {
      found = (n.rightOperand as ValueNode).value
      return
    }
    for (const value of Object.values(n)) {
      if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value === "object") walk(value)
    }
  }
  walk(node)
  return found
}

describe("TenantIsolationPlugin", () => {
  it("无租户上下文时不注入", () => {
    const node = db.selectFrom("ai_usage" as any).selectAll().compile().query
    const out = plugin.transformQuery({ queryId, node })
    expect(out).toBe(node)
  })

  it("平台上下文跳过注入", () => {
    runWithTenantContext({ tenantId: "p-1", isPlatform: true }, () => {
      const node = db.selectFrom("ai_usage" as any).selectAll().compile().query
      const out = plugin.transformQuery({ queryId, node })
      expect(out).toBe(node)
    })
  })

  it("有租户上下文时 select 自动注入 tenant_id 过滤", () => {
    runWithTenantContext({ tenantId: "t-2", isPlatform: false }, () => {
      const node = db.selectFrom("ai_usage" as any).selectAll().compile().query as SelectQueryNode
      const out = plugin.transformQuery({ queryId, node }) as SelectQueryNode
      expect(out.where).toBeDefined()
      expect(countTenantRefs(out)).toBe(1)
      expect(findTenantValue(out)).toBe("t-2")
    })
  })

  it("查询已含 tenant_id 条件时不重复注入", () => {
    runWithTenantContext({ tenantId: "t-3", isPlatform: false }, () => {
      const node = db.selectFrom("ai_usage" as any).selectAll().where("tenant_id" as any, "=", "t-3").compile().query as SelectQueryNode
      const out = plugin.transformQuery({ queryId, node }) as SelectQueryNode
      expect(countTenantRefs(out)).toBe(1)
    })
  })

  it("insert 自动填充 tenant_id", () => {
    runWithTenantContext({ tenantId: "t-4", isPlatform: false }, () => {
      const node = db.insertInto("ai_usage" as any).values({ id: "x1", model: "m" }).compile().query as InsertQueryNode
      const out = plugin.transformQuery({ queryId, node }) as InsertQueryNode
      const values = out.values as PrimitiveValueListNode
      expect(values.columns.some((c: ColumnNode) => c.column?.name === "tenant_id")).toBe(true)
      expect((values.values[0][values.values[0].length - 1] as ValueNode).value).toBe("t-4")
    })
  })

  it("非白名单表不注入", () => {
    runWithTenantContext({ tenantId: "t-5", isPlatform: false }, () => {
      const node = db.selectFrom("not_in_tenant_list" as any).selectAll().compile().query
      const out = plugin.transformQuery({ queryId, node })
      expect(out).toBe(node)
    })
  })

  it("update 自动合并 tenant_id 过滤", () => {
    runWithTenantContext({ tenantId: "t-6", isPlatform: false }, () => {
      const node = db.updateTable("ai_usage" as any).set({ model: "m2" }).compile().query
      const out = plugin.transformQuery({ queryId, node })
      expect(countTenantRefs(out)).toBe(1)
      expect(findTenantValue(out)).toBe("t-6")
    })
  })

  it("delete 自动合并 tenant_id 过滤", () => {
    runWithTenantContext({ tenantId: "t-7", isPlatform: false }, () => {
      const node = db.deleteFrom("ai_usage" as any).compile().query
      const out = plugin.transformQuery({ queryId, node })
      expect(countTenantRefs(out)).toBe(1)
      expect(findTenantValue(out)).toBe("t-7")
    })
  })
})
