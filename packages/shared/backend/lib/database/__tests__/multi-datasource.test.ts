import { describe, it, expect, beforeEach } from "vitest"
import {
  MultiDataSourceManager,
  runWithDataSource,
  getActiveDataSourceName,
} from "../multi-datasource-manager"
import { getKyselyDb } from "../kysely-client"
import { DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely"

function createMockKysely(): any {
  return new Kysely({
    dialect: {
      createAdapter: () => new SqliteAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: (db: any) => new SqliteIntrospector(db),
      createQueryCompiler: () => new SqliteQueryCompiler(),
    },
  })
}

describe("MultiDataSourceManager (动态多数据源引擎)", () => {
  let manager: MultiDataSourceManager

  beforeEach(() => {
    manager = new MultiDataSourceManager()
  })

  it("支持多数据源注册与检索", async () => {
    const dsPrimary = createMockKysely()
    const dsPay = createMockKysely()
    const dsCrm = createMockKysely()

    manager.registerDataSource("primary", dsPrimary)
    manager.registerDataSource("pay_db", dsPay)
    manager.registerDataSource("crm_db", dsCrm)

    expect(manager.listDataSources()).toEqual(["primary", "pay_db", "crm_db"])
    expect(await manager.getDataSource("pay_db")).toBe(dsPay)
    expect(await manager.getDataSource("crm_db")).toBe(dsCrm)
  })

  it("在 runWithDataSource 上下文中透明切换数据源并支持嵌套", async () => {
    expect(getActiveDataSourceName()).toBe("primary")

    await runWithDataSource("pay_db", async () => {
      expect(getActiveDataSourceName()).toBe("pay_db")

      // 嵌套多层切换到租户专有库
      await runWithDataSource("tenant_1001_db", async () => {
        expect(getActiveDataSourceName()).toBe("tenant_1001_db")
      })

      // 退出内层后恢复到外层 pay_db
      expect(getActiveDataSourceName()).toBe("pay_db")
    })

    // 退出后恢复到默认 primary
    expect(getActiveDataSourceName()).toBe("primary")
  })

  it("未注册的数据源抛出明确错误而非静默失败", async () => {
    await expect(manager.getDataSource("unknown_ds")).rejects.toThrow(/尚未注册/)
  })
})
