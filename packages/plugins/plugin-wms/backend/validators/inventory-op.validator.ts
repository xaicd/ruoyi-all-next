/**
 * 库存跨域操作的入参校验。
 *
 * 门禁要求 rpc-actions.json 里引用的 schema **落在本域 validators** 下，
 * 所以这里显式定义，而不是散落在各调用方。
 */
import { z } from "zod"

export const wmsStockOpSchema = z.object({
  inventoryId: z.string().min(1),
  /** 数量必须为正 —— 与 inventory-invariant 的契约一致（符号写错应为参数错，不是静默反向） */
  amount: z.number().positive(),
  /** 仅在 deduct 时有意义: 是否允许负库存 */
  allowNegative: z.boolean().optional(),
})

export type WmsStockOpInput = z.infer<typeof wmsStockOpSchema>
