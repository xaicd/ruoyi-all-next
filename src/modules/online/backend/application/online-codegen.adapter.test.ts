import { describe, expect, it } from "vitest"
import { toOnlineCodegenConfig } from "./online-codegen.adapter"
import type { OnlineRuntimeRelease } from "./online-runtime.contract"

const runtime: OnlineRuntimeRelease = {
  definitionId: "definition-1", definitionCode: "check", definitionName: "测试用", modelType: "SINGLE", releaseId: "release-1", revisionId: "revision-1", schemaRevision: 1,
  model: { version: 1, storage: { kind: "MANAGED_TABLE" }, fields: [
    { code: "id", type: "string", nullable: false, systemManaged: true }, { code: "creator", type: "string", nullable: false, systemManaged: true }, { code: "create_time", type: "datetime", nullable: false, systemManaged: true }, { code: "updater", type: "string", nullable: false, systemManaged: true }, { code: "update_time", type: "datetime", nullable: false, systemManaged: true }, { code: "deleted", type: "boolean", nullable: false, systemManaged: true }, { code: "tenant_id", type: "string", nullable: false, systemManaged: true },
    { code: "biz_name", type: "string", nullable: false },
  ], indexes: [], relations: [] },
  interaction: { version: 1, fields: [
    "id", "creator", "create_time", "updater", "update_time", "deleted", "tenant_id"].map((code) => ({ code, label: code, widget: "TEXT" as const, query: { enabled: false }, visibility: { list: false, form: false, detail: false }, list: { sortable: false, summary: false }, form: { span: 12 }, detail: { formatter: "PLAIN" as const }, validation: { ruleKeys: [] }, readOnly: true })).concat([{ code: "biz_name", label: "业务名称", widget: "TEXT" as const, query: { enabled: true, operator: "LIKE" as const }, visibility: { list: true, form: true, detail: true }, list: { sortable: false, summary: false }, form: { span: 12 }, detail: { formatter: "PLAIN" as const }, validation: { ruleKeys: [] }, readOnly: false }]), actions: [{ code: "create", label: "新增", type: "CREATE", placement: "TOOLBAR", enabled: true }, { code: "update", label: "编辑", type: "UPDATE", placement: "ROW", enabled: true }, { code: "delete", label: "删除", type: "DELETE", placement: "ROW", enabled: true }] },
  views: [],
}

describe("Online managed-table codegen IR", () => {
  it("maps published release into codegen IR without calling infra engine", () => {
    const config = toOnlineCodegenConfig(runtime)
    expect(config.moduleName).toBe("online")
    expect(config.className).toBe("Check")
    expect(config.onlineRuntime?.storageKind).toBe("MANAGED_TABLE")
    expect(config.onlineRuntime?.releaseId).toBe("release-1")
    expect(config.permissionPrefix).toBe("online:check")
  })

  it("keeps an empty action list so generated UI can stay query-only", () => {
    const readOnlyRuntime: OnlineRuntimeRelease = { ...runtime, interaction: { ...runtime.interaction, actions: [] } }
    const config = toOnlineCodegenConfig(readOnlyRuntime)
    expect(config.advanced?.actions ?? []).toEqual([])
  })
})
