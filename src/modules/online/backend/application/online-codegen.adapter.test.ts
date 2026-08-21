import { describe, expect, it } from "vitest"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
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

describe("Online managed-table codegen", () => {
  it("generates tenant-scoped runtime CRUD instead of mock data", () => {
    const outputs = CodegenEngineService.generate(toOnlineCodegenConfig(runtime))
    const service = outputs.find((item) => item.type === "service")!.content
    const route = outputs.find((item) => item.type === "route")!.content
    const test = outputs.find((item) => item.type === "test")!.content
    expect(outputs.some((item) => item.type === "permission")).toBe(false)
    expect(service).toContain("onlineFacade")
    expect(service).toContain("pageManagedRecords")
    expect(service).not.toContain("KyselyOnlineManagedTableRuntimeRepository")
    expect(service).not.toContain("MOCK_DATA")
    expect(route).toContain("scope(auth)")
    expect(route).toContain('new ApiError("FORBIDDEN", "Tenant scope is required")')
    expect(route).toContain("INFRA_ONLINE_DEFINITION_QUERY")
    expect(test).toContain('from "../check.service"')
  })

  it("warns instead of rendering unreachable CRUD controls when no release actions exist", () => {
    const readOnlyRuntime: OnlineRuntimeRelease = { ...runtime, interaction: { ...runtime.interaction, actions: [] } }
    const page = CodegenEngineService.generate(toOnlineCodegenConfig(readOnlyRuntime)).find((item) => item.type === "page")!.content
    expect(page).toContain("当前发布版本未启用新增、编辑或删除动作，仅可查询。")
  })
})
