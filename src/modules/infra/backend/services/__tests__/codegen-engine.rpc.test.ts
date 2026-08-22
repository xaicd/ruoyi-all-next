import { describe, expect, it } from "vitest"
import { CodegenEngineService } from "../codegen-engine.service"

const demoConfig = {
  moduleName: "infra",
  className: "DemoWidget",
  businessName: "演示部件",
  template: "CRUD" as const,
  scene: "ADMIN" as const,
  generateFrontend: false,
  generateTest: false,
  table: {
    name: "demo_widget",
    comment: "demo",
    schema: "public",
    type: "TABLE" as const,
    columns: [
      { name: "id", type: "varchar", tsType: "string", nullable: false, isPrimary: true, isAutoIncrement: false, uiComponent: "HIDDEN" as const },
      { name: "name", type: "varchar", tsType: "string", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "INPUT" as const },
    ],
    primaryKey: ["id"],
    indexes: [],
  },
}

describe("CodegenEngineService dual-mode RPC", () => {
  it("emits an RPC binding file that forbids cross-domain Service imports", () => {
    const outputs = CodegenEngineService.generate(demoConfig)
    const rpc = outputs.find((item) => item.path.endsWith("demo-widget.rpc.ts"))
    const service = outputs.find((item) => item.type === "service")
    expect(rpc?.content).toContain("createDomainFacade")
    expect(rpc?.content).toContain('domain: "infra"')
    expect(rpc?.content).toContain("registerActionSchemas")
    expect(service?.content).toContain("createDomainFacade")
    expect(service?.content).toContain("never import this Service")
    expect(service?.content).not.toContain("MOCK_DATA")
    expect(service?.content).toContain("DemoWidgetRepository")
    const repository = outputs.find((item) => item.path.endsWith("demo-widget.repository.ts"))
    expect(repository?.content).toContain("hasRealDatabase")
    expect(repository?.content).toContain("insertDynamicRow")
    expect(repository?.content).toContain('TABLE_NAME = "demo_widget"')
    const actions = outputs.find((item) => item.path.endsWith("demo-widget.actions.ts"))
    const route = outputs.find((item) => item.path.endsWith("demo-widget/route.ts"))
    expect(actions?.content).toContain("DEMO_WIDGET_ACTION_SCHEMAS")
    expect(actions?.content).toContain("infra.pageDemoWidget")
    expect(route?.content).toContain("parseActionQuery")
    expect(route?.content).toContain("DEMO_WIDGET_ACTION_SCHEMAS")
    expect(route?.content).toContain("scope(auth)")
    const manifest = outputs.find((item) => item.path === "codegen-manifest.json")
    expect(manifest?.content).toContain("rpcActions")
  })

  it("wraps preview/generate as RPC-stable { files } payloads", async () => {
    const preview = await CodegenEngineService.previewCodegen(demoConfig)
    const generated = await CodegenEngineService.generateCodegen(demoConfig)
    expect(preview.files.some((item) => item.path.endsWith("demo-widget.rpc.ts"))).toBe(true)
    expect(generated.files).toHaveLength(preview.files.length)
  })

  it("generates managed-table CRUD that calls onlineFacade and shares ACTION_SCHEMAS", () => {
    const outputs = CodegenEngineService.generate({
      ...demoConfig,
      moduleName: "online",
      className: "Check",
      generateFrontend: true,
      generateTest: true,
      onlineRuntime: { definitionCode: "check", storageKind: "MANAGED_TABLE", releaseId: "release-1", schemaRevision: 1 },
      advanced: { actions: [] },
    })
    const service = outputs.find((item) => item.type === "service")!.content
    const route = outputs.find((item) => item.path.endsWith("check/route.ts"))!.content
    const actions = outputs.find((item) => item.path.endsWith("check.actions.ts"))!.content
    const page = outputs.find((item) => item.type === "page")!.content
    expect(outputs.some((item) => item.type === "permission")).toBe(false)
    expect(outputs.some((item) => item.path.includes("/repositories/"))).toBe(false)
    expect(service).toContain("onlineFacade")
    expect(service).toContain("pageManagedRecords")
    expect(service).not.toContain("KyselyOnlineManagedTableRuntimeRepository")
    expect(service).not.toContain("MOCK_DATA")
    expect(actions).toContain("online.pageCheck")
    expect(route).toContain("parseActionQuery")
    expect(route).toContain("CHECK_ACTION_SCHEMAS")
    expect(route).toContain("scope(auth)")
    expect(route).toContain('new ApiError("FORBIDDEN", "Tenant scope is required")')
    expect(route).toContain("INFRA_ONLINE_DEFINITION_QUERY")
    expect(page).toContain("当前发布版本未启用新增、编辑或删除动作，仅可查询。")
  })

  it("emits tenant-scoped Kysely persistence when the imported table has tenant_id", () => {
    const outputs = CodegenEngineService.generate({
      ...demoConfig,
      table: {
        ...demoConfig.table,
        columns: [
          ...demoConfig.table.columns,
          { name: "tenant_id", type: "varchar", tsType: "string", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "HIDDEN" as const },
        ],
      },
    })
    const repository = outputs.find((item) => item.path.endsWith("demo-widget.repository.ts"))!.content
    expect(repository).toContain("HAS_TENANT = true")
    expect(repository).toContain("Tenant scope is required")
    expect(repository).toContain("eqColumn(\"tenant_id\"")
  })
})
