import { describe, expect, it } from "vitest"
import { unzipSync, strFromU8 } from "fflate"
import { buildTemplateEngineZipResponse } from "./template-engine-archive"

describe("buildTemplateEngineZipResponse", () => {
  it("packs the manifest and generated files into a zip archive", async () => {
    const response = buildTemplateEngineZipResponse("next-react", {
      stack: "next-react",
      generatedAt: "2026-08-03T00:00:00.000Z",
      files: [
        {
          templateCode: "next-react-admin-page",
          path: "src/app/(admin)/admin/demo/page.tsx",
          content: "export default function DemoPage() { return null }",
          engine: "handlebars",
          category: "CRUD",
          templateType: "FRONTEND",
        },
      ],
    })

    expect(response.headers.get("content-type")).toBe("application/zip")
    expect(response.headers.get("content-disposition")).toContain("next-react-template.zip")

    const bytes = new Uint8Array(await response.arrayBuffer())
    const entries = unzipSync(bytes)

    expect(Object.keys(entries).sort()).toEqual([
      "manifest.json",
      "src/app/(admin)/admin/demo/page.tsx",
    ])
    expect(strFromU8(entries["manifest.json"])).toContain('"stack": "next-react"')
    expect(strFromU8(entries["src/app/(admin)/admin/demo/page.tsx"])).toContain("DemoPage")
  })
})