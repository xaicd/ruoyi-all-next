import { beforeEach, describe, expect, it } from "vitest"
import { clearCacheStore, cacheGet, cacheSet } from "./cache-store"
import { clearDatasources, getDatasource, registerDatasource } from "./persistence-datasource"
import { mapperPage } from "./persistence-mapper"
import { translateByDict } from "./persistence-translate"
import { clearMqListeners, mqPublish, mqSubscribe } from "./platform-mq"
import { clearWebsocketHub, listWebsocketMessages, websocketConnect, websocketSend } from "./platform-websocket"
import { clearMonitorStore, listTracerSpans, monitorIncrement, monitorRead, tracerRecord } from "./platform-monitor"
import { dictTranslate, excelToCsv } from "./platform-excel-dict"
import { clearTenantContext, getTenantContext, setTenantContext } from "./biz-tenant"
import { buildDataPermissionScope, hasDataPermission } from "./biz-data-permission"
import { resolveIpArea } from "./biz-ip-area"

describe("starter platform libs", () => {
  beforeEach(() => {
    clearCacheStore()
    clearDatasources()
    clearMqListeners()
    clearWebsocketHub()
    clearMonitorStore()
    clearTenantContext()
  })

  it("supports cache and datasource baselines", () => {
    cacheSet("k", "v", 1000)
    expect(cacheGet<string>("k")).toBe("v")

    registerDatasource({ name: "master", driver: "postgres", url: "postgres://localhost" })
    expect(getDatasource("master")?.driver).toBe("postgres")
  })

  it("supports mapper and translate baselines", () => {
    const page = mapperPage([1, 2, 3], 1, 2)
    expect(page.items).toEqual([1, 2])
    expect(translateByDict("A", { A: "启用" })).toBe("启用")
  })

  it("supports mq and websocket baselines", () => {
    const received: string[] = []
    mqSubscribe("t1", (message) => {
      received.push(String(message.payload))
    })
    mqPublish({ topic: "t1", payload: "hello", broker: "kafka" })
    expect(received).toEqual(["hello"])

    websocketConnect({ wsSessionId: "ws-1", userId: "u-1" })
    websocketSend("ws-1", "ping")
    expect(listWebsocketMessages().length).toBe(1)
  })

  it("supports monitor, excel, tenant, data-permission and ip-area", () => {
    monitorIncrement("api.qps", 2)
    tracerRecord("api.trace", 12)
    expect(monitorRead("api.qps")).toBe(2)
    expect(listTracerSpans().length).toBe(1)

    expect(dictTranslate("A", [{ value: "A", label: "可用" }])).toBe("可用")
    expect(excelToCsv(["id"], [["1"]])).toContain("id")

    setTenantContext({ tenantId: "t-1", isPlatform: false })
    expect(getTenantContext()?.tenantId).toBe("t-1")

    const scope = buildDataPermissionScope("SD-JN")
    expect(hasDataPermission(scope, "SD-JN-ZQ")).toBe(true)

    expect(resolveIpArea("127.0.0.1").province).toBe("Local")
  })
})
