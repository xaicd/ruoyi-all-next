import type { WmsCheckinInput, WmsPageQueryInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type WmsWarehouse = {
  id: string
  name: string
  code: string
  capacity: number
  occupied: number
}

const MOCK_WAREHOUSES: WmsWarehouse[] = [
  { id: "wms-wh-001", name: "东区一号仓", code: "WH-EAST-01", capacity: 10000, occupied: 4600 },
  { id: "wms-wh-002", name: "南区冷链仓", code: "WH-SOUTH-CC", capacity: 6000, occupied: 2100 },
]

export class WmsService {
  static async listWarehouses(input: WmsPageQueryInput) {
    domainLog.event("wms.warehouse.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_WAREHOUSES.filter(
          (item) => item.name.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword),
        )
      : MOCK_WAREHOUSES

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async checkin(input: WmsCheckinInput) {
    const warehouse = MOCK_WAREHOUSES.find((item) => item.id === input.warehouseId)
    if (!warehouse) {
      throw new Error("仓库不存在")
    }

    if (warehouse.occupied + input.quantity > warehouse.capacity) {
      throw new Error("入库后将超过仓容")
    }

    warehouse.occupied += input.quantity

    domainLog.event("wms.operation.checkin", {
      warehouseId: input.warehouseId,
      quantity: input.quantity,
    })
    domainLog.audit("wms.operation.checkin", {
      targetType: "WMS_WAREHOUSE",
      targetId: input.warehouseId,
      quantity: input.quantity,
    })

    return {
      warehouseId: warehouse.id,
      quantity: input.quantity,
      occupied: warehouse.occupied,
      capacity: warehouse.capacity,
      note: input.note ?? null,
    }
  }
}
