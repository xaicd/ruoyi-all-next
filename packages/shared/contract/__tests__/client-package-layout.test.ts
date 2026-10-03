import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"
import { collectClientPackageLayoutErrors } from "../client-package-layout"

// 裁剪过的工程可能不含 clients/（孵化 profile 会跳过客户端包），此时本用例不适用。
// 只看目录是否存在不够: 裁剪过的工程可能留下空的 clients/（内容被跳过），
// 此时没有可检查的包 —— 应该跳过，而不是报"布局不合规"。
const HAS_CLIENTS = (() => {
  const root = path.join(process.cwd(), "clients")
  if (!fs.existsSync(root)) return false
  return fs.readdirSync(root, { withFileTypes: true }).some(
    (entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "package.json")),
  )
})()
describe.skipIf(!HAS_CLIENTS)("clientPackageLayout", () => {
  it("keeps standalone client packages on the shared app/shared/modules layout", () => {
    expect(collectClientPackageLayoutErrors(process.cwd())).toEqual([])
  })
})
