import { describe, it, expect, beforeEach } from "vitest"
import {
  ShardingEngine,
  createHashModShardingRule,
  createTimeMonthlyShardingRule,
} from "../sharding-engine"

describe("ShardingEngine (声明式分库分表与跨片聚合引擎)", () => {
  let engine: ShardingEngine

  beforeEach(() => {
    engine = new ShardingEngine()
  })

  it("哈希取模分片策略 (Hash Mod) 正确计算物理分片表", () => {
    const orderRule = createHashModShardingRule({
      logicalTable: "t_pay_order",
      shardingKey: "order_id",
      tableCount: 4,
    })
    engine.registerRule(orderRule)

    expect(engine.isShardingTable("t_pay_order")).toBe(true)
    expect(engine.resolveAllPhysicalTables("t_pay_order")).toEqual([
      "t_pay_order_0",
      "t_pay_order_1",
      "t_pay_order_2",
      "t_pay_order_3",
    ])

    // 数值与字符串路由确定性计算
    const tbl0 = engine.resolvePhysicalTable("t_pay_order", 0)
    const tbl1 = engine.resolvePhysicalTable("t_pay_order", 1)
    const tbl4 = engine.resolvePhysicalTable("t_pay_order", 4)
    expect(tbl0).toBe("t_pay_order_0")
    expect(tbl1).toBe("t_pay_order_1")
    expect(tbl4).toBe("t_pay_order_0")
  })

  it("时间范围按月分片策略 (Time Monthly) 精准路由年月物理表", () => {
    const logRule = createTimeMonthlyShardingRule({
      logicalTable: "t_access_log",
      shardingKey: "create_time",
      months: ["202601", "202602", "202603"],
    })
    engine.registerRule(logRule)

    // 传入 Date 对象
    const dateFeb = new Date("2026-02-15T10:00:00Z")
    expect(engine.resolvePhysicalTable("t_access_log", dateFeb)).toBe("t_access_log_202602")

    // 传入字符串
    expect(engine.resolvePhysicalTable("t_access_log", "2026-01-01")).toBe("t_access_log_202601")
  })

  it("智能查询路由：命中分片键则单表路由，缺少分片键则全片广播", () => {
    const orderRule = createHashModShardingRule({
      logicalTable: "t_pay_order",
      shardingKey: "order_id",
      tableCount: 4,
    })
    engine.registerRule(orderRule)

    // 携带 order_id 条件 -> 单表路由
    const single = engine.routeTablesForQuery("t_pay_order", [
      { field: "status", value: "PAID" },
      { field: "order_id", value: 2 },
    ])
    expect(single).toEqual(["t_pay_order_2"])

    // 不带 order_id 条件 -> 全表广播路由
    const broadcast = engine.routeTablesForQuery("t_pay_order", [
      { field: "status", value: "PAID" },
    ])
    expect(broadcast).toEqual([
      "t_pay_order_0",
      "t_pay_order_1",
      "t_pay_order_2",
      "t_pay_order_3",
    ])
  })

  it("跨分片聚合归并 (Scatter-Gather)：并发跨表查询、归并排序与内存分页", async () => {
    const orderRule = createHashModShardingRule({
      logicalTable: "t_pay_order",
      shardingKey: "order_id",
      tableCount: 3,
    })
    engine.registerRule(orderRule)

    // 模拟 3 个物理分片的数据
    const mockShardsData: Record<string, Array<{ id: number; amount: number }>> = {
      t_pay_order_0: [
        { id: 10, amount: 500 },
        { id: 1, amount: 100 },
      ],
      t_pay_order_1: [
        { id: 5, amount: 300 },
        { id: 2, amount: 200 },
      ],
      t_pay_order_2: [
        { id: 8, amount: 400 },
      ],
    }

    const result = await engine.executeScatterGather({
      logicalTable: "t_pay_order",
      queryFn: async (physicalTable) => mockShardsData[physicalTable] ?? [],
      orderBy: [{ field: "amount", order: "desc" }],
      offset: 1,
      limit: 3,
    })

    // 总计 5 条
    expect(result.total).toBe(5)
    // 降序排：500(id:10), 400(id:8), 300(id:5), 200(id:2), 100(id:1)
    // offset 1, limit 3 -> 400, 300, 200
    expect(result.items.map((i) => i.amount)).toEqual([400, 300, 200])
    expect(result.items.map((i) => i.id)).toEqual([8, 5, 2])
  })
})
