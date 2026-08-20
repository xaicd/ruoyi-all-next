export const nextReactAdminServiceTestTemplate = `import { describe, expect, it, vi } from "vitest"

import { {{serviceName}}Facade } from "@/modules/{{moduleName}}/backend/services/{{entityName}}.facade"

describe("{{serviceName}}Facade", () => {
  it("权限不足时拒绝执行", async () => {
    await expect(
      {{serviceName}}Facade.execute(
        { id: "id-1", action: "APPROVE" },
        { userId: "u-1", permissions: [] },
      ),
    ).rejects.toMatchObject({ code: "FORBIDDEN" })
  })

  it("满足权限时走成功路径并输出结构化结果", async () => {
    const result = await {{serviceName}}Facade.execute(
      { id: "id-1", action: "APPROVE" },
      { userId: "u-1", permissions: ["{{permissionUpdate}}"] },
    )

    expect(result).toMatchObject({
      id: "id-1",
      action: "APPROVE",
      updatedBy: "u-1",
    })
  })

  it("可挂接日志 spy（示例）", () => {
    const spy = vi.fn()
    spy("{{moduleName}}.{{featureKebab}}.execute.success")
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
`
