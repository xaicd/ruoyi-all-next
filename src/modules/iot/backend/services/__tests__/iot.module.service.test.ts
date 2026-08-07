import { describe, expect, it } from "vitest"
import { IotService } from ".."

describe("IotService module baseline", () => {
  it("listDevices 返回分页结果", async () => {
    const result = await IotService.listDevices({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("createDevice 重复 deviceKey 抛出错误", async () => {
    await expect(
      IotService.createDevice({ name: "重复设备", deviceKey: "SENSOR-TH-001", productId: "prod-001" }),
    ).rejects.toThrow("设备Key已存在")
  })

  it("listAlerts 返回分页结果", async () => {
    const result = await IotService.listAlerts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("handleAlert 不存在时抛出错误", async () => {
    await expect(
      IotService.handleAlert({ alertId: "not-exist", resolution: "测试" }),
    ).rejects.toThrow("告警记录不存在")
  })

  it("handleAlert 已处理时抛出错误", async () => {
    await expect(
      IotService.handleAlert({ alertId: "iot-alert-002", resolution: "重复处理" }),
    ).rejects.toThrow("告警已处理")
  })
})
