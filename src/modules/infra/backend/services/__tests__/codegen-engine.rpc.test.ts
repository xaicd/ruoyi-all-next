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
    expect(service?.content).toContain("createDomainFacade")
    expect(service?.content).toContain("never import this Service")
  })

  it("wraps preview/generate as RPC-stable { files } payloads", async () => {
    const preview = await CodegenEngineService.previewCodegen(demoConfig)
    const generated = await CodegenEngineService.generateCodegen(demoConfig)
    expect(preview.files.some((item) => item.path.endsWith("demo-widget.rpc.ts"))).toBe(true)
    expect(generated.files).toHaveLength(preview.files.length)
  })
})
