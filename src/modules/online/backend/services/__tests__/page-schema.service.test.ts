import { describe, expect, it } from "vitest"
import { PageSchemaService } from "../page-schema.service"
import { validateExtraValues } from "../../validators/page-schema.validators"

// 无 DB env → 内存兜底（ensureColumns 因无库被 try/catch 跳过，schema JSON 逻辑仍可测）。

describe("PageSchemaService", () => {
  it("空实体返回默认空 schema", async () => {
    const s = await PageSchemaService.get(`e_${Date.now()}`)
    expect(s.fields).toEqual([])
    expect(s.entity).toBeTruthy()
  })

  it("addField 追加字段并读回", async () => {
    const entity = `e_${Date.now()}`
    await PageSchemaService.addField(entity, { code: "vipNote", label: "备注", type: "text" })
    const after = await PageSchemaService.addField(entity, { code: "points", label: "积分", type: "number" })
    expect(after.fields.map((f) => f.code)).toEqual(["vipNote", "points"])
    const readback = await PageSchemaService.get(entity)
    expect(readback.fields).toHaveLength(2)
  })

  it("非法字段编码被拒（zod）", async () => {
    const entity = `e_${Date.now()}`
    await expect(PageSchemaService.addField(entity, { code: "1bad name", label: "x", type: "text" })).rejects.toThrow()
  })

  it("update 整体替换 fields", async () => {
    const entity = `e_${Date.now()}`
    const s = await PageSchemaService.update(entity, { title: "会员页", fields: [{ code: "grade", label: "等级", type: "select", options: [{ label: "金", value: "gold" }] }] })
    expect(s.title).toBe("会员页")
    expect(s.fields[0].type).toBe("select")
  })
})

describe("validateExtraValues", () => {
  const fields = [
    { code: "vipNote", label: "备注", type: "text" as const, required: true, showInList: true, showInForm: true, sort: 0 },
    { code: "points", label: "积分", type: "number" as const, required: false, showInList: true, showInForm: true, sort: 0 },
  ]

  it("必填缺失被拒", () => {
    const r = validateExtraValues(fields, { points: 10 })
    expect(r.ok).toBe(false)
  })

  it("数字类型非法被拒", () => {
    const r = validateExtraValues(fields, { vipNote: "x", points: "abc" })
    expect(r.ok).toBe(false)
  })

  it("合法值通过并归一化数字", () => {
    const r = validateExtraValues(fields, { vipNote: "钻石", points: "500" })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.points).toBe(500)
  })
})
