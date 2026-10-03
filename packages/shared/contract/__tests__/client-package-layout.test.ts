import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"
import { collectClientPackageLayoutErrors } from "../client-package-layout"

// 裁剪过的工程可能不含 clients/（孵化 profile 会跳过客户端包），此时本用例不适用。
const HAS_CLIENTS = fs.existsSync(path.join(process.cwd(), "clients"))
describe.skipIf(!HAS_CLIENTS)("clientPackageLayout", () => {
  it("keeps standalone client packages on the shared app/shared/modules layout", () => {
    expect(collectClientPackageLayoutErrors(process.cwd())).toEqual([])
  })
})
