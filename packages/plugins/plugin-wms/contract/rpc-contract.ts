/**
 * wms 域的跨域 RPC 契约（**代码**，不是 JSON）。
 *
 * 这是第一个按上游范式改造的域: 声明在这里，`rpc-actions.json` 与
 * `domain-service-loaders.ts` 都由生成器从它派生。
 * 未改造的域仍读 catalog 里的手写条目 —— 生成器会保留它们并在输出里点名。
 */
import { defineRpcContract } from "@/modules/shared/backend/lib/rpc-contract"

export const WMS_RPC_CONTRACT = defineRpcContract("wms", {
  ping: { schema: "ping" },
  listWarehouses: { service: "WmsService", module: "index", schema: "wmsPageQuerySchema", fieldsRef: "pageQuery" },
  checkin: { service: "WmsService", module: "index", schema: "wmsCheckinSchema" },
  // 库存不变量：erp/mes 等域经 Facade 调这几个，不各自实现扣减
  deductStock: { service: "inventoryStockOps", module: "inventory-stock-ops", target: "deductStock", schema: "wmsStockOpSchema" },
  lockStock: { service: "inventoryStockOps", module: "inventory-stock-ops", target: "lockStock", schema: "wmsStockOpSchema" },
  releaseStock: { service: "inventoryStockOps", module: "inventory-stock-ops", target: "releaseStock", schema: "wmsStockOpSchema" },
  replenishStock: { service: "inventoryStockOps", module: "inventory-stock-ops", target: "replenishStock", schema: "wmsStockOpSchema" },
})
